import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { searchCachedAyahs, searchQuranAPI, searchQuranAPIBangla } from "@/lib/quranApi";
import { surahs } from "@/data/surahs";
import { Ayah } from "@/types/quran";

interface SearchScreenProps {
  onSelectSurah: (surahId: number) => void;
}

function isBangla(text: string): boolean {
  const banglaChars = text.match(/[\u0980-\u09FF]/g);
  return banglaChars !== null && banglaChars.length >= 2;
}

export default function SearchScreen({ onSelectSurah }: SearchScreenProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Ayah[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Search cached data first (instant)
      const cachedResults = searchCachedAyahs(q.trim());

      // Show cached results immediately
      setResults(cachedResults);

      // Then search the API for comprehensive results
      const bn = isBangla(q.trim());
      let apiResults: Ayah[] = [];

      if (bn) {
        apiResults = await searchQuranAPIBangla(q.trim());
      } else {
        apiResults = await searchQuranAPI(q.trim());
      }

      // Merge and deduplicate
      const seen = new Set<string>();
      const merged: Ayah[] = [];
      for (const a of [...cachedResults, ...apiResults]) {
        const key = `${a.surahId}-${a.ayahNumber}`;
        if (!seen.has(key)) {
          seen.add(key);
          merged.push(a);
        }
      }

      setResults(merged.slice(0, 50));
    } catch (e) {
      console.error("Search error:", e);
      // Keep cached results if API fails
    } finally {
      setLoading(false);
    }
  };

  const getSurahName = (surahId: number) => {
    const s = surahs.find(su => su.id === surahId);
    return s ? s.nameEnglish : `Surah ${surahId}`;
  };

  const getSurahNameBangla = (surahId: number) => {
    const s = surahs.find(su => su.id === surahId);
    return s ? s.nameBangla : "";
  };

  const suggestions = ["Mercy", "Patience", "Prayer", "Forgiveness", "Guidance", "Peace", "ধৈর্য", "রহমত", "Al-Aqsa", "Moses", "Jesus", "Mary"];

  return (
    <div className="px-4 pb-24">
      {/* Search bar */}
      <div className="sticky top-0 z-10 bg-background pt-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            placeholder="Search in Arabic, English, or Bangla..."
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
          />
          {query ? (
            <button onClick={() => { setQuery(""); setResults([]); setSearched(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : null}
        </div>
        {query.trim().length >= 2 && (
          <button
            onClick={() => handleSearch(query)}
            className="w-full mt-2 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Search the entire Quran"}
          </button>
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
                onClick={() => { setQuery(s); handleSearch(s); }}
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
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""} found
              {loading && " (searching...)"}
            </p>
            {loading && <Loader2 className="w-3 h-3 animate-spin text-gold" />}
          </div>
          {results.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No verses found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try different keywords or check your internet connection</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((ayah, idx) => (
                <button
                  key={`${ayah.surahId}-${ayah.ayahNumber}-${idx}`}
                  onClick={() => onSelectSurah(ayah.surahId)}
                  className="verse-card w-full text-left animate-fade-in"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs bg-accent px-2 py-0.5 rounded-full text-gold font-semibold">
                      {getSurahName(ayah.surahId)} {ayah.surahId}:{ayah.ayahNumber}
                    </span>
                    <span className="text-xs text-muted-foreground font-bangla">
                      {getSurahNameBangla(ayah.surahId)}
                    </span>
                  </div>
                  {ayah.arabicText && (
                    <p className="font-arabic text-right text-lg leading-relaxed mb-2 text-foreground">
                      {ayah.arabicText}
                    </p>
                  )}
                  {ayah.englishTranslation && (
                    <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                      {ayah.englishTranslation}
                    </p>
                  )}
                  {ayah.banglaTranslation && (
                    <p className="text-xs text-muted-foreground leading-relaxed font-bangla">
                      {ayah.banglaTranslation}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
