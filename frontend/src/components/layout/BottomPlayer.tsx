"use client";

// ============================================================================
//  Nova Bottom Player v4 — Enhanced controls with animated glow ring,
//  expanded seek bar on hover, vinyl disc effect on album art, and
//  smooth micro-interactions throughout.
// ============================================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Download,
  ListMusic,
  PanelRightOpen,
  Loader2,
  Disc3,
} from "lucide-react";

const TAP = { scale: 0.9 };
const EASE = [0.22, 1, 0.36, 1] as const;
import { usePlayer } from "@/contexts/PlayerContext";
import { useUI } from "@/contexts/UIContext";
import { triggerDownload } from "@/services/api";
import AddToPlaylistButton from "@/components/ui/AddToPlaylistButton";

function fmt(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function BottomPlayer() {
  const {
    current,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    isLiked,
    toggleLike,
    shuffle,
    repeat,
    toggleShuffle,
    toggleRepeat,
    addDownload,
  } = usePlayer();
  const router = useRouter();
  const { toggleQueue, toggleNowPlaying, queueOpen, nowPlayingOpen } = useUI();
  const [downloading, setDownloading] = useState(false);
  const [seekHover, setSeekHover] = useState(false);

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const liked = current ? isLiked(current) : false;

  const handleDownload = () => {
    if (!current || current.isLocal) return;
    setDownloading(true);
    addDownload(current);
    triggerDownload(current);
    setTimeout(() => setDownloading(false), 2500);
  };

  return (
    <motion.footer
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.08}
      onDragEnd={(_, info) => {
        if (info.offset.y < -60 || (info.offset.y < -20 && info.velocity.y < -500)) {
          current && router.push("/now-playing");
        }
      }}
      className="fixed inset-x-0 bottom-16 z-40 h-24 border-t border-white/[0.08] bg-nova-bg2/70 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] backdrop-blur-3xl md:bottom-0"
    >
      {/* Drag handle — visible on mobile as swipe-up affordance */}
      <div className="absolute inset-x-0 top-0 flex justify-center md:hidden">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="mt-1.5 h-1 w-10 rounded-full bg-white/20"
        />
      </div>

      <div className="mx-auto flex h-full max-w-[1700px] items-center gap-2 px-3 sm:gap-4 sm:px-6">
        {/* ════ Track Info ════ */}
        <div
          className="flex min-w-0 flex-1 items-center gap-3"
          onClick={() => current && router.push("/now-playing")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && current) {
              e.preventDefault();
              router.push("/now-playing");
            }
          }}
        >
          {current ? (
            <>
              <div className="relative flex-shrink-0">
                {/* Animated glow ring when playing */}
                {isPlaying && (
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.15, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute -inset-2 rounded-[18px] bg-gradient-to-br from-nova-cyan/30 to-nova-blue/20 blur-md"
                  />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.thumbnail || ""}
                  alt={current.title}
                  className={`h-14 w-14 rounded-xl object-cover shadow-lg ring-1 ring-white/10 transition-all duration-500 ${
                    isPlaying ? "ring-nova-cyan/30" : ""
                  }`}
                />
                {/* Spinning disc indicator */}
                {isPlaying && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute -right-1 -top-1"
                  >
                    <Disc3 size={14} className="text-nova-cyan" />
                  </motion.div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {current.title}
                </p>
                <p className="truncate text-xs font-medium text-white/45">
                  {current.artist}
                </p>
              </div>
              <motion.button
                whileTap={TAP}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(current);
                }}
                className="ml-1 hidden text-white/45 transition-colors hover:text-nova-cyan sm:block"
                aria-label="Like"
              >
                <Heart
                  size={18}
                  className={liked ? "fill-nova-cyan text-nova-cyan" : ""}
                />
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center">
                <Disc3 size={20} className="text-white/20" />
              </div>
              <p className="text-sm text-white/40">Nothing playing</p>
            </div>
          )}
        </div>

        {/* ════ Controls + Seek ════ */}
        <div className="flex flex-[1.5] flex-col items-center gap-1.5">
          <div className="flex items-center gap-4 sm:gap-5">
            <motion.button
              whileTap={TAP}
              onClick={toggleShuffle}
              className={`hidden transition-colors sm:block ${
                shuffle ? "text-nova-cyan" : "text-white/45 hover:text-white"
              }`}
              aria-label="Shuffle"
            >
              <Shuffle size={17} />
            </motion.button>
            <motion.button
              whileTap={TAP}
              onClick={prev}
              disabled={!current}
              className="text-white/70 transition-colors hover:text-white disabled:opacity-40"
              aria-label="Previous"
            >
              <SkipBack size={20} className="fill-current" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={togglePlay}
              disabled={!current}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black shadow-glow-cyan transition-all hover:scale-105 hover:shadow-glow-cyan disabled:opacity-40"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {/* Breathing glow ring around play button */}
              {isPlaying && (
                <motion.span
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-nova-cyan/20 blur-sm"
                />
              )}
              {isPlaying ? (
                <Pause size={19} className="fill-black relative z-10" />
              ) : (
                <Play size={19} className="fill-black relative z-10" />
              )}
            </motion.button>
            <motion.button
              whileTap={TAP}
              onClick={next}
              disabled={!current}
              className="text-white/70 transition-colors hover:text-white disabled:opacity-40"
              aria-label="Next"
            >
              <SkipForward size={20} className="fill-current" />
            </motion.button>
            <motion.button
              whileTap={TAP}
              onClick={toggleRepeat}
              className={`hidden transition-colors sm:block ${
                repeat ? "text-nova-cyan" : "text-white/45 hover:text-white"
              }`}
              aria-label="Repeat"
            >
              <Repeat size={17} />
            </motion.button>
          </div>

          <div
            className="flex w-full max-w-2xl items-center gap-2"
            onMouseEnter={() => setSeekHover(true)}
            onMouseLeave={() => setSeekHover(false)}
          >
            <motion.span
              animate={{ width: seekHover ? 48 : 40 }}
              className="text-right text-[11px] tabular-nums text-white/40 overflow-hidden"
            >
              {fmt(currentTime)}
            </motion.span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="nova-range flex-1"
              style={{
                background: `linear-gradient(to right, #245BFF, #00F5D4 ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
              }}
              aria-label="Seek"
            />
            <motion.span
              animate={{ width: seekHover ? 48 : 40 }}
              className="text-[11px] tabular-nums text-white/40 overflow-hidden"
            >
              {fmt(duration)}
            </motion.span>
          </div>
        </div>

        {/* ════ Right Controls ════ (hidden on mobile — crowds the transport;
            these actions live on the now-playing view / each song row) */}
        <div className="hidden flex-1 items-center justify-end gap-3 sm:flex">
          <motion.button
            whileTap={TAP}
            onClick={handleDownload}
            disabled={!current || current?.isLocal || downloading}
            className="text-white/45 transition-colors hover:text-nova-blue disabled:opacity-40"
            aria-label="Download MP3"
            title={current?.isLocal ? "Local file" : "Download MP3"}
          >
            {downloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
          </motion.button>
          {/* Add to playlist — only active while a track is loaded. */}
          {current && <AddToPlaylistButton song={current} size={18} dropUp />}
          <motion.button
            whileTap={TAP}
            onClick={toggleQueue}
            className={`transition-colors hover:text-white ${
              queueOpen ? "text-nova-cyan" : "text-white/45"
            }`}
            aria-label="Toggle queue"
          >
            <ListMusic size={18} />
          </motion.button>
          <motion.button
            whileTap={TAP}
            onClick={toggleNowPlaying}
            className={`hidden transition-colors hover:text-white lg:block ${
              nowPlayingOpen ? "text-nova-cyan" : "text-white/45"
            }`}
            aria-label="Toggle now playing panel"
          >
            <PanelRightOpen size={18} />
          </motion.button>
          <div className="hidden w-28 items-center gap-2 md:flex">
            <Volume2 size={17} className="text-white/45" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="nova-range flex-1"
              style={{
                background: `linear-gradient(to right, #00F5D4 ${
                  volume * 100
                }%, rgba(255,255,255,0.1) ${volume * 100}%)`,
              }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
