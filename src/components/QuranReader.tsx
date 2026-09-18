import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, Copy, Share2, ChevronUp, ChevronDown, Loader2, WifiOff, Languages } from "lucide-react";
import { surahs } from "@/data/surahs";
import { isBookmarked, addBookmark, removeBookmark } from "@/lib/bookmarks";
import { fetchCompleteSurah } from "@/lib/quranApi";
import { Ayah } from "@/types/quran";
import { toast } from "sonner";
import { getBengaliPhonetics } from "@/lib/bengaliPhonetics";

interface QuranReaderProps {
  surahId: number;
  onBack: () => void;
}

const TRANSLITERATION_PREF = "quran-pronunciation-mode";
type PronunciationMode = "off" | "english" | "bengali";

export default function QuranReader({ surahId, onBack }: QuranReaderProps) {
  const surah = surahs.find(s => s.id === surahId);
  const [ayahsList, setAyahsList] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(28);
  const [pronunciationMode, setPronunciationMode] = useState<PronunciationMode>(() => {
    try {
      const saved = localStorage.getItem(TRANSLITERATION_PREF);
      if (saved === "off" || saved === "english" || saved === "bengali") return saved;
      // Migrate the v1 boolean preference: enabled meant English.
      return localStorage.getItem("quran-show-transliteration") === "0" ? "off" : "english";
    } catch {
      return "english";
    }
  });
  const [, forceUpdate] = useState(0);

  const cyclePronunciation = () => {
    setPronunciationMode((mode) => {
      const next: PronunciationMode = mode === "off" ? "english" : mode === "english" ? "bengali" : "off";
      try {
        localStorage.setItem(TRANSLITERATION_PREF, next);
      } catch { /* private mode - preference just won't persist */ }
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCompleteSurah(surahId)
      .then(data => {
        if (!cancelled) {
          setAyahsList(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError("Could not load surah. Please check your internet connection and try again.");
          setLoading(false);
          console.error("Failed to fetch surah:", err);
        }
      });

    return () => { cancelled = true; };
  }, [surahId]);

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

  const handleShare = (ayah: Ayah) => {
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
            <button
              onClick={cyclePronunciation}
              aria-label={`Pronunciation: ${pronunciationMode}. Click to switch language`}
              title={`Pronunciation: ${pronunciationMode}`}
              className={`p-1.5 rounded hover:bg-muted transition-colors ${pronunciationMode !== "off" ? "text-gold" : "text-muted-foreground"}`}
            >
              <Languages className="w-4 h-4" />
            </button>
            <button onClick={() => setFontSize(s => Math.min(s + 2, 40))} className="p-1.5 rounded hover:bg-muted" aria-label="Increase text size">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button onClick={() => setFontSize(s => Math.max(s - 2, 20))} className="p-1.5 rounded hover:bg-muted" aria-label="Decrease text size">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Ayah count */}
        {!loading && !error && (
          <p className="text-center text-xs text-muted-foreground mt-1">
            {ayahsList.length} verses • {surah.revelationType === 'Meccan' ? 'মক্কায় অবতীর্ণ' : 'মদিনায় অবতীর্ণ'}
          </p>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gold animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Loading {surah.nameEnglish}...</p>
          <p className="text-xs text-muted-foreground mt-1">{surah.totalAyahs} verses</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <WifiOff className="w-8 h-8 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchCompleteSurah(surahId)
                .then(data => { setAyahsList(data); setLoading(false); })
                .catch(() => { setError("Still unable to load. Please try again later."); setLoading(false); });
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
          >
            Retry
          </button>
        </div>
      )}

      {/* Bismillah */}
      {!loading && !error && surahId !== 1 && surahId !== 9 && (
        <div className="text-center py-6 px-4">
          <p className="font-arabic text-gold text-2xl leading-relaxed">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Verses */}
      {!loading && !error && (
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
                <p className="font-arabic quran-arabic text-right mb-4 text-foreground" style={{ fontSize: `${fontSize}px` }} dir="rtl" lang="ar">
                  {ayah.arabicText}
                </p>

                {/* Pronunciation */}
                {pronunciationMode === "english" && ayah.transliteration && (
                  <p className="pronunciation-block text-sm text-gold/90 italic leading-relaxed mb-3 font-body">
                    {ayah.transliteration}
                  </p>
                )}

                {pronunciationMode === "bengali" && (
                  <p className="pronunciation-block text-sm text-gold/90 leading-relaxed mb-3 font-bangla" lang="bn">
                    {ayah.bengaliTransliteration || getBengaliPhonetics(ayah.arabicText)}
                  </p>
                )}

                {/* English */}
                <p className="translation-block text-sm text-muted-foreground leading-relaxed mb-2 font-body" lang="en">
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
