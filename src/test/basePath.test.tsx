import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/pages/Index", () => ({ default: () => <p>home screen</p> }));

// GitHub Pages serves the app from a project subpath; the Android app launches it there.
const PAGES_BASE = "/ayat-answers/";

async function renderAppAt(path: string) {
  vi.stubEnv("BASE_URL", PAGES_BASE);
  window.history.pushState({}, "", path);
  vi.resetModules();
  const { default: App } = await import("@/App");
  render(<App />);
}

afterEach(() => {
  vi.unstubAllEnvs();
  window.history.pushState({}, "", "/");
});

describe("app served from the GitHub Pages subpath", () => {
  it("shows the home screen at the launch URL instead of the 404 page", async () => {
    await renderAppAt(PAGES_BASE);
    expect(await screen.findByText("home screen")).toBeInTheDocument();
    expect(screen.queryByText(/page not found/i)).not.toBeInTheDocument();
  });

  it("shows the home screen when the trailing slash is missing", async () => {
    await renderAppAt("/ayat-answers");
    expect(await screen.findByText("home screen")).toBeInTheDocument();
  });

  it("links the 404 page back into the app, not the bare domain", async () => {
    await renderAppAt(`${PAGES_BASE}no-such-page`);
    expect(screen.getByRole("link", { name: /return to home/i })).toHaveAttribute("href", "/ayat-answers");
  });
});
