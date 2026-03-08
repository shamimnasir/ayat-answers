import { Bookmark } from "@/types/quran";

const BOOKMARKS_KEY = "quran-bookmarks";

export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(surahId: number, ayahNumber: number): Bookmark[] {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some(b => b.surahId === surahId && b.ayahNumber === ayahNumber);
  if (!exists) {
    bookmarks.push({ surahId, ayahNumber, timestamp: Date.now() });
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
  return bookmarks;
}

export function removeBookmark(surahId: number, ayahNumber: number): Bookmark[] {
  const bookmarks = getBookmarks().filter(
    b => !(b.surahId === surahId && b.ayahNumber === ayahNumber)
  );
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return bookmarks;
}

export function isBookmarked(surahId: number, ayahNumber: number): boolean {
  return getBookmarks().some(b => b.surahId === surahId && b.ayahNumber === ayahNumber);
}
