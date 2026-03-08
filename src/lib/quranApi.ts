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

// Fetch a single edition of a surah
async function fetchEdition(surahId: number, edition: string): Promise<AlQuranAyah[]> {
  const res = await fetch(`${API_BASE}/surah/${surahId}/${edition}`);
  if (!res.ok) throw new Error(`Failed to fetch ${edition} for surah ${surahId}`);
  const data: AlQuranSurahResponse = await res.json();
  return data.data.ayahs;
}

// Fetch complete surah with Arabic + English + Bangla
export async function fetchCompleteSurah(surahId: number): Promise<Ayah[]> {
  // Check cache first
  const cached = localStorage.getItem(CACHE_PREFIX + surahId);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // Cache corrupted, re-fetch
    }
  }

  // Fetch all three editions in parallel
  const [arabicAyahs, englishAyahs, banglaAyahs] = await Promise.all([
    fetchEdition(surahId, "quran-uthmani"),
    fetchEdition(surahId, "en.sahih"),
    fetchEdition(surahId, "bn.bengali"),
  ]);

  // Combine into Ayah objects
  const ayahs: Ayah[] = arabicAyahs.map((ar, i) => ({
    id: ar.number,
    surahId,
    ayahNumber: ar.numberInSurah,
    arabicText: ar.text,
    englishTranslation: englishAyahs[i]?.text || "",
    banglaTranslation: banglaAyahs[i]?.text || "",
    juzNumber: ar.juz,
  }));

  // Cache for offline use
  try {
    localStorage.setItem(CACHE_PREFIX + surahId, JSON.stringify(ayahs));
  } catch {
    // localStorage full — clear oldest cached surahs
    clearOldestCache();
    try {
      localStorage.setItem(CACHE_PREFIX + surahId, JSON.stringify(ayahs));
    } catch {
      // Still can't store, just proceed without caching
    }
  }

  return ayahs;
}

// Check if a surah is cached
export function isSurahCached(surahId: number): boolean {
  return localStorage.getItem(CACHE_PREFIX + surahId) !== null;
}

// Get cached surah data (for offline/search)
export function getCachedSurah(surahId: number): Ayah[] | null {
  const cached = localStorage.getItem(CACHE_PREFIX + surahId);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

// Get all cached ayahs for search
export function getAllCachedAyahs(): Ayah[] {
  const all: Ayah[] = [];
  for (let i = 1; i <= 114; i++) {
    const cached = getCachedSurah(i);
    if (cached) all.push(...cached);
  }
  return all;
}

// Search across all cached ayahs
export function searchCachedAyahs(query: string): Ayah[] {
  const q = query.toLowerCase();
  return getAllCachedAyahs().filter(a =>
    a.arabicText.includes(query) ||
    a.englishTranslation.toLowerCase().includes(q) ||
    a.banglaTranslation.includes(query)
  ).slice(0, 50); // Limit results
}

function clearOldestCache() {
  // Remove first 10 cached surahs found
  let cleared = 0;
  for (let i = 1; i <= 114 && cleared < 10; i++) {
    const key = CACHE_PREFIX + i;
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      cleared++;
    }
  }
}
