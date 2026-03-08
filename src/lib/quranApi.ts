import { Ayah } from "@/types/quran";

const CACHE_PREFIX = "quran-surah-";
const API_BASE = "https://api.alquran.cloud/v1";

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

// Fetch complete surah with Arabic + English + Bangla
export async function fetchCompleteSurah(surahId: number): Promise<Ayah[]> {
  const cached = localStorage.getItem(CACHE_PREFIX + surahId);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // Cache corrupted, re-fetch
    }
  }

  const [arabicAyahs, englishAyahs, banglaAyahs] = await Promise.all([
    fetchEdition(surahId, "quran-uthmani"),
    fetchEdition(surahId, "en.sahih"),
    fetchEdition(surahId, "bn.bengali"),
  ]);

  const ayahs: Ayah[] = arabicAyahs.map((ar, i) => ({
    id: ar.number,
    surahId,
    ayahNumber: ar.numberInSurah,
    arabicText: ar.text,
    englishTranslation: englishAyahs[i]?.text || "",
    banglaTranslation: banglaAyahs[i]?.text || "",
    juzNumber: ar.juz,
  }));

  try {
    localStorage.setItem(CACHE_PREFIX + surahId, JSON.stringify(ayahs));
  } catch {
    clearOldestCache();
    try {
      localStorage.setItem(CACHE_PREFIX + surahId, JSON.stringify(ayahs));
    } catch { /* ignore */ }
  }

  return ayahs;
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
      let cachedSurah = getCachedSurah(surahId);

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
  return localStorage.getItem(CACHE_PREFIX + surahId) !== null;
}

export function getCachedSurah(surahId: number): Ayah[] | null {
  const cached = localStorage.getItem(CACHE_PREFIX + surahId);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

export function getAllCachedAyahs(): Ayah[] {
  const all: Ayah[] = [];
  for (let i = 1; i <= 114; i++) {
    const cached = getCachedSurah(i);
    if (cached) all.push(...cached);
  }
  return all;
}

export function searchCachedAyahs(query: string): Ayah[] {
  const q = query.toLowerCase();
  return getAllCachedAyahs().filter(a =>
    a.arabicText.includes(query) ||
    a.englishTranslation.toLowerCase().includes(q) ||
    a.banglaTranslation.includes(query)
  ).slice(0, 50);
}

// Count how many surahs are cached
export function getCachedSurahCount(): number {
  let count = 0;
  for (let i = 1; i <= 114; i++) {
    if (localStorage.getItem(CACHE_PREFIX + i)) count++;
  }
  return count;
}

function clearOldestCache() {
  let cleared = 0;
  for (let i = 1; i <= 114 && cleared < 10; i++) {
    const key = CACHE_PREFIX + i;
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      cleared++;
    }
  }
}
