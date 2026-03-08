import { useState } from "react";
import { Book, Search, MessageCircle, Bookmark, Home } from "lucide-react";
import { ThemeToggle, useTheme } from "@/components/ThemeToggle";
import SurahList from "@/components/SurahList";
import QuranReader from "@/components/QuranReader";
import SearchScreen from "@/components/SearchScreen";
import AIAssistant from "@/components/AIAssistant";
import BookmarksScreen from "@/components/BookmarksScreen";
import DailyVerse from "@/components/DailyVerse";

type Screen = "home" | "surahs" | "reader" | "search" | "ai" | "bookmarks";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const { isDark, toggleTheme } = useTheme();

  const openSurah = (surahId: number) => {
    setSelectedSurah(surahId);
    setScreen("reader");
  };

  const navItems = [
    { id: "home" as Screen, icon: Home, label: "Home" },
    { id: "surahs" as Screen, icon: Book, label: "Surahs" },
    { id: "search" as Screen, icon: Search, label: "Search" },
    { id: "ai" as Screen, icon: MessageCircle, label: "AI" },
    { id: "bookmarks" as Screen, icon: Bookmark, label: "Saved" },
  ];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {/* Top bar */}
      {screen !== "reader" && (
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold gold-text-gradient">القرآن الكريم</h1>
              <p className="text-xs text-muted-foreground">The Holy Quran</p>
            </div>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>
        </header>
      )}

      {/* Content */}
      <main className="min-h-[calc(100vh-7rem)]">
        {screen === "home" && (
          <div className="px-4 py-6 space-y-6 pb-24">
            {/* Welcome */}
            <div className="text-center py-4">
              <p className="font-arabic text-3xl text-gold mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="text-sm text-muted-foreground">In the name of Allah, the Most Merciful</p>
            </div>

            {/* Daily Verse */}
            <DailyVerse onSelectSurah={openSurah} />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScreen("surahs")}
                className="verse-card flex flex-col items-center gap-2 py-6 hover:border-gold/50"
              >
                <Book className="w-6 h-6 text-gold" />
                <span className="text-sm font-semibold">Browse Surahs</span>
                <span className="text-xs text-muted-foreground">114 Surahs</span>
              </button>
              <button
                onClick={() => setScreen("search")}
                className="verse-card flex flex-col items-center gap-2 py-6 hover:border-gold/50"
              >
                <Search className="w-6 h-6 text-emerald-brand" />
                <span className="text-sm font-semibold">Search Quran</span>
                <span className="text-xs text-muted-foreground">Arabic · English · বাংলা</span>
              </button>
              <button
                onClick={() => setScreen("ai")}
                className="verse-card flex flex-col items-center gap-2 py-6 hover:border-gold/50"
              >
                <MessageCircle className="w-6 h-6 text-gold" />
                <span className="text-sm font-semibold">AI Assistant</span>
                <span className="text-xs text-muted-foreground">Ask questions</span>
              </button>
              <button
                onClick={() => setScreen("bookmarks")}
                className="verse-card flex flex-col items-center gap-2 py-6 hover:border-gold/50"
              >
                <Bookmark className="w-6 h-6 text-emerald-brand" />
                <span className="text-sm font-semibold">Bookmarks</span>
                <span className="text-xs text-muted-foreground">Saved verses</span>
              </button>
            </div>

            {/* Continue Reading */}
            <button
              onClick={() => openSurah(1)}
              className="w-full gold-gradient text-primary-foreground rounded-xl py-4 px-6 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start Reading — Al-Fatiha
            </button>
          </div>
        )}

        {screen === "surahs" && <SurahList onSelectSurah={openSurah} />}
        {screen === "reader" && <QuranReader surahId={selectedSurah} onBack={() => setScreen("surahs")} />}
        {screen === "search" && <SearchScreen onSelectSurah={openSurah} />}
        {screen === "ai" && <AIAssistant />}
        {screen === "bookmarks" && <BookmarksScreen onSelectSurah={openSurah} />}
      </main>

      {/* Bottom nav */}
      {screen !== "reader" && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background/95 backdrop-blur-sm border-t border-border px-2 py-2 z-20">
          <div className="flex items-center justify-around">
            {navItems.map(item => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                    active ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Index;
