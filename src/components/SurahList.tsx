import { surahs } from "@/data/surahs";

interface SurahListProps {
  onSelectSurah: (surahId: number) => void;
}

export default function SurahList({ onSelectSurah }: SurahListProps) {
  return (
    <div className="space-y-2 px-4 pb-24 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {surahs.map((surah) => {
        return (
          <button
            key={surah.id}
            onClick={() => onSelectSurah(surah.id)}
            className="verse-card w-full text-left flex items-center gap-4 group"
          >
            {/* Number badge */}
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <span className="text-sm font-semibold">{surah.id}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">{surah.nameEnglish}</h3>
                <span className="font-arabic text-lg text-gold">{surah.nameArabic}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground font-bangla">{surah.nameBangla}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{surah.totalAyahs} verses</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className={`text-xs ${surah.revelationType === 'Meccan' ? 'text-emerald-brand' : 'text-gold'}`}>
                  {surah.revelationType}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
