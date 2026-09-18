import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { transliterationToBengali } from "@/lib/bengaliPhonetics";

function load(name: string): Record<string, string[]> {
  return JSON.parse(readFileSync(resolve(__dirname, `../../public/quran/${name}.json`), "utf8"));
}

describe("Bengali pronunciation full Quran audit", () => {
  it("covers every verse across all 114 surahs without source-script leftovers", () => {
    const arabic = load("quran-arabic");
    const translit = load("quran-translit");
    let total = 0;
    const malformed: string[] = [];

    for (let surah = 1; surah <= 114; surah++) {
      const verses = translit[String(surah)] ?? [];
      expect(verses.length, `surah ${surah} transliteration count`).toBe(arabic[String(surah)].length);
      verses.forEach((source, index) => {
        total++;
        const result = transliterationToBengali(source);
        if (!/[\u0980-\u09FF]/u.test(result) || /[A-Za-z]/u.test(result) || /[\u0600-\u06FF]/u.test(result)) {
          malformed.push(`${surah}:${index + 1} ${source} -> ${result}`);
        }
      });
    }

    expect(total).toBe(6236);
    expect(malformed, malformed.slice(0, 10).join("\n")).toEqual([]);
  });
});
