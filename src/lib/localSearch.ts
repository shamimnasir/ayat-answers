import { Ayah } from "@/types/quran";
import { loadAllEditions } from "@/lib/quranData";
import { getAllCachedAyahs } from "@/lib/quranApi";

// Harakat, Quranic annotation marks, superscript alef and tatweel.
const ARABIC_MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;

export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFC")
    .replace(ARABIC_MARKS, "")
    .replace(/[ٱأإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

type Indexed = { ayah: Ayah; text: string };
let index: Indexed[] | null = null;

async function getIndex(): Promise<Indexed[]> {
  if (index) return index;
  await loadAllEditions();
  index = getAllCachedAyahs().map(ayah => ({
    ayah,
    text: normalizeForSearch(
      [ayah.arabicText, ayah.englishTranslation, ayah.banglaTranslation, ayah.transliteration ?? ""].join(" ")
    ),
  }));
  return index;
}

/** Search the bundled Quran by keyword; verses matching more keywords rank first. */
export async function searchLocal(keywords: string[], limit = 50): Promise<Ayah[]> {
  const terms = [...new Set(keywords.map(normalizeForSearch).filter(Boolean))];
  if (terms.length === 0) return [];

  const scored: { ayah: Ayah; score: number }[] = [];
  for (const { ayah, text } of await getIndex()) {
    const score = terms.reduce((n, t) => (text.includes(t) ? n + 1 : n), 0);
    if (score > 0) scored.push({ ayah, score });
  }
  scored.sort((a, b) => b.score - a.score || a.ayah.id - b.ayah.id);
  return scored.slice(0, limit).map(s => s.ayah);
}
