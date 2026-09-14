import { Ayah } from "@/types/quran";
import { loadAllEditions, getVerses, isEditionLoaded } from "@/lib/quranData";
import { surahs } from "@/data/surahs";

const CACHE_PREFIX = "quran-surah-";
const API_BASE = "https://api.alquran.cloud/v1";

/**
 * Running total of ayahs before each surah, so a local verse can be given the
 * same global id (1-6236) the API would have assigned it. Bookmarks and search
 * results key off this, so it has to agree with the API's numbering.
 */
const AYAH_OFFSETS: number[] = (() => {
  const offsets = [0];
  for (let i = 0; i < surahs.length; i++) offsets.push(offsets[i] + surahs[i].totalAyahs);
  return offsets;
})();

function globalAyahId(surahId: number, ayahNumber: number): number {
  return (AYAH_OFFSETS[surahId - 1] ?? 0) + ayahNumber;
}

/** Build a surah from the bundled editions. Returns null if they aren't loaded. */
function buildFromLocal(surahId: number): Ayah[] | null {
  const arabic = getVerses("arabic", surahId);
  if (!arabic) return null;
  const en = getVerses("en", surahId);
  const bn = getVerses("bn", surahId);
  const tr = getVerses("translit", surahId);

  return arabic.map((text, i) => ({
    id: globalAyahId(surahId, i + 1),
    surahId,
    ayahNumber: i + 1,
    arabicText: text,
    englishTranslation: en?.[i] ?? "",
    banglaTranslation: bn?.[i] ?? "",
    transliteration: tr?.[i] ?? "",
    juzNumber: 0,
  }));
}

interface AlQuranAyah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
}

interface AlQuranSurahResponse {
  data: {
    ayahs: AlQuranAyah[];
  };
}

interface AlQuranSearchResult {
  data: {
    matches: Array<{
      number: number;
      text: string;
      numberInSurah: number;
      surah: { number: number; englishName: string };
      edition: { identifier: string };
    }>;
  };
}

// Fetch a single edition of a surah
async function fetchEdition(surahId: number, edition: string): Promise<AlQuranAyah[]> {
  const res = await fetch(`${API_BASE}/surah/${surahId}/${edition}`);
  if (!res.ok) throw new Error(`Failed to fetch ${edition} for surah ${surahId}`);
  const data: AlQuranSurahResponse = await res.json();
  return data.data.ayahs;
}

// Complete surah with Arabic + transliteration + English + Bangla.
// Served from the bundled text; the API is only a fallback if the bundle is
// unreachable (which also means the app is offline, so it will usually fail too).
export async function fetchCompleteSurah(surahId: number): Promise<Ayah[]> {
  try {
    await loadAllEditions();
    const local = buildFromLocal(surahId);
    if (local) return local;
  } catch (e) {
    console.warn("Bundled Quran text unavailable, falling back to API:", e);
  }

  const [arabicAyahs, englishAyahs, banglaAyahs, translitAyahs] = await Promise.all([
    fetchEdition(surahId, "quran-uthmani"),
    fetchEdition(surahId, "en.sahih"),
    fetchEdition(surahId, "bn.bengali"),
    fetchEdition(surahId, "en.transliteration").catch(() => [] as AlQuranAyah[]),
  ]);

  return arabicAyahs.map((ar, i) => ({
    id: ar.number,
    surahId,
    ayahNumber: ar.numberInSurah,
    arabicText: ar.text,
    englishTranslation: englishAyahs[i]?.text || "",
    banglaTranslation: banglaAyahs[i]?.text || "",
    transliteration: translitAyahs[i]?.text || "",
    juzNumber: ar.juz,
  }));
}

/** Warm the bundled text. Safe to call repeatedly; resolves even on failure. */
export async function preloadQuranText(): Promise<boolean> {
  try {
    await loadAllEditions();
    return true;
  } catch {
    return false;
  }
}

