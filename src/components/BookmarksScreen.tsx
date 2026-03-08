import { getBookmarks } from "@/lib/bookmarks";
import { surahs } from "@/data/surahs";
import { ayahs } from "@/data/ayahs";
import { removeBookmark } from "@/lib/bookmarks";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookmarksScreenProps {
  onSelectSurah: (surahId: number) => void;
}

export default function BookmarksScreen({ onSelectSurah }: BookmarksScreenProps) {
  const [bookmarks, setBookmarks] = useState(getBookmarks());

  const handleRemove = (surahId: number, ayahNumber: number) => {
    setBookmarks(removeBookmark(surahId, ayahNumber));
    toast("Bookmark removed");
  };

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <p className="text-muted-foreground text-lg">No bookmarks yet</p>
        <p className="text-sm text-muted-foreground mt-1">Bookmark verses while reading to save them here</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24 space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider pt-4 pb-2">
        {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
      </p>
      {bookmarks.map((bm) => {
        const surah = surahs.find(s => s.id === bm.surahId);
        const ayah = ayahs.find(a => a.surahId === bm.surahId && a.ayahNumber === bm.ayahNumber);

        return (
          <div key={`${bm.surahId}-${bm.ayahNumber}`} className="verse-card animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => onSelectSurah(bm.surahId)} className="text-xs bg-accent px-2 py-0.5 rounded-full text-gold font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                {surah?.nameEnglish} {bm.surahId}:{bm.ayahNumber}
              </button>
              <button onClick={() => handleRemove(bm.surahId, bm.ayahNumber)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {ayah && (
              <>
                <p className="font-arabic text-right text-lg leading-relaxed mb-2">{ayah.arabicText}</p>
                <p className="text-xs text-muted-foreground">{ayah.englishTranslation}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
