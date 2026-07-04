"use client";

// Global audio player. Owns a single <audio> element whose `src` points at
// the FastAPI stream proxy (GET /api/stream/{yt_id}) — OR a local blob URL for
// imported files. Because the backend honors Range requests, setting
// `audio.currentTime` seeks correctly.
//
// NOTE (v2 upgrade): This context was EXTENDED additively. The original
// streaming/seeking logic is untouched. New, purely-additive features:
//   likedSongs/toggleLike, recentlyPlayed, catalog/registerSongs,
//   removeFromQueue/clearQueue, shuffle/repeat, and toast notifications.
// Convenience aliases (currentSong, pauseSong, nextSong, prevSong) are also
// exposed so both old and new components compile.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import type { Song } from "@/types";
import { getStreamUrl } from "@/services/api";

interface PlayerContextValue {
  // --- original API (unchanged) ---
  current: Song | null;
  queue: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: Song, list?: Song[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  addToQueue: (song: Song) => void;

  // --- v2 additions ---
  currentSong: Song | null; // alias of `current`
  pauseSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  likedSongs: Song[];
  toggleLike: (song: Song) => void;
  isLiked: (song: Song) => boolean;
  recentlyPlayed: Song[];
  catalog: Song[];
  registerSongs: (songs: Song[]) => void;
  removeFromQueue: (ytId: string) => void;
  clearQueue: () => void;
  playFromQueue: (ytId: string) => void;
  shuffle: boolean;
  repeat: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const LIKED_KEY = "nova_liked_songs";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  // v2 state
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [catalog, setCatalog] = useState<Song[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const current = index >= 0 ? queue[index] ?? null : null;

  // Refs so the audio "ended" handler always sees fresh values.
  const queueRef = useRef<Song[]>([]);
  const shuffleRef = useRef(false);
  const repeatRef = useRef(false);
  useEffect(() => void (queueRef.current = queue), [queue]);
  useEffect(() => void (shuffleRef.current = shuffle), [shuffle]);
  useEffect(() => void (repeatRef.current = repeat), [repeat]);

  const advance = useCallback(() => {
    setIndex((i) => {
      const q = queueRef.current;
      if (q.length === 0) return i;
      if (shuffleRef.current) return Math.floor(Math.random() * q.length);
      return i + 1 < q.length ? i + 1 : i;
    });
  }, []);

  // Load liked songs from localStorage once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LIKED_KEY);
      if (raw) setLikedSongs(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // Create the audio element once, on the client. (UNCHANGED LOGIC)
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      // v2: honor repeat, else advance (respecting shuffle).
      if (repeatRef.current) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
        return;
      }
      advance();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the current track changes, point the src and play.
  // (Original logic + one additive line: local blobs bypass the proxy.)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = current.localUrl ?? getStreamUrl(current.yt_id);
    setCurrentTime(0);
    setDuration(0);
    audio.play().catch(() => setIsPlaying(false));

    // v2: record into "recently played" (dedupe + cap 30).
    setRecentlyPlayed((prev) => {
      const rest = prev.filter((s) => s.yt_id !== current.yt_id);
      return [current, ...rest].slice(0, 30);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.yt_id]);

  const registerSongs = useCallback((songs: Song[]) => {
    if (!songs?.length) return;
    setCatalog((prev) => {
      const map = new Map(prev.map((s) => [s.yt_id, s]));
      for (const s of songs) if (!map.has(s.yt_id)) map.set(s.yt_id, s);
      return Array.from(map.values());
    });
  }, []);

  const playSong = useCallback(
    (song: Song, list?: Song[]) => {
      registerSongs(list?.length ? list : [song]);
      if (list && list.length) {
        const i = Math.max(0, list.findIndex((s) => s.yt_id === song.yt_id));
        setQueue(list);
        setIndex(i);
      } else {
        setQueue((q) => {
          const exists = q.findIndex((s) => s.yt_id === song.yt_id);
          if (exists >= 0) {
            setIndex(exists);
            return q;
          }
          const nextQueue = [...q, song];
          setIndex(nextQueue.length - 1);
          return nextQueue;
        });
      }
    },
    [registerSongs]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [current]);

  const pauseSong = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const next = useCallback(() => advance(), [advance]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time; // triggers a Range request to the backend
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolumeState(v);
  }, []);

  const addToQueue = useCallback(
    (song: Song) => {
      registerSongs([song]);
      setQueue((q) => {
        if (q.some((s) => s.yt_id === song.yt_id)) {
          toast(`Already in queue`, { icon: "🎧" });
          return q;
        }
        const nextQueue = [...q, song];
        setIndex((i) => (i < 0 ? nextQueue.length - 1 : i));
        return nextQueue;
      });
      toast.success(`Added “${song.title}” to queue`);
    },
    [registerSongs]
  );

  const removeFromQueue = useCallback((ytId: string) => {
    setQueue((q) => {
      const idx = q.findIndex((s) => s.yt_id === ytId);
      if (idx < 0) return q;
      const nextQueue = q.filter((s) => s.yt_id !== ytId);
      // Keep `index` pointing at the same current track.
      setIndex((cur) => {
        if (idx < cur) return cur - 1;
        if (idx === cur) return Math.min(cur, nextQueue.length - 1);
        return cur;
      });
      return nextQueue;
    });
  }, []);

  const clearQueue = useCallback(() => {
    audioRef.current?.pause();
    setQueue([]);
    setIndex(-1);
    toast("Queue cleared", { icon: "🧹" });
  }, []);

  const playFromQueue = useCallback((ytId: string) => {
    setIndex(() => queueRef.current.findIndex((s) => s.yt_id === ytId));
  }, []);

  const toggleLike = useCallback((song: Song) => {
    setLikedSongs((prev) => {
      const exists = prev.some((s) => s.yt_id === song.yt_id);
      const nextLiked = exists
        ? prev.filter((s) => s.yt_id !== song.yt_id)
        : [song, ...prev];
      try {
        localStorage.setItem(LIKED_KEY, JSON.stringify(nextLiked));
      } catch {
        /* ignore */
      }
      if (exists) toast(`Removed from Liked`, { icon: "💔" });
      else toast.success(`Liked “${song.title}”`);
      return nextLiked;
    });
  }, []);

  const isLiked = useCallback(
    (song: Song) => likedSongs.some((s) => s.yt_id === song.yt_id),
    [likedSongs]
  );

  const toggleShuffle = useCallback(() => {
    setShuffle((v) => {
      toast(!v ? "Shuffle on" : "Shuffle off", { icon: "🔀" });
      return !v;
    });
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat((v) => {
      toast(!v ? "Repeat on" : "Repeat off", { icon: "🔁" });
      return !v;
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        current,
        queue,
        isPlaying,
        currentTime,
        duration,
        volume,
        playSong,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        addToQueue,
        // v2
        currentSong: current,
        pauseSong,
        nextSong: next,
        prevSong: prev,
        likedSongs,
        toggleLike,
        isLiked,
        recentlyPlayed,
        catalog,
        registerSongs,
        removeFromQueue,
        clearQueue,
        playFromQueue,
        shuffle,
        repeat,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within <PlayerProvider>");
  return ctx;
}
