import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRecitation } from "@/hooks/useRecitation";
import { ayahAudioUrl } from "@/lib/recitation";

const nowPlaying = vi.hoisted(() => ({ states: [] as string[], titles: [] as string[], handlers: {} as Record<string, () => void> }));
vi.mock("@/lib/nowPlaying", () => ({
  setNowPlaying: (title: string) => nowPlaying.titles.push(title),
  setNowPlayingState: (s: string) => nowPlaying.states.push(s),
  setNowPlayingHandlers: (h: Record<string, () => void>) => Object.assign(nowPlaying.handlers, h),
}));

let audio: HTMLAudioElement;

beforeEach(() => {
  vi.stubGlobal("caches", { open: async () => ({ match: async () => undefined }) });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLAudioElement) {
    audio = this;
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

describe("useRecitation", () => {
  it("plays the Bismillah, then each verse in order, then stops", async () => {
    const { result } = renderHook(() => useRecitation(112, 2));

    await act(() => result.current.play());
    await waitFor(() => expect(result.current.currentAyah).toBe(0));
    expect(audio.src).toBe(ayahAudioUrl(1, 1));

    await act(async () => { audio.dispatchEvent(new Event("ended")); });
    await waitFor(() => expect(result.current.currentAyah).toBe(1));
    expect(audio.src).toBe(ayahAudioUrl(112, 1));

    await act(async () => { audio.dispatchEvent(new Event("ended")); });
    await waitFor(() => expect(result.current.currentAyah).toBe(2));

    await act(async () => { audio.dispatchEvent(new Event("ended")); });
    await waitFor(() => expect(result.current.playing).toBe(false));
    expect(result.current.currentAyah).toBe(null);
  });

  it("starts from a chosen verse", async () => {
    const { result } = renderHook(() => useRecitation(2, 286));
    await act(() => result.current.play(255));
    await waitFor(() => expect(result.current.currentAyah).toBe(255));
    expect(audio.src).toBe(ayahAudioUrl(2, 255));
    expect(result.current.playing).toBe(true);
  });

  it("publishes the playing verse to the lock screen and follows its controls", async () => {
    nowPlaying.states.length = 0;
    nowPlaying.titles.length = 0;
    const { result } = renderHook(() => useRecitation(1, 7, "Al-Fatiha"));
    await act(() => result.current.play(3));
    await waitFor(() => expect(nowPlaying.states.at(-1)).toBe("playing"));
    expect(nowPlaying.titles.at(-1)).toBe("Al-Fatiha · Verse 3");

    await act(async () => { nowPlaying.handlers.nexttrack(); });
    await waitFor(() => expect(result.current.currentAyah).toBe(4));

    await act(async () => { nowPlaying.handlers.pause(); });
    expect(result.current.playing).toBe(false);
    expect(nowPlaying.states.at(-1)).toBe("paused");
  });

  it("pauses and resumes", async () => {
    const { result } = renderHook(() => useRecitation(1, 7));
    await act(() => result.current.play());
    await waitFor(() => expect(result.current.playing).toBe(true));
    act(() => result.current.pause());
    expect(result.current.playing).toBe(false);
    expect(result.current.currentAyah).toBe(1);
  });
});
