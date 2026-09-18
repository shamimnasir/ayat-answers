import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { surahs } from "@/data/surahs";

type Edition = Record<string, string[]>;

function load(name: string): Edition {
  return JSON.parse(readFileSync(resolve(__dirname, `../../public/quran/${name}.json`), "utf8"));
}

describe("bundled Quran corpus audit", () => {
  it("contains every verse for all 114 surahs in every edition", () => {
    const editions = {
      arabic: load("quran-arabic"),
      english: load("quran-en"),
      bengali: load("quran-bn"),
      transliteration: load("quran-translit"),
    };
    const problems: string[] = [];
    let total = 0;

    expect(surahs).toHaveLength(114);
    for (let id = 1; id <= 114; id++) {
      const lengths = Object.entries(editions).map(([name, edition]) => [name, edition[String(id)]?.length ?? 0] as const);
      const expected = surahs[id - 1].totalAyahs;
      total += expected;
      for (const [name, length] of lengths) {
        if (length !== expected) problems.push(`surah ${id} ${name}: ${length}/${expected}`);
      }
      for (let verse = 0; verse < expected; verse++) {
        if (lengths.some(([, length]) => length <= verse || !editions.arabic[String(id)][verse]?.trim())) {
          problems.push(`surah ${id}:${verse + 1} missing text`);
        }
        if (!editions.bengali[String(id)][verse]?.trim()) problems.push(`surah ${id}:${verse + 1} missing Bengali translation`);
        if (!editions.transliteration[String(id)][verse]?.trim()) problems.push(`surah ${id}:${verse + 1} missing transliteration`);
      }
    }

    expect(total).toBe(6236);
    expect(problems, problems.slice(0, 20).join("\n")).toEqual([]);
  });
});
