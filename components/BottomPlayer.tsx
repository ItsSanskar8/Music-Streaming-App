"use client";

// ------------------------------------------------------------------
//  BottomPlayer — sticky player bar pinned to the bottom of the app.
//  Cover, title, artist, transport controls, progress bar, volume,
//  and a queue icon. All wired to the placeholder handlers.
// ------------------------------------------------------------------

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Volume2,
  ListMusic,
} from "lucide-react";
import { usePlayer } from "@/lib/PlayerContext";

export default function BottomPlayer() {
  const {
    currentSong,
    isPlaying,
    likedIds,
    handlePlay,
    handlePause,
    handleNext,
    handlePrevious,
    handleLike,
  } = usePlayer();

  // Local UI state only (not real playback). Replace with real values later.
  const [progress, setProgress] = useState(35); // 0–100
  const [volume, setVolume] = useState(70); // 0–100
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const isLiked = likedIds.includes(currentSong.id);

  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 24, stiffness: 200 }}
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 rounded-2xl glass-strong px-3 py-3 shadow-2xl sm:px-5">
        {/* ---------- Left: track info ---------- */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className={`h-12 w-12 flex-shrink-0 rounded-xl bg-gradient-to-br ${currentSong.cover} shadow-lg`}
          />
          <div className="min-w-0">
            <p className="clamp-1 text-sm font-semibold text-white">
              {currentSong.title}
            </p>
            <p className="clamp-1 text-xs text-white/50">{currentSong.artist}</p>
          </div>
          <button
            onClick={() => handleLike(currentSong)}
            className="ml-1 hidden rounded-full p-2 text-white/60 transition hover:text-neon-pink sm:block"
            aria-label="Like"
          >
            <Heart
              size={18}
              className={isLiked ? "fill-neon-pink text-neon-pink" : ""}
            />
          </button>
        </div>

        {/* ---------- Center: controls + progress ---------- */}
        <div className="flex flex-[1.5] flex-col items-center gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setShuffle((s) => !s)}
              className={`hidden transition sm:block ${
                shuffle ? "text-neon-purple" : "text-white/50 hover:text-white"
              }`}
              aria-label="Shuffle"
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={handlePrevious}
              className="text-white/70 transition hover:text-white"
              aria-label="Previous"
            >
              <SkipBack size={20} className="fill-current" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={() => (isPlaying ? handlePause() : handlePlay())}
              className="flex h-11 w-11 items-center justify-center rounded-full neon-fill text-white shadow-glow transition hover:scale-105"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={20} className="fill-white" />
              ) : (
                <Play size={20} className="fill-white" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-white/70 transition hover:text-white"
              aria-label="Next"
            >
              <SkipForward size={20} className="fill-current" />
            </button>

            <button
              onClick={() => setRepeat((r) => !r)}
              className={`hidden transition sm:block ${
                repeat ? "text-neon-purple" : "text-white/50 hover:text-white"
              }`}
              aria-label="Repeat"
            >
              <Repeat size={18} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex w-full items-center gap-2">
            <span className="w-9 text-right text-[11px] text-white/40">1:12</span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="sv-range flex-1"
              // Fill the played portion with a neon gradient.
              style={{
                background: `linear-gradient(to right, #a855f7 ${progress}%, rgba(255,255,255,0.12) ${progress}%)`,
              }}
              aria-label="Seek"
            />
            <span className="w-9 text-[11px] text-white/40">
              {currentSong.duration}
            </span>
          </div>
        </div>

        {/* ---------- Right: volume + queue ---------- */}
        <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
          <button
            className="text-white/60 transition hover:text-white"
            aria-label="Queue"
          >
            <ListMusic size={19} />
          </button>
          <div className="flex w-32 items-center gap-2">
            <Volume2 size={18} className="text-white/60" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="sv-range flex-1"
              style={{
                background: `linear-gradient(to right, #38bdf8 ${volume}%, rgba(255,255,255,0.12) ${volume}%)`,
              }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
