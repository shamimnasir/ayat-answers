import { useMemo } from "react";
import { surahs } from "@/data/surahs";
import { getAllCachedAyahs } from "@/lib/quranApi";
import { ayahs as fallbackAyahs } from "@/data/ayahs";
import { Ayah } from "@/types/quran";

interface DailyVerseProps {
  onSelectSurah: (surahId: number) => void;
}

export default function DailyVerse({ onSelectSurah }: DailyVerseProps) {
  const ayah = useMemo(() => {
    // Use cached data if available, otherwise fallback
    const allCached = getAllCachedAyahs();
    const pool: Ayah[] = allCached.length > 0 ? allCached : fallbackAyahs;
    // Use date-based seed for consistent daily verse
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return pool[seed % pool.length];
  }, []);

  const surah = surahs.find(s => s.id === ayah.surahId);

  return (
    <button
      onClick={() => onSelectSurah(ayah.surahId)}
      className="w-full text-left islamic-pattern rounded-2xl p-6 border border-gold/20 hover:border-gold/40 transition-all"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold">Ayah of the Day</span>
        <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
      </div>

      <p className="font-arabic text-right text-2xl leading-loose text-foreground mb-4">
        {ayah.arabicText}
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed mb-2 font-body italic">
        "{ayah.englishTranslation}"
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed font-bangla mb-3">
        {ayah.banglaTranslation}
      </p>

      <p className="text-xs text-gold font-semibold">
        — {surah?.nameEnglish} ({ayah.surahId}:{ayah.ayahNumber})
      </p>
    </button>
  );
}
