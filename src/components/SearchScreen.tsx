import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { searchCachedAyahs } from "@/lib/quranApi";
import { searchAyahs } from "@/data/ayahs";
import { surahs } from "@/data/surahs";
import { Ayah } from "@/types/quran";

interface SearchScreenProps {
  onSelectSurah: (surahId: number) => void;
}

export default function SearchScreen({ onSelectSurah }: SearchScreenProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Ayah[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      // Search both cached API data and local fallback data
      const cachedResults = searchCachedAyahs(q.trim());
      const localResults = searchAyahs(q.trim());

      // Merge and deduplicate by id
      const seen = new Set<number>();
      const merged: Ayah[] = [];
      for (const a of [...cachedResults, ...localResults]) {
        if (!seen.has(a.id)) {
          seen.add(a.id);
          merged.push(a);
        }
      }
      setResults(merged.slice(0, 50));
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  };

  const getSurahName = (surahId: number) => {
    const s = surahs.find(su => su.id === surahId);
    return s ? s.nameEnglish : "";
  };

  const suggestions = ["Mercy", "Patience", "Prayer", "Forgiveness", "Guidance", "Peace", "ধৈর্য", "রহমত"];

  return (
    <div className="px-4 pb-24">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-background pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search in Arabic, English, or Bangla..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
          />
          {query && (
            <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        {searched && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 Search works across surahs you've already read. Open more surahs to expand search coverage.
          </p>
        )}
      </div>

      {/* Suggestions */}
      {!searched && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Suggested searches</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-3">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No verses found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try different keywords or read more surahs to expand search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(ayah => (
                <button
                  key={`${ayah.surahId}-${ayah.ayahNumber}`}
                  onClick={() => onSelectSurah(ayah.surahId)}
                  className="verse-card w-full text-left animate-fade-in"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-accent px-2 py-0.5 rounded-full text-gold font-semibold">
                      {getSurahName(ayah.surahId)} {ayah.surahId}:{ayah.ayahNumber}
                    </span>
                  </div>
                  <p className="font-arabic text-right text-lg leading-relaxed mb-2 text-foreground">
                    {ayah.arabicText}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ayah.englishTranslation}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
