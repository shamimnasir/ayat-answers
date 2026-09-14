# Google Play Store Listing Content

## App Name (max 30 characters)
Al Quran - القرآن الكريم

## Short Description (max 80 characters)
Read the Holy Quran with Arabic text, translations & AI-powered search.

## Full Description (max 4000 characters)

📖 Al Quran — The Holy Quran at Your Fingertips

Read, search, and explore the complete Holy Quran with a beautifully designed, modern interface. Al Quran brings you the entire Quran with Arabic text, English translations, and Bangla (বাংলা) translations — all in one app.

✨ KEY FEATURES:

📚 Complete Quran
• All 114 Surahs with full Arabic text
• English translation for every ayah
• Bangla (বাংলা) translation for every ayah
• Beautiful, easy-to-read typography

🤖 AI-Powered Search & Assistant
• Search the entire Quran by topic, keyword, or question
• Ask questions about the Quran and get intelligent answers
• Search in Arabic, English, or Bangla
• Find relevant verses instantly

🔖 Bookmarks & Daily Verse
• Save your favorite verses for quick access
• Daily verse feature for daily inspiration
• Continue reading from where you left off

🌙 Beautiful Design
• Elegant dark green and gold Islamic theme
• Light and dark mode support
• Clean, distraction-free reading experience
• Smooth, modern mobile interface

🌐 Multilingual Support
• Arabic (العربية)
• English
• Bangla (বাংলা)

📱 Works Offline
• Progressive Web App — works without internet
• Fast and lightweight
• No ads, completely free

Whether you're looking to read your daily verses, search for specific topics in the Quran, or explore the meanings with translations, Al Quran is your perfect companion.

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
In the name of Allah, the Most Gracious, the Most Merciful.

Download now and start your journey with the Holy Quran.

---

## Category
Education

## Tags/Keywords
quran, holy quran, islam, arabic, bangla quran, english quran, quran translation, islamic app, quran reader, al quran, কুরআন, القرآن

## Content Rating
Everyone

## Contact Email
(Your email address)

## Privacy Policy URL
https://ayat-answers.lovable.app/privacy-policy.html

---

## Required Assets Checklist

| Asset | Size | File |
|-------|------|------|
| App Icon | 512x512 PNG | `/icon-512.png` (already exists) |
| Feature Graphic | 1024x500 PNG | `feature-graphic.png` (resize to 1024x500) |
| Screenshot 1 | 1080x1920 | `screenshot-1-reader.png` |
| Screenshot 2 | 1080x1920 | `screenshot-2-home.png` |
| Screenshot 3 | 1080x1920 | `screenshot-3-ai.png` |
| Screenshot 4 | 1080x1920 | `screenshot-4-surahs.png` |

**Note:** Google Play requires minimum 2 screenshots, recommended 4-8.

**💡 TIP:** For best results, take real screenshots from your app on a phone instead of using AI-generated mockups. Open https://ayat-answers.lovable.app on your phone, take screenshots of each screen, and upload those.

---

## Store assets (regenerated 2026-09-14)

The previous `screenshot-*.png` and `feature-graphic.png` in this folder were
AI-generated mockups containing meaningless text — fabricated pseudo-Arabic made
to look like scripture, and captions such as "Bismillrah Dfrom Quaah" and
"Cehtzil|Xuen Uirum". They never depicted the real app. They were not uploaded
to the live listing (the three screenshots live on Play were genuine), but they
have been deleted so nobody ships them by mistake.

Everything here is now captured from the running app, or drawn from real text:

| File | What it is |
|---|---|
| `screenshot-1-home.png` | Home, Ayah of the Day |
| `screenshot-2-surahs.png` | Surah list |
| `screenshot-3-reader-pronunciation.png` | Reader with the pronunciation line |
| `screenshot-4-ai-search.png` | AI search with suggestions |
| `feature-graphic.png` | Built from `feature-graphic.html` |

All screenshots are 1080x1920 (9:16), above Play's 1080 px promotion threshold.
The feature graphic is 1024x500 as Play requires.

### Regenerating

Screenshots are captured from a real build, so rebuild and serve first:

```bash
npm run build && npx vite preview --port 4174 --strictPort   # in one shell
node scripts/capture-store-screenshots.js ./out              # in another
node scripts/capture-feature-graphic.js \
  "$PWD/public/play-store/feature-graphic.html" out/feature-graphic.png 1024 500
```

Both scripts drive the installed Google Chrome through `puppeteer-core`, which
is intentionally not a dependency of this project — install it ad hoc when you
need to regenerate. Screenshots render at 360x640 CSS with a 3x device pixel
ratio, which produces a true 1080x1920 image that lays out like a phone rather
than a 1080 px wide desktop window.
