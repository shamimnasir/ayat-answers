import { useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Copy, Share2, ChevronUp, ChevronDown } from "lucide-react";
import { surahs } from "@/data/surahs";
import { getAyahsBySurah } from "@/data/ayahs";
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/bookmarks";
import { toast } from "sonner";

interface QuranReaderProps {
  surahId: number;
  onBack: () => void;
}

export default function QuranReader({ surahId, onBack }: QuranReaderProps) {
  const surah = surahs.find(s => s.id === surahId);
  const ayahsList = getAyahsBySurah(surahId);
  const [fontSize, setFontSize] = useState(28);
  const [, forceUpdate] = useState(0);

  if (!surah) return null;

  const handleBookmark = (ayahNumber: number) => {
    if (isBookmarked(surahId, ayahNumber)) {
      removeBookmark(surahId, ayahNumber);
      toast("Bookmark removed");
    } else {
      addBookmark(surahId, ayahNumber);
      toast("Verse bookmarked");
    }
    forceUpdate(n => n + 1);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };

  const handleShare = (ayah: typeof ayahsList[0]) => {
    const text = `${ayah.arabicText}\n\n${ayah.englishTranslation}\n\n— ${surah.nameEnglish} (${surah.id}:${ayah.ayahNumber})`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      toast("Verse copied for sharing");
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center">
            <h2 className="font-semibold text-sm">{surah.nameEnglish}</h2>
            <p className="font-arabic text-gold text-lg leading-tight">{surah.nameArabic}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setFontSize(s => Math.min(s + 2, 40))} className="p-1.5 rounded hover:bg-muted">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button onClick={() => setFontSize(s => Math.max(s - 2, 20))} className="p-1.5 rounded hover:bg-muted">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bismillah */}
      {surahId !== 1 && surahId !== 9 && (
        <div className="text-center py-6 px-4">
          <p className="font-arabic text-gold text-2xl leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Verses */}
      {ayahsList.length === 0 ? (
        <div className="text-center py-16 px-4">
          <p className="text-muted-foreground">Verses for this Surah are not yet loaded in the local dataset.</p>
          <p className="text-sm text-muted-foreground mt-2">Complete Quran data will be available with the database integration.</p>
        </div>
      ) : (
        <div className="space-y-4 px-4 pt-2">
          {ayahsList.map((ayah) => {
            const bookmarked = isBookmarked(surahId, ayah.ayahNumber);

            return (
              <div key={ayah.id} className="verse-card animate-fade-in">
                {/* Ayah number bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="ayah-separator">
                    <span>{ayah.ayahNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleBookmark(ayah.ayahNumber)} className="p-1.5 rounded hover:bg-muted transition-colors">
                      {bookmarked ? <BookmarkCheck className="w-4 h-4 text-gold" /> : <Bookmark className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <button onClick={() => handleCopy(`${ayah.arabicText}\n${ayah.englishTranslation}`)} className="p-1.5 rounded hover:bg-muted transition-colors">
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleShare(ayah)} className="p-1.5 rounded hover:bg-muted transition-colors">
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Arabic */}
                <p className="font-arabic text-right leading-loose mb-4 text-foreground" style={{ fontSize: `${fontSize}px` }}>
                  {ayah.arabicText}
                </p>

                {/* English */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-2 font-body">
                  {ayah.englishTranslation}
                </p>

                {/* Bangla */}
                <p className="text-sm text-muted-foreground leading-relaxed font-bangla">
                  {ayah.banglaTranslation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
