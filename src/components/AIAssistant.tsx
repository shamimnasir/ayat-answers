import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { searchQuranAPI, searchQuranAPIBangla } from "@/lib/quranApi";
import { surahs } from "@/data/surahs";
import { Ayah } from "@/types/quran";

interface Message {
  role: "user" | "assistant";
  content: string;
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

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "আসসালামু আলাইকুম! 🌙 আমি আপনার কুরআন AI সহকারী। কুরআন সম্পর্কে যেকোনো প্রশ্ন করুন — আমি সম্পূর্ণ কুরআন থেকে প্রাসঙ্গিক আয়াত খুঁজে দেব।\n\nউদাহরণ:\n• \"ধৈর্য সম্পর্কে আয়াত\"\n• \"What does Quran say about patience?\"\n• \"Al-Aqsa\"\n• \"Charity\"\n• \"মূসা (আ.)\""
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    const question = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(question);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "দুঃখিত, একটি সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted text-foreground rounded-bl-md"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-accent-foreground" />
              </div>
            )}
          </div>
        ))}
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

      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="কুরআন সম্পর্কে জিজ্ঞেস করুন / Ask about the Quran..."
            className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors"
          />
          <button
            onClick={handleSend}
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

  // Common stop words to remove
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

  // Return unique keywords
  return [...new Set(words)];
}

async function generateResponse(question: string): Promise<string> {
  const bn = isBangla(question);
  const keywords = extractKeywords(question);

  // Try multiple search queries to find relevant verses
  let allResults: Ayah[] = [];

  // Search with full question and individual keywords
  const searchTerms = [
    keywords.join(" "),
    ...keywords.slice(0, 3),
  ].filter(Boolean);

  for (const term of searchTerms) {
    if (!term) continue;
    try {
      const results = bn
        ? await searchQuranAPIBangla(term)
        : await searchQuranAPI(term);
      allResults.push(...results);
    } catch {
      // Continue with other terms
    }
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

  // Take top results
  const topResults = unique.slice(0, 5);

  if (topResults.length === 0) {
    return bn
      ? `📖 "${question}" সম্পর্কে কুরআনে সরাসরি কোনো আয়াত খুঁজে পাওয়া যায়নি।\n\nদয়া করে ভিন্ন কীওয়ার্ড ব্যবহার করে আবার চেষ্টা করুন। যেমন:\n• ইংরেজি শব্দ ব্যবহার করুন (patience, mercy, prayer)\n• নির্দিষ্ট বিষয় অনুসন্ধান করুন`
      : `📖 No verses found for "${question}" in the Quran.\n\nPlease try different keywords. For example:\n• Use specific English words (patience, mercy, prayer, forgiveness)\n• Search for names (Moses, Abraham, Mary)\n• Search for topics (charity, fasting, heaven)`;
  }

  // Build response
  let response = bn
    ? `📖 "${question}" সম্পর্কে কুরআনে প্রাসঙ্গিক আয়াতসমূহ:\n\n`
    : `📖 Relevant Quran verses about "${question}":\n\n`;

  for (const ayah of topResults) {
    const surahName = getSurahName(ayah.surahId, bn);
    const ref = `${surahName} (${ayah.surahId}:${ayah.ayahNumber})`;

    response += `**${ref}**\n`;

    if (ayah.arabicText) {
      response += `"${ayah.arabicText}"\n`;
    }

    if (bn && ayah.banglaTranslation) {
      response += `"${ayah.banglaTranslation}"\n`;
    } else if (!bn && ayah.englishTranslation) {
      response += `"${ayah.englishTranslation}"\n`;
    }

    // Show the other translation too
    if (bn && ayah.englishTranslation) {
      response += `(${ayah.englishTranslation})\n`;
    } else if (!bn && ayah.banglaTranslation) {
      response += `(${ayah.banglaTranslation})\n`;
    }

    response += "\n";
  }

  response += bn
    ? `💡 মোট ${topResults.length}টি প্রাসঙ্গিক আয়াত পাওয়া গেছে। আরও নির্দিষ্ট শব্দ ব্যবহার করলে আরও সঠিক ফলাফল পাবেন।`
    : `💡 Found ${topResults.length} relevant verse(s). Use more specific keywords for better results.`;

  return response;
}
