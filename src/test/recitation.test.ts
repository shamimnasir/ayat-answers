import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ayahAudioUrl,
  surahPlaylist,
  downloadSurah,
  isSurahDownloaded,
  deleteSurahDownload,
  resolvePlayableSrc,
} from "@/lib/recitation";

class FakeCache {
  store = new Map<string, Response>();
  async match(req: string) { return this.store.get(String(req))?.clone(); }
  async put(req: string, res: Response) { this.store.set(String(req), res); }
  async delete(req: string) { return this.store.delete(String(req)); }
}
const cache = new FakeCache();

beforeEach(() => {
  cache.store.clear();
  vi.stubGlobal("caches", { open: async () => cache });
  vi.stubGlobal("fetch", vi.fn(async () => new Response(new Blob(["mp3"], { type: "audio/mpeg" }), { status: 200 })));
  vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: () => "blob:cached" }));
});

describe("recitation audio", () => {
  it("builds zero-padded per-verse Alafasy URLs", () => {
    expect(ayahAudioUrl(2, 255)).toBe("https://verses.quran.com/Alafasy/mp3/002255.mp3");
    expect(ayahAudioUrl(1, 1)).toBe("https://verses.quran.com/Alafasy/mp3/001001.mp3");
  });

  it("starts each surah with the Bismillah except Al-Fatiha and At-Tawbah", () => {
    expect(surahPlaylist(112, 4).map(t => t.ayahNumber)).toEqual([0, 1, 2, 3, 4]);
    expect(surahPlaylist(112, 4)[0].url).toBe(ayahAudioUrl(1, 1));
    expect(surahPlaylist(1, 7).map(t => t.ayahNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(surahPlaylist(9, 3).map(t => t.ayahNumber)).toEqual([1, 2, 3]);
  });

  it("downloads every verse of a surah for offline listening and reports progress", async () => {
    const progress: number[] = [];
    await downloadSurah(112, 4, p => progress.push(p));
    expect(await isSurahDownloaded(112, 4)).toBe(true);
    expect(progress.at(-1)).toBe(1);
  });

  it("is not downloaded until every verse is saved", async () => {
    await cache.put(ayahAudioUrl(112, 1), new Response("x"));
    expect(await isSurahDownloaded(112, 4)).toBe(false);
  });

  it("plays saved audio from the device, and streams otherwise", async () => {
    expect(await resolvePlayableSrc(ayahAudioUrl(112, 1))).toBe(ayahAudioUrl(112, 1));
    await downloadSurah(112, 4);
    expect(await resolvePlayableSrc(ayahAudioUrl(112, 1))).toBe("blob:cached");
  });

  it("fails the download when a verse can't be fetched, without marking it downloaded", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 404 })));
    await expect(downloadSurah(112, 4)).rejects.toThrow();
    expect(await isSurahDownloaded(112, 4)).toBe(false);
  });

  it("removes a downloaded surah", async () => {
    await downloadSurah(112, 4);
    await deleteSurahDownload(112, 4);
    expect(await isSurahDownloaded(112, 4)).toBe(false);
  });
});
