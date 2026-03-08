export interface Surah {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  nameBangla: string;
  revelationType: 'Meccan' | 'Medinan';
  totalAyahs: number;
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  banglaTranslation: string;
  juzNumber: number;
}

export interface Bookmark {
  surahId: number;
  ayahNumber: number;
  timestamp: number;
}