// Search the Quran API directly for a keyword (English edition)
export async function searchQuranAPI(query: string): Promise<Ayah[]> {
  try {
    // Search English translation
    const res = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}/all/en.sahih`);
    if (!res.ok) return [];
    const data: AlQuranSearchResult = await res.json();
    
    if (!data.data?.matches?.length) return [];

    // Get unique surah IDs from results
    const matches = data.data.matches.slice(0, 20);
    const surahIds = [...new Set(matches.map(m => m.surah.number))];

    // For each matched ayah, try to get full data (Arabic + Bangla)
    const results: Ayah[] = [];

    for (const match of matches) {
      const surahId = match.surah.number;
      const ayahNum = match.numberInSurah;

      // Check if we have cached data for this surah
      const cachedSurah = getCachedSurah(surahId);

      if (cachedSurah) {
        const found = cachedSurah.find(a => a.ayahNumber === ayahNum);
        if (found) {
          results.push(found);
          continue;
        }
      }

      // Otherwise create a partial result with English text
      results.push({
        id: match.number,
        surahId,
        ayahNumber: ayahNum,
        arabicText: "",
        englishTranslation: match.text,
        banglaTranslation: "",
        juzNumber: 0,
      });
    }

    // Try to enrich results without Arabic/Bangla by fetching individual ayahs
    const enrichPromises = results
      .filter(r => !r.arabicText)
      .slice(0, 5) // Limit enrichment to avoid too many requests
      .map(async (r) => {
        try {
          const [arRes, bnRes] = await Promise.all([
            fetch(`${API_BASE}/ayah/${r.id}/quran-uthmani`),
            fetch(`${API_BASE}/ayah/${r.id}/bn.bengali`),
          ]);
          if (arRes.ok) {
            const arData = await arRes.json();
            r.arabicText = arData.data?.text || "";
          }
          if (bnRes.ok) {
            const bnData = await bnRes.json();
            r.banglaTranslation = bnData.data?.text || "";
          }
        } catch { /* ignore enrichment failures */ }
      });

    await Promise.all(enrichPromises);

    return results;
  } catch (e) {
    console.error("API search failed:", e);
    return [];
  }
}

// Search Bangla translation via API
export async function searchQuranAPIBangla(query: string): Promise<Ayah[]> {
  try {
    const res = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}/all/bn.bengali`);
    if (!res.ok) return [];
    const data: AlQuranSearchResult = await res.json();
    
    if (!data.data?.matches?.length) return [];

    const matches = data.data.matches.slice(0, 15);
    const results: Ayah[] = [];

    for (const match of matches) {
      const cachedSurah = getCachedSurah(match.surah.number);
      if (cachedSurah) {
        const found = cachedSurah.find(a => a.ayahNumber === match.numberInSurah);
        if (found) { results.push(found); continue; }
      }
      results.push({
        id: match.number,
        surahId: match.surah.number,
        ayahNumber: match.numberInSurah,
        arabicText: "",
        englishTranslation: "",
        banglaTranslation: match.text,
        juzNumber: 0,
      });
    }

    return results;
  } catch {
    return [];
  }
}

export function isSurahCached(surahId: number): boolean {
  if (isEditionLoaded("arabic")) return true;
  return localStorage.getItem(CACHE_PREFIX + surahId) !== null;
}

export function getCachedSurah(surahId: number): Ayah[] | null {
  const local = buildFromLocal(surahId);
  if (local) return local;

  const cached = localStorage.getItem(CACHE_PREFIX + surahId);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

/** Built once from the bundle; 6236 objects is too many to rebuild per call. */
let allAyahsMemo: Ayah[] | null = null;

export function getAllCachedAyahs(): Ayah[] {
  if (isEditionLoaded("arabic")) {
    if (!allAyahsMemo) {
      const all: Ayah[] = [];
      for (let i = 1; i <= 114; i++) {
        const s = buildFromLocal(i);
        if (s) all.push(...s);
      }
      allAyahsMemo = all;
    }
    return allAyahsMemo;
  }

  const all: Ayah[] = [];
  for (let i = 1; i <= 114; i++) {
    const cached = localStorage.getItem(CACHE_PREFIX + i);
    if (!cached) continue;
    try {
      all.push(...JSON.parse(cached));
    } catch { /* skip corrupted entry */ }
  }
  return all;
}

// Searches the bundled text, so this now covers the whole Quran offline
// instead of only the surahs the reader happened to have opened.
export function searchCachedAyahs(query: string): Ayah[] {
  const needle = query.trim();
  if (!needle) return [];
  const q = needle.toLowerCase();
  return getAllCachedAyahs().filter(a =>
    a.arabicText.includes(needle) ||
    a.englishTranslation.toLowerCase().includes(q) ||
    a.banglaTranslation.includes(needle) ||
    (a.transliteration ?? "").toLowerCase().includes(q)
  ).slice(0, 50);
}

// Count how many surahs are readable offline
export function getCachedSurahCount(): number {
  if (isEditionLoaded("arabic")) return 114;
  let count = 0;
  for (let i = 1; i <= 114; i++) {
    if (localStorage.getItem(CACHE_PREFIX + i)) count++;
  }
  return count;
}

