import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { arabicToBengaliPhonetics, transliterationToBengali } from "@/lib/bengaliPhonetics";

describe("Bengali phonetics", () => {
  it("renders known words in Bengali script", () => {
    expect(arabicToBengaliPhonetics("بِسْمِ ٱللَّهِ", "Bismillaahir Rahmaanir Raheem")).toBe("বিসমিল্লাহির রাহমানির রাহিম");
  });

  it("handles Arabic diacritics without emitting Arabic marks", () => {
    const result = arabicToBengaliPhonetics("قُلْ هُوَ اللَّهُ أَحَدٌ", "Qul huwa Allaahu Ahad");
    expect(result).toMatch(/[\u0985-\u09B9]/u);
    expect(result).not.toMatch(/[\u064B-\u065F\u0670]/u);
  });

  it("does not return an empty value for a real verse", () => {
    expect(arabicToBengaliPhonetics("الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "Alhamdu lillaahi Rabbil 'aalameen")).toBeTruthy();
  });

  it("keeps common long-vowel forms readable", () => {
    expect(transliterationToBengali("Wa ilaika")).toBe("ওয়া ইলাইকা");
    expect(transliterationToBengali("Allazeena yu'minoona")).toBe("আল্লাযীনা ইয়ুমিনূনা");
  });

  it("generates a non-empty Bengali value for every bundled ayah", () => {
    const arabic = JSON.parse(
      readFileSync(resolve(__dirname, "../../public/quran/quran-arabic.json"), "utf8")
    ) as Record<string, string[]>;
    const translit = JSON.parse(
      readFileSync(resolve(__dirname, "../../public/quran/quran-translit.json"), "utf8")
    ) as Record<string, string[]>;
    const verses = Object.values(arabic).flat();
    const transliterations = Object.values(translit).flat();
    expect(verses).toHaveLength(6236);
    expect(transliterations).toHaveLength(6236);
    for (let i = 0; i < verses.length; i++) {
      const result = arabicToBengaliPhonetics(verses[i], transliterations[i]);
      expect(result.trim()).toBeTruthy();
      expect(result).toMatch(/[\u0980-\u09FF]/u);
    }
  });
});
