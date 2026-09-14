import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Search, Sparkles, BookOpen } from "lucide-react";
import { searchQuranAPI, searchQuranAPIBangla, searchCachedAyahs } from "@/lib/quranApi";
import { surahs } from "@/data/surahs";
import { Ayah } from "@/types/quran";

interface AIAssistantProps {
  onSelectSurah?: (surahId: number) => void;
}

/**
 * Renders **bold** spans in assistant copy. The intro message is written in
 * markdown but the bubble uses whitespace-pre-wrap, so without this the
 * asterisks show up literally on screen.
 */
function renderBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4
      ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
  verses?: Ayah[];
}

function isBangla(text: string): boolean {
  const banglaChars = text.match(/[\u0980-\u09FF]/g);
  return banglaChars !== null && banglaChars.length >= 2;
}

function getSurahName(surahId: number, bangla: boolean): string {
  const s = surahs.find(su => su.id === surahId);
  if (!s) return `Surah ${surahId}`;
  return bangla ? `সূরা ${s.nameBangla}` : `Surah ${s.nameEnglish}`;
}

const quickSuggestions = [
  "Patience", "Mercy", "Prayer", "Forgiveness", "Guidance",
  "Peace", "ধৈর্য", "রহমত", "Moses", "Jesus", "Mary",
  "Al-Aqsa", "Charity", "Heaven", "Fasting",
];

