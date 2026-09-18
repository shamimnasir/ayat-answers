/** Bengali-script pronunciation generated from the app's canonical transliteration. */

// High-frequency forms preserve conventions used by Bengali Quran readers.
const WORDS: Record<string, string> = {
  bismillaahir: "বিসমিল্লাহির", rahmaanir: "রাহমানির", raheem: "রাহিম",
  alhamdu: "আলহামদু", lillaahi: "লিল্লাহি", rabbil: "রব্বিল", aalameen: "আলামীন",
  arrahmaanir: "আর-রাহমানির", arrahmaan: "আর-রাহমান", arraheem: "আর-রাহিম",
  maaliki: "মালিকি", yawmiddeen: "ইয়াওমিদ্দীন", iyyaaka: "ইয়্যাকা",
  nabudu: "নাবুদু", wa: "ওয়া", nastaeen: "নাসতাঈন", ihdinas: "ইহদিনাস",
  siraatal: "সিরাতাল", mustaqeem: "মুস্তাকীম", lazeena: "আল্লাযীনা",
  anamta: "আনআমতা", alaihim: "আলাইহিম", ghayrilmaghdoobi: "গাইরিল-মাগদূবি",
  qul: "কুল", auzu: "আউযু", birabbin: "বিরাব্বিন", naas: "নাস",
  malikin: "মালিকিন", ilaahin: "ইলাহিন",
};

const AYAH_OVERRIDES: Record<string, string> = {
  "bismillaahir rahmaanir raheem": "বিসমিল্লাহির রাহমানির রাহিম",
  "alhamdu lillaahi rabbil 'aalameen": "আলহামদু লিল্লাহি রব্বিল আলামীন",
  "ar-rahmaanir-raheem": "আর-রাহমানির-রাহিম",
  "maaliki yawmid-deen": "মালিকি ইয়াওমিদ্দীন",
  "iyyaaka na'budu wa lyyaaka nasta'een": "ইয়্যাকা নাবুদু ওয়া ইয়্যাকা নাসতাঈন",
  "ihdinas-siraatal-mustaqeem": "ইহদিনাস-সিরাতাল-মুস্তাকীম",
  "siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaalleen":
    "সিরাতাল্লাযীনা আনআমতা আলাইহিম গাইরিল-মাগদূবি আলাইহিম ওয়ালাদ্দল্লীন",
  "yaa-seeen": "ইয়া-সীন",
  "wal-qur-aanil-hakeem": "ওয়াল-কুরআনিল-হাকীম",
  "qul a'uzu birabbin naas": "কুল আউযু বিরাব্বিন্নাস",
  "min sharril was waasil khannaas": "মিন শাররিল ওয়াসওয়াসিল খান্নাস",
  "al lazee yuwas wisu fee sudoorin naas": "আল্লাযী ইউওয়াসউইসু ফী সুদূরিন্নাস",
  "minal jinnati wan naas": "মিনাল জিন্নাতি ওয়ান্নাস",
};

function key(value: string): string {
  return value.toLowerCase().replace(/[’']/gu, "'").replace(/\s+/gu, " ").trim();
}

function fallbackWord(value: string): string {
  const punctuation = value.match(/[^a-z'-]+$/iu)?.[0] ?? "";
  const word = value.slice(0, value.length - punctuation.length).toLowerCase();
  if (WORDS[word]) return WORDS[word] + punctuation;

  // Conservative syllable fallback for less common words.
  const source = word.replace(/a{3,}/gu, "aa");
  const result = source
    .replace(/^aa/gu, "আ").replace(/aa/gu, "া").replace(/ai/gu, "াই").replace(/au/gu, "াউ")
    .replace(/^ee|^ii/gu, "ই").replace(/ee|ii/gu, "ী").replace(/oo|uu/gu, "ূ")
    .replace(/kh/gu, "খ").replace(/gh/gu, "গ").replace(/sh/gu, "শ")
    .replace(/th/gu, "ত").replace(/dh/gu, "দ").replace(/ch/gu, "ছ")
    .replace(/zh/gu, "য").replace(/q/gu, "ক").replace(/x/gu, "ক্স")
    .replace(/a/gu, "া").replace(/e/gu, "ে").replace(/i/gu, "ি")
    .replace(/o/gu, "ো").replace(/u/gu, "ু").replace(/b/gu, "ব")
    .replace(/p/gu, "প").replace(/m/gu, "ম").replace(/f/gu, "ফ")
    .replace(/v/gu, "ভ").replace(/w/gu, "ওয়").replace(/r/gu, "র")
    .replace(/l/gu, "ল").replace(/n/gu, "ন").replace(/t/gu, "ত")
    .replace(/d/gu, "দ").replace(/s/gu, "স").replace(/z/gu, "য")
    .replace(/j/gu, "জ").replace(/g/gu, "গ").replace(/h/gu, "হ")
    .replace(/c/gu, "ক").replace(/k/gu, "ক").replace(/y/gu, "য়").replace(/'/gu, "");
  // Bengali vowel signs cannot begin a word; use their independent forms.
  return result.replace(/([\u0995-\u09B9\u09DF])আ/gu, "$1া").replace(/([\u0995-\u09B9\u09DF])ই/gu, "$1ি")
    .replace(/([\u0995-\u09B9\u09DF])উ/gu, "$1ু").replace(/([\u0995-\u09B9\u09DF])এ/gu, "$1ে")
    .replace(/([\u0995-\u09B9\u09DF])ও/gu, "$1ো").replace(/আি/gu, "াই")
    .replace(/আলল/gu, "আল্ল").replace(/লল/gu, "ল্ল")
    .replace(/^য়/u, "ইয়")
    .replace(/^া/u, "আ").replace(/^ি/u, "ই").replace(/^ু/u, "উ")
    .replace(/^ে/u, "এ").replace(/^ো/u, "ও") + punctuation;
}

/** Convert canonical Latin transliteration to Bengali script. */
export function transliterationToBengali(transliteration: string): string {
  const normalized = key(transliteration);
  if (AYAH_OVERRIDES[normalized]) return AYAH_OVERRIDES[normalized];
  return normalized.split(/(\s+)/u).map((part) => /^\s+$/u.test(part) ? part : fallbackWord(part)).join("");
}

/** Prefer canonical transliteration; retain an Arabic fallback for API-only data. */
export function getBengaliPhonetics(arabicText: string, transliteration?: string): string {
  if (transliteration?.trim()) return transliterationToBengali(transliteration);
  return arabicText.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/gu, "").trim();
}

export const arabicToBengaliPhonetics = getBengaliPhonetics;
