import { beforeEach, describe, expect, it, vi } from "vitest";
import { noteSurahFinishedReading } from "@/lib/reviewPrompt";

const mocks = vi.hoisted(() => ({ requestReview: vi.fn(async () => {}), native: true }));
vi.mock("@capacitor-community/in-app-review", () => ({ InAppReview: { requestReview: mocks.requestReview } }));
vi.mock("@capacitor/core", () => ({ Capacitor: { isNativePlatform: () => mocks.native } }));

beforeEach(() => {
  localStorage.clear();
  mocks.requestReview.mockClear();
  mocks.native = true;
});

describe("in-app review prompt", () => {
  it("asks after the third surah, not before", () => {
    noteSurahFinishedReading();
    noteSurahFinishedReading();
    expect(mocks.requestReview).not.toHaveBeenCalled();
    noteSurahFinishedReading();
    expect(mocks.requestReview).toHaveBeenCalledTimes(1);
  });

  it("only ever asks once", () => {
    for (let i = 0; i < 8; i++) noteSurahFinishedReading();
    expect(mocks.requestReview).toHaveBeenCalledTimes(1);
  });

  it("never asks on the website, where Play reviews don't exist", () => {
    mocks.native = false;
    for (let i = 0; i < 5; i++) noteSurahFinishedReading();
    expect(mocks.requestReview).not.toHaveBeenCalled();
  });
});
