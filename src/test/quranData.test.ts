import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { surahs } from "@/data/surahs";

const EDITIONS = ["arabic", "en", "bn", "translit"] as const;
const TOTAL_SURAHS = 114;
const TOTAL_AYAHS = 6236;

function load(name: string): Record<string, string[]> {
  return JSON.parse(
    readFileSync(resolve(__dirname, `../../public/quran/quran-${name}.json`), "utf-8")
  );
}

const data = Object.fromEntries(EDITIONS.map((e) => [e, load(e)])) as Record<
  (typeof EDITIONS)[number],
  Record<string, string[]>
>;

describe("bundled Quran text", () => {
  it.each(EDITIONS)("%s has 114 surahs and 6236 ayahs", (edition) => {
    const d = data[edition];
    expect(Object.keys(d)).toHaveLength(TOTAL_SURAHS);
    expect(Object.values(d).reduce((n, v) => n + v.length, 0)).toBe(TOTAL_AYAHS);
  });

  it.each(EDITIONS)("%s has no empty verses", (edition) => {
    const empty = Object.entries(data[edition]).flatMap(([s, v]) =>
      v.map((t, i) => (t.trim() ? null : `${s}:${i + 1}`)).filter(Boolean)
    );
    expect(empty).toEqual([]);
  });

  it("verse counts agree across every edition", () => {
    for (let s = 1; s <= TOTAL_SURAHS; s++) {
      const counts = EDITIONS.map((e) => data[e][String(s)].length);
      expect(new Set(counts).size, `surah ${s} counts: ${counts.join(",")}`).toBe(1);
    }
  });

  it("verse counts match the surah index used for navigation", () => {
    for (const s of surahs) {
      expect(data.arabic[String(s.id)].length, `surah ${s.id} ${s.nameEnglish}`).toBe(
        s.totalAyahs
      );
    }
  });

  it("keeps the Bismillah as verse 1 of Al-Fatiha only", () => {
    // Al-Fatiha: the Bismillah genuinely is verse 1.
    expect(data.arabic["1"][0]).toContain("بِسْمِ");
    // Everywhere else it was an upstream prefix and must be gone, or the Arabic
    // would not line up with its translation.
    for (let s = 2; s <= TOTAL_SURAHS; s++) {
      expect(data.arabic[String(s)][0].startsWith("بِسْمِ"), `surah ${s}`).toBe(false);
    }
  });

  it("has no stray leading combining marks left by that strip", () => {
    const combining = /^[ً-ٰٟۖ-ۭ]/;
    const bad = Object.entries(data.arabic)
      .filter(([, v]) => combining.test(v[0]))
      .map(([s]) => s);
    expect(bad).toEqual([]);
  });

  it("contains no byte order marks", () => {
    for (const e of EDITIONS) {
      const hit = Object.values(data[e]).flat().some((t) => t.includes("﻿"));
      expect(hit, `${e} contains U+FEFF`).toBe(false);
    }
  });

  it("gives a usable pronunciation for a known verse", () => {
    expect(data.translit["1"][0]).toMatch(/Bismillaah/i);
    expect(data.translit["114"][0]).toMatch(/Qul/i);
  });
});
