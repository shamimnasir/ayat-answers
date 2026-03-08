import { Ayah } from "@/types/quran";

// Complete ayahs for select Surahs with Arabic, English, and Bangla translations
// This is a representative dataset; the full Quran would be loaded from a database

export const ayahs: Ayah[] = [
  // Surah 1: Al-Fatiha
  { id: 1, surahId: 1, ayahNumber: 1, arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", englishTranslation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", banglaTranslation: "পরম করুণাময় অতি দয়ালু আল্লাহর নামে।", juzNumber: 1 },
  { id: 2, surahId: 1, ayahNumber: 2, arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", englishTranslation: "All praise is due to Allah, Lord of the worlds.", banglaTranslation: "সমস্ত প্রশংসা আল্লাহর জন্য, যিনি সমগ্র বিশ্বের প্রতিপালক।", juzNumber: 1 },
  { id: 3, surahId: 1, ayahNumber: 3, arabicText: "الرَّحْمَٰنِ الرَّحِيمِ", englishTranslation: "The Entirely Merciful, the Especially Merciful.", banglaTranslation: "পরম করুণাময়, অতি দয়ালু।", juzNumber: 1 },
  { id: 4, surahId: 1, ayahNumber: 4, arabicText: "مَالِكِ يَوْمِ الدِّينِ", englishTranslation: "Sovereign of the Day of Recompense.", banglaTranslation: "বিচার দিনের মালিক।", juzNumber: 1 },
  { id: 5, surahId: 1, ayahNumber: 5, arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", englishTranslation: "It is You we worship and You we ask for help.", banglaTranslation: "আমরা শুধু তোমারই ইবাদত করি এবং শুধু তোমারই সাহায্য চাই।", juzNumber: 1 },
  { id: 6, surahId: 1, ayahNumber: 6, arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", englishTranslation: "Guide us to the straight path.", banglaTranslation: "আমাদেরকে সরল পথ দেখাও।", juzNumber: 1 },
  { id: 7, surahId: 1, ayahNumber: 7, arabicText: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", englishTranslation: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.", banglaTranslation: "তাদের পথ, যাদের তুমি নিয়ামত দিয়েছ, তাদের পথ নয় যাদের প্রতি তোমার গযব নাযিল হয়েছে এবং যারা পথভ্রষ্ট।", juzNumber: 1 },

  // Surah 2: Al-Baqarah (first 10 ayahs)
  { id: 8, surahId: 2, ayahNumber: 1, arabicText: "الم", englishTranslation: "Alif, Lam, Meem.", banglaTranslation: "আলিফ-লাম-মীম।", juzNumber: 1 },
  { id: 9, surahId: 2, ayahNumber: 2, arabicText: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ", englishTranslation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah.", banglaTranslation: "এটি সেই কিতাব, এতে কোন সন্দেহ নেই, মুত্তাকীদের জন্য পথনির্দেশ।", juzNumber: 1 },
  { id: 10, surahId: 2, ayahNumber: 3, arabicText: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ", englishTranslation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them.", banglaTranslation: "যারা অদৃশ্যে ঈমান আনে, সালাত কায়েম করে এবং আমি তাদেরকে যে রিযিক দিয়েছি তা থেকে ব্যয় করে।", juzNumber: 1 },
  { id: 11, surahId: 2, ayahNumber: 4, arabicText: "وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ", englishTranslation: "And who believe in what has been revealed to you and what was revealed before you, and of the Hereafter they are certain.", banglaTranslation: "এবং যারা ঈমান আনে তোমার প্রতি যা নাযিল করা হয়েছে এবং তোমার পূর্বে যা নাযিল করা হয়েছে তার প্রতি এবং আখিরাতে তারা দৃঢ় বিশ্বাস রাখে।", juzNumber: 1 },
  { id: 12, surahId: 2, ayahNumber: 5, arabicText: "أُولَٰئِكَ عَلَىٰ هُدًى مِنْ رَبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ", englishTranslation: "Those are upon [right] guidance from their Lord, and it is those who are the successful.", banglaTranslation: "তারাই তাদের রবের পক্ষ থেকে হিদায়াতের উপর রয়েছে এবং তারাই সফলকাম।", juzNumber: 1 },
  { id: 13, surahId: 2, ayahNumber: 153, arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", englishTranslation: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.", banglaTranslation: "হে মুমিনগণ! ধৈর্য ও সালাতের মাধ্যমে সাহায্য চাও। নিশ্চয় আল্লাহ ধৈর্যশীলদের সাথে আছেন।", juzNumber: 2 },
  { id: 14, surahId: 2, ayahNumber: 255, arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ", englishTranslation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.", banglaTranslation: "আল্লাহ, তিনি ছাড়া কোনো ইলাহ নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। তাকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আসমানসমূহে ও যমীনে যা কিছু আছে সবই তাঁর।", juzNumber: 3 },
  { id: 15, surahId: 2, ayahNumber: 256, arabicText: "لَا إِكْرَاهَ فِي الدِّينِ ۖ قَدْ تَبَيَّنَ الرُّشْدُ مِنَ الْغَيِّ", englishTranslation: "There shall be no compulsion in [acceptance of] the religion. The right course has become clear from the wrong.", banglaTranslation: "দ্বীনের ব্যাপারে কোনো জবরদস্তি নেই। সত্য পথ ভ্রান্ত পথ থেকে সুস্পষ্ট হয়ে গেছে।", juzNumber: 3 },
  { id: 16, surahId: 2, ayahNumber: 286, arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ", englishTranslation: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.", banglaTranslation: "আল্লাহ কোনো ব্যক্তির উপর তার সাধ্যের অতিরিক্ত বোঝা চাপান না। সে যা অর্জন করে তা তার জন্য এবং সে যা কামাই করে তা তার উপর বর্তায়।", juzNumber: 3 },

  // Surah 36: Ya-Sin (selected ayahs)
  { id: 100, surahId: 36, ayahNumber: 1, arabicText: "يس", englishTranslation: "Ya, Sin.", banglaTranslation: "ইয়া-সীন।", juzNumber: 22 },
  { id: 101, surahId: 36, ayahNumber: 2, arabicText: "وَالْقُرْآنِ الْحَكِيمِ", englishTranslation: "By the wise Quran.", banglaTranslation: "বিজ্ঞানময় কুরআনের শপথ।", juzNumber: 22 },
  { id: 102, surahId: 36, ayahNumber: 3, arabicText: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", englishTranslation: "Indeed you are from among the messengers.", banglaTranslation: "নিশ্চয়ই তুমি রাসূলদের অন্তর্ভুক্ত।", juzNumber: 22 },
  { id: 103, surahId: 36, ayahNumber: 4, arabicText: "عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ", englishTranslation: "On a straight path.", banglaTranslation: "সরল পথের উপর।", juzNumber: 22 },
  { id: 104, surahId: 36, ayahNumber: 5, arabicText: "تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ", englishTranslation: "A revelation of the Exalted in Might, the Merciful.", banglaTranslation: "পরাক্রমশালী, দয়ালুর অবতীর্ণ।", juzNumber: 22 },

  // Surah 55: Ar-Rahman (selected ayahs)
  { id: 200, surahId: 55, ayahNumber: 1, arabicText: "الرَّحْمَٰنُ", englishTranslation: "The Most Merciful.", banglaTranslation: "পরম দয়াময়।", juzNumber: 27 },
  { id: 201, surahId: 55, ayahNumber: 2, arabicText: "عَلَّمَ الْقُرْآنَ", englishTranslation: "Taught the Quran.", banglaTranslation: "তিনি শিক্ষা দিয়েছেন কুরআন।", juzNumber: 27 },
  { id: 202, surahId: 55, ayahNumber: 3, arabicText: "خَلَقَ الْإِنْسَانَ", englishTranslation: "Created man.", banglaTranslation: "তিনি সৃষ্টি করেছেন মানুষ।", juzNumber: 27 },
  { id: 203, surahId: 55, ayahNumber: 4, arabicText: "عَلَّمَهُ الْبَيَانَ", englishTranslation: "Taught him eloquence.", banglaTranslation: "তাকে শিখিয়েছেন ভাষা।", juzNumber: 27 },
  { id: 204, surahId: 55, ayahNumber: 13, arabicText: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", englishTranslation: "So which of the favors of your Lord would you deny?", banglaTranslation: "অতএব, তোমরা উভয়ে তোমাদের রবের কোন কোন নিয়ামতকে অস্বীকার করবে?", juzNumber: 27 },

  // Surah 67: Al-Mulk (selected ayahs)
  { id: 300, surahId: 67, ayahNumber: 1, arabicText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", englishTranslation: "Blessed is He in whose hand is dominion, and He is over all things competent.", banglaTranslation: "বরকতময় তিনি যাঁর হাতে রয়েছে সর্বময় কর্তৃত্ব এবং তিনি সর্ববিষয়ে সর্বশক্তিমান।", juzNumber: 29 },
  { id: 301, surahId: 67, ayahNumber: 2, arabicText: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", englishTranslation: "He who created death and life to test you as to which of you is best in deed - and He is the Exalted in Might, the Forgiving.", banglaTranslation: "যিনি মৃত্যু ও জীবন সৃষ্টি করেছেন যাতে তিনি তোমাদেরকে পরীক্ষা করতে পারেন— কে তোমাদের মধ্যে আমলে উত্তম। তিনি পরাক্রমশালী, ক্ষমাশীল।", juzNumber: 29 },

  // Surah 93: Ad-Duha
  { id: 400, surahId: 93, ayahNumber: 1, arabicText: "وَالضُّحَىٰ", englishTranslation: "By the morning brightness.", banglaTranslation: "শপথ পূর্বাহ্নের।", juzNumber: 30 },
  { id: 401, surahId: 93, ayahNumber: 2, arabicText: "وَاللَّيْلِ إِذَا سَجَىٰ", englishTranslation: "And [by] the night when it covers with darkness.", banglaTranslation: "শপথ রাতের, যখন তা গভীর অন্ধকারে ঢেকে যায়।", juzNumber: 30 },
  { id: 402, surahId: 93, ayahNumber: 3, arabicText: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", englishTranslation: "Your Lord has not taken leave of you, nor has He detested [you].", banglaTranslation: "তোমার রব তোমাকে পরিত্যাগ করেননি এবং তোমার প্রতি অসন্তুষ্ট হননি।", juzNumber: 30 },
  { id: 403, surahId: 93, ayahNumber: 4, arabicText: "وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ", englishTranslation: "And the Hereafter is better for you than the first [life].", banglaTranslation: "এবং আখিরাত তোমার জন্য প্রথম জীবনের চেয়ে উত্তম।", juzNumber: 30 },
  { id: 404, surahId: 93, ayahNumber: 5, arabicText: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", englishTranslation: "And your Lord is going to give you, and you will be satisfied.", banglaTranslation: "আর অচিরেই তোমার রব তোমাকে দেবেন, ফলে তুমি সন্তুষ্ট হবে।", juzNumber: 30 },
  { id: 405, surahId: 93, ayahNumber: 6, arabicText: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ", englishTranslation: "Did He not find you an orphan and give [you] refuge?", banglaTranslation: "তিনি কি তোমাকে ইয়াতীম অবস্থায় পাননি? অতঃপর আশ্রয় দিয়েছেন।", juzNumber: 30 },
  { id: 406, surahId: 93, ayahNumber: 7, arabicText: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", englishTranslation: "And He found you lost and guided [you].", banglaTranslation: "তিনি তোমাকে পথহারা পেয়েছেন, অতঃপর পথ দেখিয়েছেন।", juzNumber: 30 },
  { id: 407, surahId: 93, ayahNumber: 8, arabicText: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ", englishTranslation: "And He found you poor and made [you] self-sufficient.", banglaTranslation: "তিনি তোমাকে অভাবগ্রস্ত পেয়েছেন, অতঃপর অভাবমুক্ত করেছেন।", juzNumber: 30 },
  { id: 408, surahId: 93, ayahNumber: 9, arabicText: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ", englishTranslation: "So as for the orphan, do not oppress [him].", banglaTranslation: "সুতরাং ইয়াতীমকে কঠোরভাবে ব্যবহার করো না।", juzNumber: 30 },
  { id: 409, surahId: 93, ayahNumber: 10, arabicText: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ", englishTranslation: "And as for the petitioner, do not repel [him].", banglaTranslation: "আর প্রার্থীকে ধমক দিও না।", juzNumber: 30 },
  { id: 410, surahId: 93, ayahNumber: 11, arabicText: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", englishTranslation: "But as for the favor of your Lord, report [it].", banglaTranslation: "আর তোমার রবের নিয়ামতের কথা প্রকাশ করো।", juzNumber: 30 },

  // Surah 94: Ash-Sharh
  { id: 420, surahId: 94, ayahNumber: 1, arabicText: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", englishTranslation: "Did We not expand for you your breast?", banglaTranslation: "আমি কি তোমার বক্ষ উন্মুক্ত করে দেইনি?", juzNumber: 30 },
  { id: 421, surahId: 94, ayahNumber: 2, arabicText: "وَوَضَعْنَا عَنْكَ وِزْرَكَ", englishTranslation: "And We removed from you your burden.", banglaTranslation: "আমি তোমার থেকে বোঝা নামিয়ে দিয়েছি।", juzNumber: 30 },
  { id: 422, surahId: 94, ayahNumber: 3, arabicText: "الَّذِي أَنْقَضَ ظَهْرَكَ", englishTranslation: "Which had weighed upon your back.", banglaTranslation: "যা তোমার পিঠকে ভারাক্রান্ত করে রেখেছিল।", juzNumber: 30 },
  { id: 423, surahId: 94, ayahNumber: 4, arabicText: "وَرَفَعْنَا لَكَ ذِكْرَكَ", englishTranslation: "And raised high for you your repute.", banglaTranslation: "আর তোমার খ্যাতিকে সমুচ্চ করেছি।", juzNumber: 30 },
  { id: 424, surahId: 94, ayahNumber: 5, arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", englishTranslation: "For indeed, with hardship [will be] ease.", banglaTranslation: "নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।", juzNumber: 30 },
  { id: 425, surahId: 94, ayahNumber: 6, arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", englishTranslation: "Indeed, with hardship [will be] ease.", banglaTranslation: "অবশ্যই কষ্টের সাথে স্বস্তি আছে।", juzNumber: 30 },
  { id: 426, surahId: 94, ayahNumber: 7, arabicText: "فَإِذَا فَرَغْتَ فَانْصَبْ", englishTranslation: "So when you have finished [your duties], then stand up [for worship].", banglaTranslation: "অতএব, যখন অবসর পাও, তখন ইবাদতে মনোনিবেশ করো।", juzNumber: 30 },
  { id: 427, surahId: 94, ayahNumber: 8, arabicText: "وَإِلَىٰ رَبِّكَ فَارْغَبْ", englishTranslation: "And to your Lord direct [your] longing.", banglaTranslation: "এবং তোমার রবের প্রতি মনোযোগ দাও।", juzNumber: 30 },

  // Surah 103: Al-Asr
  { id: 500, surahId: 103, ayahNumber: 1, arabicText: "وَالْعَصْرِ", englishTranslation: "By time.", banglaTranslation: "সময়ের শপথ।", juzNumber: 30 },
  { id: 501, surahId: 103, ayahNumber: 2, arabicText: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ", englishTranslation: "Indeed, mankind is in loss.", banglaTranslation: "নিশ্চয়ই মানুষ ক্ষতির মধ্যে রয়েছে।", juzNumber: 30 },
  { id: 502, surahId: 103, ayahNumber: 3, arabicText: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", englishTranslation: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.", banglaTranslation: "তারা ছাড়া যারা ঈমান এনেছে ও সৎকর্ম করেছে এবং পরস্পরকে সত্যের উপদেশ দিয়েছে ও ধৈর্যের উপদেশ দিয়েছে।", juzNumber: 30 },

  // Surah 108: Al-Kawthar
  { id: 510, surahId: 108, ayahNumber: 1, arabicText: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", englishTranslation: "Indeed, We have granted you Al-Kawthar.", banglaTranslation: "নিশ্চয় আমি তোমাকে কাওসার দান করেছি।", juzNumber: 30 },
  { id: 511, surahId: 108, ayahNumber: 2, arabicText: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", englishTranslation: "So pray to your Lord and sacrifice [to Him alone].", banglaTranslation: "অতএব, তোমার রবের উদ্দেশ্যে সালাত আদায় করো এবং কুরবানী করো।", juzNumber: 30 },
  { id: 512, surahId: 108, ayahNumber: 3, arabicText: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", englishTranslation: "Indeed, your enemy is the one cut off.", banglaTranslation: "নিশ্চয়ই তোমার শত্রুই নির্বংশ।", juzNumber: 30 },

  // Surah 109: Al-Kafirun
  { id: 520, surahId: 109, ayahNumber: 1, arabicText: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", englishTranslation: "Say, 'O disbelievers.'", banglaTranslation: "বলো, 'হে কাফিরগণ!'", juzNumber: 30 },
  { id: 521, surahId: 109, ayahNumber: 2, arabicText: "لَا أَعْبُدُ مَا تَعْبُدُونَ", englishTranslation: "I do not worship what you worship.", banglaTranslation: "আমি তার ইবাদত করি না যার ইবাদত তোমরা করো।", juzNumber: 30 },
  { id: 522, surahId: 109, ayahNumber: 3, arabicText: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ", englishTranslation: "Nor are you worshippers of what I worship.", banglaTranslation: "এবং তোমরাও তার ইবাদতকারী নও যার ইবাদত আমি করি।", juzNumber: 30 },
  { id: 523, surahId: 109, ayahNumber: 4, arabicText: "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ", englishTranslation: "Nor will I be a worshipper of what you worship.", banglaTranslation: "আর আমি তার ইবাদতকারী নই যার ইবাদত তোমরা করে আসছ।", juzNumber: 30 },
  { id: 524, surahId: 109, ayahNumber: 5, arabicText: "وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ", englishTranslation: "Nor will you be worshippers of what I worship.", banglaTranslation: "এবং তোমরা তার ইবাদতকারী নও যার ইবাদত আমি করি।", juzNumber: 30 },
  { id: 525, surahId: 109, ayahNumber: 6, arabicText: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", englishTranslation: "For you is your religion, and for me is my religion.", banglaTranslation: "তোমাদের দ্বীন তোমাদের জন্য, আর আমার দ্বীন আমার জন্য।", juzNumber: 30 },

  // Surah 110: An-Nasr
  { id: 530, surahId: 110, ayahNumber: 1, arabicText: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", englishTranslation: "When the victory of Allah has come and the conquest.", banglaTranslation: "যখন আল্লাহর সাহায্য ও বিজয় আসবে।", juzNumber: 30 },
  { id: 531, surahId: 110, ayahNumber: 2, arabicText: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", englishTranslation: "And you see the people entering into the religion of Allah in multitudes.", banglaTranslation: "এবং তুমি মানুষকে দলে দলে আল্লাহর দ্বীনে প্রবেশ করতে দেখবে।", juzNumber: 30 },
  { id: 532, surahId: 110, ayahNumber: 3, arabicText: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", englishTranslation: "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.", banglaTranslation: "তখন তোমার রবের প্রশংসাসহ তাসবীহ পাঠ করো এবং তাঁর কাছে ক্ষমা চাও। নিশ্চয়ই তিনি তওবা কবুলকারী।", juzNumber: 30 },

  // Surah 112: Al-Ikhlas
  { id: 540, surahId: 112, ayahNumber: 1, arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ", englishTranslation: "Say, 'He is Allah, [who is] One.'", banglaTranslation: "বলো, 'তিনি আল্লাহ, এক-অদ্বিতীয়।'", juzNumber: 30 },
  { id: 541, surahId: 112, ayahNumber: 2, arabicText: "اللَّهُ الصَّمَدُ", englishTranslation: "Allah, the Eternal Refuge.", banglaTranslation: "আল্লাহ অমুখাপেক্ষী।", juzNumber: 30 },
  { id: 542, surahId: 112, ayahNumber: 3, arabicText: "لَمْ يَلِدْ وَلَمْ يُولَدْ", englishTranslation: "He neither begets nor is born.", banglaTranslation: "তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি।", juzNumber: 30 },
  { id: 543, surahId: 112, ayahNumber: 4, arabicText: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", englishTranslation: "Nor is there to Him any equivalent.", banglaTranslation: "এবং তাঁর সমতুল্য কেউ নেই।", juzNumber: 30 },

  // Surah 113: Al-Falaq
  { id: 550, surahId: 113, ayahNumber: 1, arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", englishTranslation: "Say, 'I seek refuge in the Lord of daybreak.'", banglaTranslation: "বলো, 'আমি আশ্রয় চাই ভোরের রবের।'", juzNumber: 30 },
  { id: 551, surahId: 113, ayahNumber: 2, arabicText: "مِنْ شَرِّ مَا خَلَقَ", englishTranslation: "From the evil of that which He created.", banglaTranslation: "তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে।", juzNumber: 30 },
  { id: 552, surahId: 113, ayahNumber: 3, arabicText: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ", englishTranslation: "And from the evil of darkness when it settles.", banglaTranslation: "আর অন্ধকারের অনিষ্ট থেকে যখন তা গভীর হয়।", juzNumber: 30 },
  { id: 553, surahId: 113, ayahNumber: 4, arabicText: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", englishTranslation: "And from the evil of the blowers in knots.", banglaTranslation: "আর গ্রন্থিতে ফুৎকারকারিণীদের অনিষ্ট থেকে।", juzNumber: 30 },
  { id: 554, surahId: 113, ayahNumber: 5, arabicText: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", englishTranslation: "And from the evil of an envier when he envies.", banglaTranslation: "আর হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।", juzNumber: 30 },

  // Surah 114: An-Nas
  { id: 560, surahId: 114, ayahNumber: 1, arabicText: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", englishTranslation: "Say, 'I seek refuge in the Lord of mankind.'", banglaTranslation: "বলো, 'আমি আশ্রয় চাই মানুষের রবের।'", juzNumber: 30 },
  { id: 561, surahId: 114, ayahNumber: 2, arabicText: "مَلِكِ النَّاسِ", englishTranslation: "The Sovereign of mankind.", banglaTranslation: "মানুষের অধিপতির।", juzNumber: 30 },
  { id: 562, surahId: 114, ayahNumber: 3, arabicText: "إِلَٰهِ النَّاسِ", englishTranslation: "The God of mankind.", banglaTranslation: "মানুষের ইলাহের।", juzNumber: 30 },
  { id: 563, surahId: 114, ayahNumber: 4, arabicText: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", englishTranslation: "From the evil of the retreating whisperer.", banglaTranslation: "আত্মগোপনকারী কুমন্ত্রণাদাতার অনিষ্ট থেকে।", juzNumber: 30 },
  { id: 564, surahId: 114, ayahNumber: 5, arabicText: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", englishTranslation: "Who whispers [evil] into the breasts of mankind.", banglaTranslation: "যে মানুষের অন্তরে কুমন্ত্রণা দেয়।", juzNumber: 30 },
  { id: 565, surahId: 114, ayahNumber: 6, arabicText: "مِنَ الْجِنَّةِ وَالنَّاسِ", englishTranslation: "From among the jinn and mankind.", banglaTranslation: "জিন ও মানুষের মধ্য থেকে।", juzNumber: 30 },

  // Surah 111: Al-Masad
  { id: 570, surahId: 111, ayahNumber: 1, arabicText: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", englishTranslation: "May the hands of Abu Lahab be ruined, and ruined is he.", banglaTranslation: "আবু লাহাবের দুই হাত ধ্বংস হোক এবং সে ধ্বংস হোক।", juzNumber: 30 },
  { id: 571, surahId: 111, ayahNumber: 2, arabicText: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", englishTranslation: "His wealth will not avail him or that which he gained.", banglaTranslation: "তার ধন-সম্পদ ও তার উপার্জন তার কোনো কাজে আসবে না।", juzNumber: 30 },
  { id: 572, surahId: 111, ayahNumber: 3, arabicText: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", englishTranslation: "He will burn in a Fire of [blazing] flame.", banglaTranslation: "অচিরেই সে লেলিহান আগুনে প্রবেশ করবে।", juzNumber: 30 },
  { id: 573, surahId: 111, ayahNumber: 4, arabicText: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", englishTranslation: "And his wife [as well] - the carrier of firewood.", banglaTranslation: "এবং তার স্ত্রীও— যে ইন্ধন বহনকারিণী।", juzNumber: 30 },
  { id: 574, surahId: 111, ayahNumber: 5, arabicText: "فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ", englishTranslation: "Around her neck is a rope of [twisted] fiber.", banglaTranslation: "তার গলায় পাকানো রশি।", juzNumber: 30 },

  // Surah 105: Al-Fil
  { id: 580, surahId: 105, ayahNumber: 1, arabicText: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", englishTranslation: "Have you not considered how your Lord dealt with the companions of the elephant?", banglaTranslation: "তুমি কি দেখোনি তোমার রব হাতিওয়ালাদের সাথে কী করেছিলেন?", juzNumber: 30 },
  { id: 581, surahId: 105, ayahNumber: 2, arabicText: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ", englishTranslation: "Did He not make their plan into misguidance?", banglaTranslation: "তিনি কি তাদের চক্রান্ত ব্যর্থ করে দেননি?", juzNumber: 30 },
  { id: 582, surahId: 105, ayahNumber: 3, arabicText: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", englishTranslation: "And He sent against them birds in flocks.", banglaTranslation: "এবং তিনি তাদের বিরুদ্ধে ঝাঁকে ঝাঁকে পাখি পাঠিয়েছিলেন।", juzNumber: 30 },
  { id: 583, surahId: 105, ayahNumber: 4, arabicText: "تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ", englishTranslation: "Striking them with stones of hard clay.", banglaTranslation: "যারা তাদের উপর পোড়া মাটির পাথর নিক্ষেপ করেছিল।", juzNumber: 30 },
  { id: 584, surahId: 105, ayahNumber: 5, arabicText: "فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ", englishTranslation: "And He made them like eaten straw.", banglaTranslation: "অতঃপর তিনি তাদেরকে ভক্ষিত তৃণের মতো করে দিলেন।", juzNumber: 30 },

  // Surah 106: Quraysh
  { id: 590, surahId: 106, ayahNumber: 1, arabicText: "لِإِيلَافِ قُرَيْشٍ", englishTranslation: "For the accustomed security of the Quraysh.", banglaTranslation: "কুরাইশের আসক্তির কারণে।", juzNumber: 30 },
  { id: 591, surahId: 106, ayahNumber: 2, arabicText: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", englishTranslation: "Their accustomed security [in] the caravan of winter and summer.", banglaTranslation: "শীত ও গ্রীষ্মকালীন সফরে তাদের আসক্তি।", juzNumber: 30 },
  { id: 592, surahId: 106, ayahNumber: 3, arabicText: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ", englishTranslation: "Let them worship the Lord of this House.", banglaTranslation: "অতএব, তারা যেন এই ঘরের রবের ইবাদত করে।", juzNumber: 30 },
  { id: 593, surahId: 106, ayahNumber: 4, arabicText: "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ", englishTranslation: "Who has fed them, [saving them] from hunger and made them safe, [saving them] from fear.", banglaTranslation: "যিনি তাদেরকে ক্ষুধায় অন্ন দিয়েছেন এবং ভয় থেকে নিরাপত্তা দিয়েছেন।", juzNumber: 30 },

  // Surah 107: Al-Ma'un
  { id: 600, surahId: 107, ayahNumber: 1, arabicText: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", englishTranslation: "Have you seen the one who denies the Recompense?", banglaTranslation: "তুমি কি দেখেছ তাকে, যে দ্বীনকে মিথ্যা বলে?", juzNumber: 30 },
  { id: 601, surahId: 107, ayahNumber: 2, arabicText: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", englishTranslation: "For that is the one who drives away the orphan.", banglaTranslation: "সেই তো সেই ব্যক্তি যে ইয়াতীমকে ধাক্কা দেয়।", juzNumber: 30 },
  { id: 602, surahId: 107, ayahNumber: 3, arabicText: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ", englishTranslation: "And does not encourage the feeding of the poor.", banglaTranslation: "এবং মিসকিনকে খাবার দিতে উৎসাহিত করে না।", juzNumber: 30 },
  { id: 603, surahId: 107, ayahNumber: 4, arabicText: "فَوَيْلٌ لِلْمُصَلِّينَ", englishTranslation: "So woe to those who pray.", banglaTranslation: "অতএব, সেই সালাত আদায়কারীদের জন্য দুর্ভোগ।", juzNumber: 30 },
  { id: 604, surahId: 107, ayahNumber: 5, arabicText: "الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ", englishTranslation: "Who are heedless of their prayer.", banglaTranslation: "যারা তাদের সালাতের ব্যাপারে উদাসীন।", juzNumber: 30 },
  { id: 605, surahId: 107, ayahNumber: 6, arabicText: "الَّذِينَ هُمْ يُرَاءُونَ", englishTranslation: "Those who make show [of their deeds].", banglaTranslation: "যারা লোক দেখানোর জন্য কাজ করে।", juzNumber: 30 },
  { id: 606, surahId: 107, ayahNumber: 7, arabicText: "وَيَمْنَعُونَ الْمَاعُونَ", englishTranslation: "And withhold [simple] assistance.", banglaTranslation: "এবং নিত্য প্রয়োজনীয় সামগ্রী দিতে বিরত থাকে।", juzNumber: 30 },

  // Surah 97: Al-Qadr
  { id: 610, surahId: 97, ayahNumber: 1, arabicText: "إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", englishTranslation: "Indeed, We sent the Quran down during the Night of Decree.", banglaTranslation: "নিশ্চয়ই আমি এটি নাযিল করেছি কদরের রাতে।", juzNumber: 30 },
  { id: 611, surahId: 97, ayahNumber: 2, arabicText: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", englishTranslation: "And what can make you know what is the Night of Decree?", banglaTranslation: "তুমি কি জানো কদরের রাত কী?", juzNumber: 30 },
  { id: 612, surahId: 97, ayahNumber: 3, arabicText: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ", englishTranslation: "The Night of Decree is better than a thousand months.", banglaTranslation: "কদরের রাত হাজার মাসের চেয়ে উত্তম।", juzNumber: 30 },
  { id: 613, surahId: 97, ayahNumber: 4, arabicText: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ", englishTranslation: "The angels and the Spirit descend therein by permission of their Lord for every matter.", banglaTranslation: "ফেরেশতাগণ ও রূহ এতে তাদের রবের অনুমতিক্রমে প্রতিটি কাজে অবতীর্ণ হন।", juzNumber: 30 },
  { id: 614, surahId: 97, ayahNumber: 5, arabicText: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", englishTranslation: "Peace it is until the emergence of dawn.", banglaTranslation: "শান্তিময় সেই রাত, ফজরের উদয় পর্যন্ত।", juzNumber: 30 },
];

export function getAyahsBySurah(surahId: number): Ayah[] {
  return ayahs.filter(a => a.surahId === surahId);
}

export function searchAyahs(query: string): Ayah[] {
  const q = query.toLowerCase();
  return ayahs.filter(a =>
    a.arabicText.includes(query) ||
    a.englishTranslation.toLowerCase().includes(q) ||
    a.banglaTranslation.includes(query)
  );
}

export function getRandomAyah(): Ayah {
  return ayahs[Math.floor(Math.random() * ayahs.length)];
}
