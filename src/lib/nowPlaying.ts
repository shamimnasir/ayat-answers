import { MediaSession } from "@capgo/capacitor-media-session";
import type { MediaSessionAction, MediaSessionPlaybackState } from "@capgo/capacitor-media-session";

// On Android this runs a media-playback foreground service, which keeps recitation
// going with the screen off and shows lock-screen controls. Failures never block playback.
const safe = (p: () => Promise<unknown>) => { try { p().catch(() => {}); } catch { /* unsupported */ } };

export function setNowPlaying(title: string, artist: string, artworkSrc: string) {
  safe(() => MediaSession.setMetadata({ title, artist, album: "Al Quran", artwork: [{ src: artworkSrc, sizes: "512x512", type: "image/png" }] }));
}

export function setNowPlayingState(state: MediaSessionPlaybackState) {
  safe(() => MediaSession.setPlaybackState({ playbackState: state }));
}

export function setNowPlayingHandlers(handlers: Partial<Record<MediaSessionAction, () => void>>) {
  for (const [action, fn] of Object.entries(handlers)) {
    safe(() => MediaSession.setActionHandler({ action: action as MediaSessionAction }, fn ? () => fn() : null));
  }
}
