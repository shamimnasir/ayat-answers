import { useEffect, useState } from "react";
import { surahs } from "@/data/surahs";
import { getVerses, loadEdition } from "@/lib/quranData";
import { pickDailyVerse } from "@/data/dailyVerses";

interface DailyVerseProps {
  onSelectSurah: (surahId: number) => void;
}

interface Verse {
  surahId: number;
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  banglaTranslation: string;
}

export default function DailyVerse({ onSelectSurah }: DailyVerseProps) {
  const [ayah, setAyah] = useState<Verse | null>(null);

  useEffect(() => {
    let live = true;
    const [surahId, ayahNumber] = pickDailyVerse(new Date());
    Promise.all([loadEdition("arabic"), loadEdition("en"), loadEdition("bn")])
      .then(() => {
        if (!live) return;
        const text = (edition: "arabic" | "en" | "bn") => getVerses(edition, surahId)?.[ayahNumber - 1] ?? "";
        setAyah({
          surahId,
          ayahNumber,
          arabicText: text("arabic"),
          englishTranslation: text("en"),
          banglaTranslation: text("bn"),
        });
      })
      .catch(() => { /* the rest of the home screen still works without the card */ });
    return () => { live = false; };
  }, []);

  if (!ayah) return null;

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