export default function AIAssistant({ onSelectSurah }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "আসসালামু আলাইকুম! 🌙\n\nআমি আপনার কুরআন AI সহকারী। সম্পূর্ণ কুরআনের ৬,২৩৬টি আয়াত থেকে অনুসন্ধান করতে পারি।\n\n🔍 **যেকোনো বিষয়ে সার্চ করুন** — আরবি, ইংরেজি বা বাংলায়\n💬 **প্রশ্ন করুন** — \"ধৈর্য সম্পর্কে কুরআন কী বলে?\"\n📖 **আয়াত খুঁজুন** — নাম, বিষয় বা কীওয়ার্ড দিয়ে\n\nনিচে সাজেশন থেকে শুরু করতে পারেন! 👇"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const question = (text || input).trim();
    if (!question || isLoading) return;

    const userMsg: Message = { role: "user", content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const { response, verses } = await generateResponse(question);
      setMessages(prev => [...prev, { role: "assistant", content: response, verses }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "দুঃখিত, একটি সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin pb-[calc(6rem+env(safe-area-inset-bottom))]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div className="max-w-[85%] space-y-2">
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}>
                {renderBold(msg.content)}
              </div>
              {/* Clickable verse cards */}
              {msg.verses && msg.verses.length > 0 && onSelectSurah && (
                <div className="space-y-2">
                  {msg.verses.map((v, vi) => (
                    <button
                      key={`${v.surahId}-${v.ayahNumber}-${vi}`}
                      onClick={() => onSelectSurah(v.surahId)}
                      className="w-full text-left verse-card p-3 hover:border-gold/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs font-semibold text-gold">
                          {getSurahName(v.surahId, false)} {v.surahId}:{v.ayahNumber}
                        </span>
                      </div>
                      {v.arabicText && (
                        <p className="font-arabic text-right text-base leading-loose mb-1.5 text-foreground">{v.arabicText}</p>
                      )}
                      {v.englishTranslation && (
                        <p className="text-xs text-muted-foreground leading-relaxed mb-1">{v.englishTranslation}</p>
                      )}
                      {v.banglaTranslation && (
                        <p className="text-xs text-muted-foreground leading-relaxed font-bangla">{v.banglaTranslation}</p>
                      )}
                      <p className="text-[10px] text-gold mt-1.5">📖 Tap to read full surah →</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Quick suggestions */}
        {showSuggestions && (
          <div className="animate-fade-in">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick search suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
              <span className="text-xs text-muted-foreground">সম্পূর্ণ কুরআনে অনুসন্ধান করছি...</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-border bg-background pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Search or ask about the Quran..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Extract search keywords from a natural language question
function extractKeywords(question: string): string[] {
  const bn = isBangla(question);

  const stopWordsEn = new Set([
    "what", "does", "the", "quran", "say", "about", "how", "to", "in", "is",
    "are", "was", "were", "a", "an", "of", "and", "or", "for", "with", "from",
    "can", "do", "will", "should", "which", "where", "when", "why", "who",
    "that", "this", "it", "its", "have", "has", "had", "be", "been", "being",
    "there", "their", "they", "them", "those", "these", "some", "any", "all",
    "on", "at", "by", "into", "not", "no", "so", "if", "but", "up", "out",
    "tell", "me", "us", "my", "our", "your", "i", "we", "you", "he", "she",
    "verses", "verse", "ayah", "ayat", "surah", "regarding", "according",
  ]);

  const stopWordsBn = new Set([
    "কি", "কী", "কে", "কোন", "কোনো", "কুরআন", "কুরআনে", "সম্পর্কে", "বলে",
    "কিভাবে", "কেন", "আর", "এবং", "বা", "তার", "এই", "সেই", "একটি",
    "এটি", "যে", "থেকে", "জন্য", "মধ্যে", "সাথে", "আমি", "আমরা", "তুমি",
    "আপনি", "সে", "তারা", "হয়", "আছে", "ছিল", "হবে", "করে", "নিয়ে",
    "দিয়ে", "বলেছে", "বলেছেন", "বলা", "আয়াত", "সূরা", "প্রশ্ন",
  ]);

  const stopWords = bn ? stopWordsBn : stopWordsEn;

  const words = question
    .replace(/[?.,!"""''()]/g, "")
    .split(/\s+/)
    .filter(w => w.length >= 2 && !stopWords.has(w.toLowerCase()))
    .map(w => w.trim())
    .filter(Boolean);

  return [...new Set(words)];
}

async function generateResponse(question: string): Promise<{ response: string; verses: Ayah[] }> {
  const bn = isBangla(question);
  const keywords = extractKeywords(question);

  const allResults: Ayah[] = [];

  // Search with full question, combined keywords, and individual keywords
  const searchTerms = [
    question.trim(),
    keywords.join(" "),
    ...keywords.slice(0, 5),
  ].filter(Boolean);

  // Also search cached data
  const cachedResults = searchCachedAyahs(question.trim());
  allResults.push(...cachedResults);

  // Search API with multiple terms in parallel
  const searchPromises = searchTerms.map(async (term) => {
    if (!term) return [];
    try {
      return bn
        ? await searchQuranAPIBangla(term)
        : await searchQuranAPI(term);
    } catch {
      return [];
    }
  });

  const apiResults = await Promise.all(searchPromises);
  for (const results of apiResults) {
    allResults.push(...results);
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique: Ayah[] = [];
  for (const a of allResults) {
    const key = `${a.surahId}-${a.ayahNumber}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(a);
    }
  }

  const topResults = unique.slice(0, 8);

  if (topResults.length === 0) {
    return {
      response: bn
        ? `📖 "${question}" সম্পর্কে কুরআনে সরাসরি কোনো আয়াত খুঁজে পাওয়া যায়নি।\n\nদয়া করে ভিন্ন কীওয়ার্ড ব্যবহার করে আবার চেষ্টা করুন। যেমন:\n• ইংরেজি শব্দ ব্যবহার করুন (patience, mercy, prayer)\n• নির্দিষ্ট বিষয় অনুসন্ধান করুন`
        : `📖 No verses found for "${question}".\n\nTry different keywords:\n• Use specific words (patience, mercy, prayer, forgiveness)\n• Search for names (Moses, Abraham, Mary)\n• Search for topics (charity, fasting, heaven)`,
      verses: [],
    };
  }

  const response = bn
    ? `📖 "${question}" সম্পর্কে ${topResults.length}টি প্রাসঙ্গিক আয়াত পাওয়া গেছে। আয়াতে ট্যাপ করে পুরো সূরা পড়তে পারবেন। 👇`
    : `📖 Found ${topResults.length} relevant verse(s) for "${question}". Tap any verse to read the full surah. 👇`;

  return { response, verses: topResults };
}