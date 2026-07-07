"use client";

// Global audio player. Owns a single <audio> element whose `src` points at
// the FastAPI stream proxy (GET /api/stream/{yt_id}) — OR a local blob URL for
// imported files. Because the backend honors Range requests, setting
// `audio.currentTime` seeks correctly.

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
import { getStreamUrl, incrementPlayCount, getTrending, tokenStore } from "@/services/api";
import { addLike, listLikes, removeLike } from "@/services/likesApi";

interface PlayerContextValue {
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
  currentSong: Song | null;
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
  // Downloads
  downloadedSongs: Song[];
  addDownload: (song: Song) => void;
  removeDownload: (ytId: string) => void;
  isDownloaded: (song: Song) => boolean;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const LIKED_KEY = "nova_liked_songs";
const DL_KEY = "nova_downloads";
const RP_KEY = "nova_recently_played";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(RP_KEY);
      // Cap on load too, so pre-existing longer histories respect the limit.
      return raw ? (JSON.parse(raw) as Song[]).slice(0, 20) : [];
    } catch {
      return [];
    }
  });
  const [catalog, setCatalog] = useState<Song[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [downloadedSongs, setDownloadedSongs] = useState<Song[]>([]);

  const current = index >= 0 ? queue[index] ?? null : null;

  // Refs so the audio "ended" handler always sees fresh values.
  const queueRef = useRef<Song[]>([]);
  const shuffleRef = useRef(false);
  const repeatRef = useRef(false);
  const likedSongsRef = useRef<Song[]>([]);
  useEffect(() => void (queueRef.current = queue), [queue]);
  useEffect(() => void (shuffleRef.current = shuffle), [shuffle]);
  useEffect(() => void (repeatRef.current = repeat), [repeat]);
  useEffect(() => void (likedSongsRef.current = likedSongs), [likedSongs]);

  const advance = useCallback(() => {
    setIndex((i) => {
      const q = queueRef.current;
      if (q.length === 0) return i;
      if (shuffleRef.current) return Math.floor(Math.random() * q.length);
      return i + 1 < q.length ? i + 1 : i;
    });
  }, []);

  // Load liked songs + downloads from localStorage, then hydrate from backend.
  useEffect(() => {
    let cancelled = false;
    try {
      const raw = localStorage.getItem(LIKED_KEY);
      if (raw) setLikedSongs(JSON.parse(raw));
      const dlRaw = localStorage.getItem(DL_KEY);
      if (dlRaw) setDownloadedSongs(JSON.parse(dlRaw));
    } catch {
      /* ignore */
    }

    // ── Initialize queue with recently played + trending ──
    // Use the recentlyPlayed state (already populated from localStorage)
    // via its initialStateCapture so we don't double-read localStorage.
    const rp = queueRef.current.length
      ? queueRef.current.slice(0, 5)
      : recentlyPlayed.slice(0, 5);

    getTrending()
      .then((trendingSongs) => {
        if (cancelled) return;
        const trendingSlice = trendingSongs.slice(0, 5);
        const initialQueue = [...rp, ...trendingSlice];
        if (initialQueue.length > 0) {
          setQueue(initialQueue);
          // Start at the first recently played track if available
          if (rp.length > 0) {
            setIndex(0);
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        // Trending fetch failed — use just recently played
        if (rp.length > 0) {
          setQueue(rp);
          setIndex(0);
        }
      });

    if (tokenStore.get()) {
      listLikes()
        .then((server) => {
          if (cancelled || !server.length) return;
          setLikedSongs((prev) => {
            const byId = new Map(prev.map((s) => [s.yt_id, s]));
            for (const s of server) byId.set(s.yt_id, s);
            const merged = Array.from(byId.values());
            try {
              localStorage.setItem(LIKED_KEY, JSON.stringify(merged));
            } catch {
              /* ignore */
            }
            return merged;
          });
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Create the audio element once, on the client.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = volume;
    audioRef.current = audio;

    // Throttle timeupdate with requestAnimationFrame to reduce re-render
    // frequency on mobile. The audio timeupdate fires ~4 times/second but
    // every setCurrentTime triggers a React render of BottomPlayer.
    let rafId: number | null = null;
    const onTime = () => {
      if (rafId !== null) return; // already queued a frame
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setCurrentTime(audio.currentTime);
      });
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
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
      if (rafId !== null) cancelAnimationFrame(rafId);
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
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    audio.src = current.localUrl ?? getStreamUrl(current.yt_id);
    setCurrentTime(0);
    setDuration(0);
    audio.play().catch(() => setIsPlaying(false));

    setRecentlyPlayed((prev) => {
      const rest = prev.filter((s) => s.yt_id !== current.yt_id);
      // Keep only the 20 most recent tracks.
      const next = [current, ...rest].slice(0, 20);
      try {
        localStorage.setItem(RP_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

    // Increment play count on the backend (fire-and-forget).
    incrementPlayCount(current.yt_id).catch(() => {});

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
    audio.currentTime = time;
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
      const already = queueRef.current.some((s) => s.yt_id === song.yt_id);
      const id = `queue-${song.yt_id}`;
      if (already) {
        toast("Already in queue", { icon: "🎧", id });
        return;
      }
      setQueue((q) => {
        const nextQueue = [...q, song];
        setIndex((i) => (i < 0 ? nextQueue.length - 1 : i));
        return nextQueue;
      });
      toast.success(`Added "${song.title}" to queue`, { id });
    },
    [registerSongs]
  );

  const removeFromQueue = useCallback((ytId: string) => {
    setQueue((q) => {
      const idx = q.findIndex((s) => s.yt_id === ytId);
      if (idx < 0) return q;
      const nextQueue = q.filter((s) => s.yt_id !== ytId);
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

  // FIX: Use ref to avoid stale closure on rapid like/unlike taps.
  const toggleLike = useCallback((song: Song) => {
    const latest = likedSongsRef.current;
    const exists = latest.some((s) => s.yt_id === song.yt_id);
    const nextLiked = exists
      ? latest.filter((s) => s.yt_id !== song.yt_id)
      : [song, ...latest];

    setLikedSongs(nextLiked);
    likedSongsRef.current = nextLiked;
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify(nextLiked));
    } catch {
      /* ignore */
    }

    const id = `like-${song.yt_id}`;
    if (exists) toast(`Removed from Liked`, { icon: "💔", id });
    else toast.success(`Liked "${song.title}"`, { id });

    if (tokenStore.get()) {
      const op = exists
        ? removeLike(song.yt_id)
        : addLike(song).then(() => undefined);
      op.catch(() => {
        setLikedSongs((cur) => {
          const rolledBack = exists
            ? [song, ...cur.filter((s) => s.yt_id !== song.yt_id)]
            : cur.filter((s) => s.yt_id !== song.yt_id);
          likedSongsRef.current = rolledBack;
          try {
            localStorage.setItem(LIKED_KEY, JSON.stringify(rolledBack));
          } catch {
            /* ignore */
          }
          return rolledBack;
        });
        toast.error("Couldn't sync like — try again", { id });
      });
    }
  }, []);

  const isLiked = useCallback(
    (song: Song) => likedSongsRef.current.some((s) => s.yt_id === song.yt_id),
    []
  );

  const toggleShuffle = useCallback(() => {
    const nv = !shuffleRef.current;
    setShuffle(nv);
    toast(nv ? "Shuffle on" : "Shuffle off", { icon: "🔀", id: "shuffle" });
  }, []);

  const toggleRepeat = useCallback(() => {
    const nv = !repeatRef.current;
    setRepeat(nv);
    toast(nv ? "Repeat on" : "Repeat off", { icon: "🔁", id: "repeat" });
  }, []);

  // Downloads tracking — stored in localStorage.
  const addDownload = useCallback((song: Song) => {
    setDownloadedSongs((prev) => {
      if (prev.some((s) => s.yt_id === song.yt_id)) return prev;
      const next = [song, ...prev];
      try {
        localStorage.setItem(DL_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const removeDownload = useCallback((ytId: string) => {
    setDownloadedSongs((prev) => {
      const next = prev.filter((s) => s.yt_id !== ytId);
      try {
        localStorage.setItem(DL_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    toast("Removed from downloads", { icon: "🗑️", id: `dl-${ytId}` });
  }, []);

  const isDownloaded = useCallback(
    (song: Song) => downloadedSongs.some((s) => s.yt_id === song.yt_id),
    [downloadedSongs]
  );

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
        downloadedSongs,
        addDownload,
        removeDownload,
        isDownloaded,
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
