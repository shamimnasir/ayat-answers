import { useCallback, useEffect, useRef, useState } from "react";
import { resolvePlayableSrc, surahPlaylist, Track } from "@/lib/recitation";

export function useRecitation(surahId: number, totalAyahs: number) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksRef = useRef<Track[]>([]);
  const indexRef = useRef(-1);
  const blobRef = useRef<string | null>(null);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  const releaseBlob = () => {
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = null;
  };

  const stop = useCallback(() => {
    audioRef.current?.pause();
    releaseBlob();
    indexRef.current = -1;
    setPlaying(false);
    setCurrentAyah(null);
  }, []);

  const playIndex = useCallback(async (i: number) => {
    const track = tracksRef.current[i];
    if (!track) return stop();
    const audio = audioRef.current ?? (audioRef.current = new Audio());
    indexRef.current = i;
    setCurrentAyah(track.ayahNumber);
    setError(false);
    releaseBlob();
    const src = await resolvePlayableSrc(track.url);
    if (src.startsWith("blob:")) blobRef.current = src;
    audio.src = src;
    audio.onended = () => playIndex(indexRef.current + 1);
    audio.onerror = () => { setError(true); setPlaying(false); };
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setError(true);
      setPlaying(false);
    }
  }, [stop]);

  /** Play from a verse (default: the start), or resume if paused mid-verse. */
  const play = useCallback(async (fromAyah?: number) => {
    if (fromAyah === undefined && indexRef.current >= 0 && audioRef.current) {
      await audioRef.current.play();
      setPlaying(true);
      return;
    }
    const i = fromAyah === undefined ? 0 : tracksRef.current.findIndex(t => t.ayahNumber === fromAyah);
    await playIndex(Math.max(i, 0));
  }, [playIndex]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  useEffect(() => {
    tracksRef.current = surahPlaylist(surahId, totalAyahs);
    return stop;
  }, [surahId, totalAyahs, stop]);

  return { play, pause, stop, playing, currentAyah, error };
}
