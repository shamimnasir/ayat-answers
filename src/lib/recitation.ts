export const RECITER_NAME = "Mishary Rashid Alafasy";
const AUDIO_BASE = "https://verses.quran.com/Alafasy/mp3/";
const AUDIO_CACHE = "alquran-audio-alafasy-v1";
const NO_BISMILLAH = new Set([1, 9]);

export interface Track {
  surahId: number;
  /** 0 is the Bismillah played before verse 1. */
  ayahNumber: number;
  url: string;
}

const pad = (n: number) => String(n).padStart(3, "0");

export function ayahAudioUrl(surahId: number, ayahNumber: number): string {
  return `${AUDIO_BASE}${pad(surahId)}${pad(ayahNumber)}.mp3`;
}

export function surahPlaylist(surahId: number, totalAyahs: number): Track[] {
  const tracks: Track[] = [];
  if (!NO_BISMILLAH.has(surahId)) tracks.push({ surahId, ayahNumber: 0, url: ayahAudioUrl(1, 1) });
  for (let a = 1; a <= totalAyahs; a++) tracks.push({ surahId, ayahNumber: a, url: ayahAudioUrl(surahId, a) });
  return tracks;
}

const urlsFor = (surahId: number, totalAyahs: number) => surahPlaylist(surahId, totalAyahs).map(t => t.url);

export async function isSurahDownloaded(surahId: number, totalAyahs: number): Promise<boolean> {
  const cache = await caches.open(AUDIO_CACHE);
  for (const url of urlsFor(surahId, totalAyahs)) {
    if (!(await cache.match(url))) return false;
  }
  return true;
}

export async function downloadSurah(
  surahId: number,
  totalAyahs: number,
  onProgress?: (fraction: number) => void,
): Promise<void> {
  const cache = await caches.open(AUDIO_CACHE);
  const urls = urlsFor(surahId, totalAyahs);
  let done = 0;
  let next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const url = urls[next++];
      if (!(await cache.match(url))) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
        await cache.put(url, res);
      }
      onProgress?.(++done / urls.length);
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
}

export async function deleteSurahDownload(surahId: number, totalAyahs: number): Promise<void> {
  const cache = await caches.open(AUDIO_CACHE);
  // The shared Bismillah stays: other downloaded surahs still play it.
  await Promise.all(urlsFor(surahId, totalAyahs).filter(u => u !== ayahAudioUrl(1, 1) || surahId === 1).map(u => cache.delete(u)));
}

/** A saved verse plays from the device; anything else streams. */
export async function resolvePlayableSrc(url: string): Promise<string> {
  try {
    const hit = await (await caches.open(AUDIO_CACHE)).match(url);
    if (hit) return URL.createObjectURL(await hit.blob());
  } catch { /* Cache Storage unavailable: stream instead */ }
  return url;
}
