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
      content: "আসসালামু আলাইকুম! 🌙 আমি আপনার কুরআন AI সহকারী। কুরআন সম্পর্কে যেকোনো প্রশ্ন করুন, আমি প্রাসঙ্গিক আয়াত ও ব্যাখ্যা খুঁজে দেব।\n\nজিজ্ঞেস করুন:\n• \"ধৈর্য সম্পর্কে কুরআন কী বলে?\"\n• \"রহমত সম্পর্কে আয়াত\"\n• \"নামাজ সম্পর্কে\"\n\nYou can also ask in English!"
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

    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1200);
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

function isBangla(text: string): boolean {
  const banglaChars = text.match(/[\u0980-\u09FF]/g);
  return banglaChars !== null && banglaChars.length >= 2;
}

function generateResponse(question: string): string {
  const q = question.toLowerCase();
  const bn = isBangla(question);

  if (q.includes("patience") || q.includes("sabr") || q.includes("ধৈর্য") || q.includes("সবর")) {
    if (bn) {
      return `📖 কুরআনে ধৈর্য (সবর) সম্পর্কে অনেক আয়াত রয়েছে:

**সূরা আল-বাকারা (২:১৫৩)**
"يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ"
"হে মুমিনগণ! ধৈর্য ও সালাতের মাধ্যমে সাহায্য চাও। নিশ্চয় আল্লাহ ধৈর্যশীলদের সাথে আছেন।"

**সূরা আশ-শারহ (৯৪:৫-৬)**
"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا"
"নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে। অবশ্যই কষ্টের সাথে স্বস্তি আছে।"

**সূরা আল-আসর (১০৩:৩)**
"...وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ"
"...এবং পরস্পরকে সত্যের উপদেশ দিয়েছে ও ধৈর্যের উপদেশ দিয়েছে।"

💡 ধৈর্য কুরআনে সবচেয়ে প্রশংসিত গুণাবলীর একটি। আল্লাহ প্রতিশ্রুতি দিয়েছেন যে তিনি ধৈর্যশীলদের সাথে আছেন।`;
    }
    return `📖 The Quran speaks extensively about patience (Sabr):

**Surah Al-Baqarah (2:153)**
"يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ"
"O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient."

**Surah Ash-Sharh (94:5-6)**
"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا"
"For indeed, with hardship comes ease. Indeed, with hardship comes ease."

💡 Patience is one of the most praised qualities in the Quran.`;
  }

  if (q.includes("mercy") || q.includes("merciful") || q.includes("রহমত") || q.includes("দয়া") || q.includes("করুণা")) {
    if (bn) {
      return `📖 আল্লাহর রহমত কুরআনের একটি কেন্দ্রীয় বিষয়:

**সূরা আল-ফাতিহা (১:১)**
"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
"পরম করুণাময় অতি দয়ালু আল্লাহর নামে।"

**সূরা আর-রাহমান (৫৫:১-৪)**
"الرَّحْمَٰنُ • عَلَّمَ الْقُرْآنَ • خَلَقَ الْإِنْسَانَ • عَلَّمَهُ الْبَيَانَ"
"পরম দয়াময়। তিনি শিক্ষা দিয়েছেন কুরআন। তিনি সৃষ্টি করেছেন মানুষ। তাকে শিখিয়েছেন ভাষা।"

**সূরা আল-বাকারা (২:২৮৬)**
"لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا"
"আল্লাহ কোনো ব্যক্তির উপর তার সাধ্যের অতিরিক্ত বোঝা চাপান না।"

💡 কুরআনের প্রতিটি সূরা (আত-তওবা ছাড়া) বিসমিল্লাহ দিয়ে শুরু হয়, আল্লাহর রহমত স্মরণ করে।`;
    }
    return `📖 Allah's Mercy is a central theme in the Quran:

**Surah Al-Fatiha (1:1)**
"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
"In the name of Allah, the Entirely Merciful, the Especially Merciful."

**Surah Ar-Rahman (55:1-4)**
"الرَّحْمَٰنُ • عَلَّمَ الْقُرْآنَ • خَلَقَ الْإِنْسَانَ • عَلَّمَهُ الْبَيَانَ"
"The Most Merciful. Taught the Quran. Created man. Taught him eloquence."

💡 Every Surah of the Quran (except At-Tawbah) begins with Bismillah, invoking Allah's mercy.`;
  }

  if (q.includes("prayer") || q.includes("salat") || q.includes("salah") || q.includes("সালাত") || q.includes("নামাজ") || q.includes("নামায")) {
    if (bn) {
      return `📖 কুরআনে সালাত (নামাজ) সম্পর্কে:

**সূরা আল-বাকারা (২:৩)**
"الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ"
"যারা অদৃশ্যে ঈমান আনে, সালাত কায়েম করে এবং আমি তাদেরকে যে রিযিক দিয়েছি তা থেকে ব্যয় করে।"

**সূরা আল-বাকারা (২:১৫৩)**
"اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ"
"ধৈর্য ও সালাতের মাধ্যমে সাহায্য চাও।"

**সূরা আল-মাঊন (১০৭:৪-৫)**
"فَوَيْلٌ لِلْمُصَلِّينَ • الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ"
"সেই সালাত আদায়কারীদের জন্য দুর্ভোগ, যারা তাদের সালাতের ব্যাপারে উদাসীন।"

💡 কুরআনে সালাতের কথা ৭০০ বারেরও বেশি উল্লেখ করা হয়েছে এবং এটি ইসলামের দ্বিতীয় স্তম্ভ।`;
    }
    return `📖 Prayer (Salat) in the Quran:

**Surah Al-Baqarah (2:3)**
"الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ"
"Who believe in the unseen, establish prayer, and spend out of what We have provided for them."

**Surah Al-Baqarah (2:153)**
"اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ"
"Seek help through patience and prayer."

💡 Prayer is mentioned over 700 times in the Quran and is the second pillar of Islam.`;
  }

  if (q.includes("forgive") || q.includes("tawbah") || q.includes("repent") || q.includes("ক্ষমা") || q.includes("তওবা") || q.includes("মাফ")) {
    if (bn) {
      return `📖 কুরআনে ক্ষমা ও তওবা সম্পর্কে:

**সূরা আন-নাসর (১১০:৩)**
"فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا"
"তোমার রবের প্রশংসাসহ তাসবীহ পাঠ করো এবং তাঁর কাছে ক্ষমা চাও। নিশ্চয়ই তিনি তওবা কবুলকারী।"

**সূরা আল-বাকারা (২:২৮৬)**
"لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا"
"আল্লাহ কোনো ব্যক্তির উপর তার সাধ্যের অতিরিক্ত বোঝা চাপান না।"

💡 যারা আন্তরিকভাবে তওবা করে, তাদের জন্য আল্লাহর ক্ষমা অসীম। তওবার দরজা সর্বদা খোলা।`;
    }
    return `📖 Forgiveness and Repentance in the Quran:

**Surah An-Nasr (110:3)**
"فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا"
"Then exalt with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance."

💡 Allah's forgiveness is unlimited for those who sincerely repent.`;
  }

  if (q.includes("charity") || q.includes("zakat") || q.includes("sadaqah") || q.includes("দান") || q.includes("যাকাত") || q.includes("সাদাকা")) {
    if (bn) {
      return `📖 কুরআনে দান ও সদকা সম্পর্কে:

**সূরা আল-বাকারা (২:৩)**
"وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ"
"...এবং আমি তাদেরকে যে রিযিক দিয়েছি তা থেকে ব্যয় করে।"

**সূরা আদ-দুহা (৯৩:১০)**
"وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ"
"আর প্রার্থীকে ধমক দিও না।"

💡 দান সম্পদকে পবিত্র করে এবং ইসলামে ইবাদতের একটি মৌলিক অংশ।`;
    }
    return `📖 Charity and Giving in the Quran:

**Surah Al-Baqarah (2:3)**
"وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ"
"...and spend out of what We have provided for them."

**Surah Ad-Duha (93:10)**
"وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ"
"And as for the petitioner, do not repel him."

💡 Charity purifies wealth and is a fundamental act of worship in Islam.`;
  }

  // Default response
  if (bn) {
    return `📖 আপনার প্রশ্নের জন্য ধন্যবাদ: "${question}"

কুরআনের শিক্ষার ভিত্তিতে কিছু প্রাসঙ্গিক আয়াত:

**সূরা আল-বাকারা (২:২)**
"ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ"
"এটি সেই কিতাব, এতে কোন সন্দেহ নেই, মুত্তাকীদের জন্য পথনির্দেশ।"

**সূরা আদ-দুহা (৯৩:৫)**
"وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ"
"আর অচিরেই তোমার রব তোমাকে দেবেন, ফলে তুমি সন্তুষ্ট হবে।"

💡 আরও বিস্তারিত উত্তরের জন্য Lovable Cloud সংযুক্ত করে সম্পূর্ণ AI সহকারী সক্রিয় করুন।

আপনি ধৈর্য, রহমত, নামাজ, ক্ষমা, বা দান সম্পর্কে জিজ্ঞেস করতে পারেন।`;
  }

  return `📖 Thank you for your question about: "${question}"

Based on the Quran's teachings, here are some relevant verses:

**Surah Al-Baqarah (2:2)**
"ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ"
"This is the Book about which there is no doubt, a guidance for those conscious of Allah."

**Surah Ad-Duha (93:5)**
"وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ"
"And your Lord is going to give you, and you will be satisfied."

💡 To get more detailed answers, connect Lovable Cloud for the full AI assistant.

Try searching for: patience, mercy, prayer, forgiveness, or charity.`;
}
