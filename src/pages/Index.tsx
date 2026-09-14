import { useState } from "react";
import { Book, MessageCircle, Bookmark, Home } from "lucide-react";
import { ThemeToggle, useTheme } from "@/components/ThemeToggle";
import SurahList from "@/components/SurahList";
import QuranReader from "@/components/QuranReader";
import AIAssistant from "@/components/AIAssistant";
import BookmarksScreen from "@/components/BookmarksScreen";
import DailyVerse from "@/components/DailyVerse";

type Screen = "home" | "surahs" | "reader" | "ai" | "bookmarks";

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
    { id: "ai" as Screen, icon: MessageCircle, label: "AI Search" },
    { id: "bookmarks" as Screen, icon: Bookmark, label: "Saved" },
  ];

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {/* Top bar */}
      {screen !== "reader" && (
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pl-[calc(1rem+env(safe-area-inset-left))] pr-[calc(1rem+env(safe-area-inset-right))]">
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
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 p-5 text-left transition-all hover:shadow-lg hover:shadow-gold/10 hover:border-gold/40 hover:-translate-y-0.5"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-full -translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center mb-3 group-hover:bg-gold/25 transition-colors">
                    <Book className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">Browse Surahs</h3>
                  <p className="text-xs text-muted-foreground">114 Surahs</p>
                </div>
              </button>
              <button
                onClick={() => setScreen("bookmarks")}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 p-5 text-left transition-all hover:shadow-lg hover:shadow-secondary/10 hover:border-secondary/40 hover:-translate-y-0.5"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-full -translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center mb-3 group-hover:bg-secondary/25 transition-colors">
                    <Bookmark className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">Bookmarks</h3>
                  <p className="text-xs text-muted-foreground">Saved verses</p>
                </div>
              </button>
            </div>

            {/* AI Search - Featured */}
            <button
              onClick={() => setScreen("ai")}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-gold/15 via-gold/8 to-secondary/10 border border-gold/20 p-5 text-left transition-all hover:shadow-xl hover:shadow-gold/15 hover:border-gold/40 hover:-translate-y-0.5"
            >
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute right-4 top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageCircle className="w-16 h-16 text-gold" />
              </div>
              <div className="relative flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/25 to-gold/10 flex items-center justify-center flex-shrink-0 group-hover:from-gold/35 group-hover:to-gold/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-0.5">AI Search & Assistant</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">Search the entire Quran & ask questions · Arabic · English · বাংলা</p>
                </div>
              </div>
            </button>

            {/* Continue Reading */}
            <button
              onClick={() => openSurah(1)}
              className="w-full gold-gradient text-primary-foreground rounded-2xl py-4 px-6 text-sm font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              Start Reading — Al-Fatiha
            </button>
          </div>
        )}

        {screen === "surahs" && <SurahList onSelectSurah={openSurah} />}
        {screen === "reader" && <QuranReader surahId={selectedSurah} onBack={() => setScreen("surahs")} />}
        {screen === "ai" && <AIAssistant onSelectSurah={openSurah} />}
        {screen === "bookmarks" && <BookmarksScreen onSelectSurah={openSurah} />}
      </main>

      {/* Bottom nav */}
      {screen !== "reader" && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background/95 backdrop-blur-sm border-t border-border px-2 py-2 z-20 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pl-[calc(0.5rem+env(safe-area-inset-left))] pr-[calc(0.5rem+env(safe-area-inset-right))]">
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
