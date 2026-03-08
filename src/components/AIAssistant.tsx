import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Assalamu Alaikum! 🌙 I'm your Quran AI Assistant. Ask me any question about the Quran, and I'll find relevant verses and explanations for you.\n\nTry asking:\n• \"What does the Quran say about patience?\"\n• \"Verses about mercy\"\n• \"What does Quran say about charity?\""
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
    setInput("");
    setIsLoading(true);

    // Simulate AI response with relevant Quran context
    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Messages */}
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
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Ask about the Quran..."
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

function generateResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("patience") || q.includes("sabr") || q.includes("ধৈর্য")) {
    return `📖 The Quran speaks extensively about patience (Sabr):

**Surah Al-Baqarah (2:153)**
"يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ"
"O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient."

**Surah Ash-Sharh (94:5-6)**
"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا"
"For indeed, with hardship comes ease. Indeed, with hardship comes ease."

**Surah Al-Asr (103:3)**
"...وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ"
"...and advised each other to truth and advised each other to patience."

💡 Patience is one of the most praised qualities in the Quran. Allah promises to be with those who are patient and assures that ease follows every hardship.`;
  }

  if (q.includes("mercy") || q.includes("merciful") || q.includes("রহমত")) {
    return `📖 Allah's Mercy is a central theme in the Quran:

**Surah Al-Fatiha (1:1)**
"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
"In the name of Allah, the Entirely Merciful, the Especially Merciful."

**Surah Ar-Rahman (55:1-4)**
"الرَّحْمَٰنُ • عَلَّمَ الْقُرْآنَ • خَلَقَ الْإِنْسَانَ • عَلَّمَهُ الْبَيَانَ"
"The Most Merciful. Taught the Quran. Created man. Taught him eloquence."

**Surah Al-Baqarah (2:286)**
"لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا"
"Allah does not charge a soul except with that within its capacity."

💡 Every Surah of the Quran (except At-Tawbah) begins with Bismillah, invoking Allah's mercy. His mercy encompasses all things.`;
  }

  if (q.includes("prayer") || q.includes("salat") || q.includes("salah") || q.includes("সালাত") || q.includes("নামাজ")) {
    return `📖 Prayer (Salat) in the Quran:

**Surah Al-Baqarah (2:3)**
"الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ"
"Who believe in the unseen, establish prayer, and spend out of what We have provided for them."

**Surah Al-Baqarah (2:153)**
"اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ"
"Seek help through patience and prayer."

**Surah Al-Ma'un (107:4-5)**
"فَوَيْلٌ لِلْمُصَلِّينَ • الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ"
"So woe to those who pray, who are heedless of their prayer."

💡 Prayer is mentioned over 700 times in the Quran and is the second pillar of Islam.`;
  }

  if (q.includes("forgive") || q.includes("tawbah") || q.includes("repent") || q.includes("ক্ষমা")) {
    return `📖 Forgiveness and Repentance in the Quran:

**Surah An-Nasr (110:3)**
"فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا"
"Then exalt with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance."

**Surah Al-Baqarah (2:286)**
"لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا"
"Allah does not charge a soul except with that within its capacity."

💡 Allah's forgiveness is unlimited for those who sincerely repent. The door of Tawbah is always open.`;
  }

  if (q.includes("charity") || q.includes("zakat") || q.includes("sadaqah") || q.includes("দান")) {
    return `📖 Charity and Giving in the Quran:

**Surah Al-Baqarah (2:3)**
"وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ"
"...and spend out of what We have provided for them."

**Surah Al-Ma'un (107:7)**
"وَيَمْنَعُونَ الْمَاعُونَ"
"And withhold simple assistance." — condemning those who refuse to help.

**Surah Ad-Duha (93:10)**
"وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ"
"And as for the petitioner, do not repel him."

💡 Charity purifies wealth and is a fundamental act of worship in Islam.`;
  }

  return `📖 Thank you for your question about: "${question}"

Based on the Quran's teachings, here are some relevant verses:

**Surah Al-Baqarah (2:2)**
"ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ"
"This is the Book about which there is no doubt, a guidance for those conscious of Allah."

**Surah Ad-Duha (93:5)**
"وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ"
"And your Lord is going to give you, and you will be satisfied."

💡 To get more detailed answers with AI-powered semantic search, connect the app to Lovable Cloud for the full AI assistant experience.

You can also try searching for specific topics like patience, mercy, prayer, forgiveness, or charity.`;
}
