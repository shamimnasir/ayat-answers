import { beforeAll, describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { normalizeForSearch, searchLocal } from "@/lib/localSearch";

beforeAll(() => {
  const dir = path.resolve(__dirname, "../../public/quran");
  const files: Record<string, string> = {
    "quran-arabic.json": readFileSync(path.join(dir, "quran-arabic.json"), "utf8"),
    "quran-en.json": readFileSync(path.join(dir, "quran-en.json"), "utf8"),
    "quran-bn.json": readFileSync(path.join(dir, "quran-bn.json"), "utf8"),
    "quran-translit.json": readFileSync(path.join(dir, "quran-translit.json"), "utf8"),
  };
  globalThis.fetch = (async (url: string) => {
    const body = files[String(url).split("/").pop()!];
    return new Response(body, { status: body ? 200 : 404 });
  }) as typeof fetch;
});

describe("normalizeForSearch", () => {
  it("strips Arabic diacritics and unifies alef forms so plain typing matches the Uthmani text", () => {
    expect(normalizeForSearch("ٱلرَّحْمَٰنِ")).toBe(normalizeForSearch("الرحمن"));
  });
});

describe("searchLocal (no network)", () => {
  it("finds verses for a natural-language English question by its keywords", async () => {
    const results = await searchLocal(["patience", "prayer"]);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(a => a.surahId === 2 && a.ayahNumber === 45)).toBe(true);
  });

  it("ranks verses matching more keywords first", async () => {
    const [top] = await searchLocal(["patience", "prayer"]);
    const text = top.englishTranslation.toLowerCase();
    expect(text).toContain("patience");
    expect(text).toContain("prayer");
  });

  it("matches Arabic typed without diacritics", async () => {
    const results = await searchLocal(["الرحمن الرحيم"]);
    expect(results.some(a => a.surahId === 1 && a.ayahNumber === 3)).toBe(true);
  });

  it("matches Bangla keywords", async () => {
    const results = await searchLocal(["ধৈর্য"]);
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns nothing for empty input", async () => {
    expect(await searchLocal([" ", ""])).toEqual([]);
  });
});
