import { Capacitor } from "@capacitor/core";
import { InAppReview } from "@capacitor-community/in-app-review";

const COUNT_KEY = "quran-surahs-read";
const ASKED_KEY = "quran-review-asked";
const ASK_AFTER = 3;

/** Call when someone leaves a surah. Play itself decides whether the dialog actually shows. */
export function noteSurahFinishedReading() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    if (localStorage.getItem(ASKED_KEY)) return;
    const count = Number(localStorage.getItem(COUNT_KEY) ?? 0) + 1;
    localStorage.setItem(COUNT_KEY, String(count));
    if (count < ASK_AFTER) return;
    localStorage.setItem(ASKED_KEY, "1");
    InAppReview.requestReview().catch(() => {});
  } catch { /* storage unavailable: skip the prompt */ }
}
