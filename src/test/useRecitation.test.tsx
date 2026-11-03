import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRecitation } from "@/hooks/useRecitation";
import { ayahAudioUrl } from "@/lib/recitation";

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

  it("pauses and resumes", async () => {
    const { result } = renderHook(() => useRecitation(1, 7));
    await act(() => result.current.play());
    await waitFor(() => expect(result.current.playing).toBe(true));
    act(() => result.current.pause());
    expect(result.current.playing).toBe(false);
    expect(result.current.currentAyah).toBe(1);
  });
});
