"use client";

// Now Playing — full-page immersive player view.
// Large cover art, song title, artist, progress bar, animated waveform,
// queue list, similar tracks, and full playback controls.

import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  ListMusic,
  Music2,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import AnimatedWaveform from "@/components/ui/AnimatedWaveform";
import LikeButton from "@/components/ui/LikeButton";
import TiltCard from "@/components/ui/TiltCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUI } from "@/contexts/UIContext";
import { formatTime } from "@/lib/format";
import MoodGlow from "@/components/ui/MoodGlow";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NowPlayingPage() {
  const {
    current,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    seek,
    queue,
    playFromQueue,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    isLiked,
    toggleLike,
  } = usePlayer();
  const { toggleQueue } = useUI();

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const liked = current ? isLiked(current) : false;

  if (!current) {
    return (
      <AuthGuard>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.04]">
            <Music2 size={36} className="text-white/30" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Nothing Playing</h1>
          <p className="mt-2 text-sm text-white/50">
            Pick a song from Trending, Search, or your library to start listening.
          </p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <MoodGlow mood={current?.mood} />
      <div className="px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left: Cover + Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Cover art */}
            <TiltCard max={10} scale={1.02} className="mx-auto mb-8 w-full max-w-md">
              <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
                {current.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={current.thumbnail} alt={current.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.04]">
                    <Music2 size={64} className="text-white/20" />
                  </div>
                )}
              </div>
            </TiltCard>

            {/* Song info */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {current.title}
              </h1>
              <p className="mt-1 text-base text-white/50">{current.artist}</p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <LikeButton song={current} size={20} />
                <AnimatedWaveform bars={8} heightClass="h-6" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs tabular-nums text-white/40">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleShuffle}
                className={`transition-colors ${shuffle ? "text-nova-cyan" : "text-white/45 hover:text-white"}`}
                aria-label="Shuffle"
              >
                <Shuffle size={20} />
              </button>
              <button
                onClick={prev}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Previous"
              >
                <SkipBack size={24} className="fill-current" />
              </button>
              <button
                onClick={togglePlay}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black shadow-glow-cyan transition-transform hover:scale-105"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={28} className="fill-black" />
                ) : (
                  <Play size={28} className="translate-x-[1px] fill-black" />
                )}
              </button>
              <button
                onClick={next}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Next"
              >
                <SkipForward size={24} className="fill-current" />
              </button>
              <button
                onClick={toggleRepeat}
                className={`transition-colors ${repeat ? "text-nova-cyan" : "text-white/45 hover:text-white"}`}
                aria-label="Repeat"
              >
                <Repeat size={20} />
              </button>
            </div>
          </motion.div>

          {/* Right: Queue */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          >
            <div className="glass-strong rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">
                  Up Next
                </h2>
                <button
                  onClick={toggleQueue}
                  className="flex items-center gap-1.5 text-xs font-medium text-nova-cyan transition-colors hover:text-white"
                >
                  <ListMusic size={14} />
                  Open Queue
                </button>
              </div>

              {queue.length === 0 ? (
                <p className="py-8 text-center text-sm text-white/30">
                  Queue is empty. Add songs to get started.
                </p>
              ) : (
                <div className="max-h-[50vh] space-y-1 overflow-y-auto no-scrollbar">
                  {queue.map((s, i) => {
                    const active = current.yt_id === s.yt_id;
                    return (
                      <button
                        key={`${s.yt_id}-${i}`}
                        onClick={() => playFromQueue(s.yt_id)}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                          active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                          {s.thumbnail && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.thumbnail} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm font-medium ${active ? "text-nova-cyan" : "text-white"}`}>
                            {s.title}
                          </p>
                          <p className="truncate text-xs text-white/40">{s.artist}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
