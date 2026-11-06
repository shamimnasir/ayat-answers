import { render, screen } from "@testing-library/react";
import { readFileSync } from "fs";
import path from "path";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import DailyVerse from "@/components/DailyVerse";
import { DAILY_VERSES, pickDailyVerse } from "@/data/dailyVerses";

const dir = path.resolve(__dirname, "../../public/quran");
const read = (f: string) => readFileSync(path.join(dir, f), "utf8");
const en: Record<string, string[]> = JSON.parse(read("quran-en.json"));

beforeAll(() => {
  globalThis.fetch = (async (url: string) =>
    new Response(read(String(url).split("/").pop()!), { status: 200 })) as typeof fetch;
});

afterEach(() => vi.useRealTimers());

describe("daily verse list", () => {
  it("only references verses that exist, with no duplicates", () => {
    expect(new Set(DAILY_VERSES.map(String)).size).toBe(DAILY_VERSES.length);
    for (const [s, a] of DAILY_VERSES) expect(en[s]?.[a - 1], `${s}:${a}`).toBeTruthy();
  });

  it("contains no verse about punishment or Hell, which read badly without context", () => {
    for (const [s, a] of DAILY_VERSES) {
      expect(en[s][a - 1], `${s}:${a}`).not.toMatch(/\b([Pp]unish\w*|Fire|Hell\w*|[Ff]ight\w*)\b/);
    }
  });

  it("shows every verse once before repeating", () => {
    const start = new Date(2027, 0, 1);
    const seen = new Set<string>();
    for (let i = 0; i < DAILY_VERSES.length; i++) {
      seen.add(String(pickDailyVerse(new Date(2027, 0, 1 + i))));
    }
    expect(seen.size).toBe(DAILY_VERSES.length);
    expect(pickDailyVerse(start)).toEqual(pickDailyVerse(new Date(2027, 0, 1, 23, 59)));
  });
});

describe("DailyVerse", () => {
  it("shows today's verse from the bundled Quran, with its Arabic and translations", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 6));
    const [s, a] = pickDailyVerse(new Date());

    render(<DailyVerse onSelectSurah={() => {}} />);

    expect(await screen.findByText(`"${en[s][a - 1]}"`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`\\(${s}:${a}\\)`))).toBeInTheDocument();
    expect(screen.queryByText(/Abu Lahab|blazing/)).not.toBeInTheDocument();
  });
});
