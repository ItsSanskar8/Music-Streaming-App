"use client";

// ============================================================================
//  Nova Bottom Player v5 — Refined controls, cleaner visual hierarchy,
//  muted indigo accent, smoother micro-interactions.
// ============================================================================

import { useState, useEffect } from "react";
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
import { usePlayer } from "@/contexts/PlayerContext";
import { useUI } from "@/contexts/UIContext";
import { triggerDownload } from "@/services/api";
import AddToPlaylistButton from "@/components/ui/AddToPlaylistButton";

const TAP = { scale: 0.92 };

/** Detect touch-capable device */
function useIsTouchDevice() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return touch;
}

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
  const isTouch = useIsTouchDevice();
  const [downloading, setDownloading] = useState(false);

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
      {...(isTouch
        ? {}
        : {
            drag: "y" as const,
            dragConstraints: { top: 0, bottom: 0 },
            dragElastic: 0.08,
            onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
              if (
                info.offset.y < -60 ||
                (info.offset.y < -20 && info.velocity.y < -500)
              ) {
                current && router.push("/now-playing");
              }
            },
          })}
      className="fixed inset-x-0 bottom-14 z-40 h-[72px] border-t border-white/[0.06] bg-[#0F0F12]/80 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] backdrop-blur-3xl md:bottom-0 md:h-[76px]"
      style={isTouch ? { touchAction: "pan-y" } : undefined}
    >
      {/* Drag handle — mobile only */}
      <div
        className="absolute inset-x-0 top-0 flex justify-center md:hidden"
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
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="mt-1.5 h-1 w-8 rounded-full bg-white/15"
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.thumbnail || ""}
                  alt={current.title}
                  className={`h-12 w-12 rounded-xl object-cover shadow-md ring-1 ring-white/[0.06] transition-all duration-300 ${
                    isPlaying ? "ring-nova-blue/20" : ""
                  }`}
                />
                {isPlaying && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute -right-0.5 -top-0.5"
                  >
                    <Disc3 size={12} className="text-nova-blue" />
                  </motion.div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-white/90">
                  {current.title}
                </p>
                <p className="truncate text-[11px] text-white/40">
                  {current.artist}
                </p>
              </div>
              <motion.button
                whileTap={TAP}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(current);
                }}
                className="ml-1 hidden text-white/35 transition-colors hover:text-nova-rose sm:block"
                aria-label="Like"
              >
                <Heart
                  size={16}
                  className={liked ? "fill-nova-rose text-nova-rose" : ""}
                />
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] flex items-center justify-center">
                <Disc3 size={18} className="text-white/15" />
              </div>
              <p className="text-[13px] text-white/30">Nothing playing</p>
            </div>
          )}
        </div>

        {/* ════ Controls + Seek ════ */}
        <div className="flex flex-[1.5] flex-col items-center gap-1">
          <div className="flex items-center gap-4 sm:gap-5">
            <motion.button
              whileTap={TAP}
              onClick={toggleShuffle}
              className={`hidden transition-colors sm:block ${
                shuffle ? "text-nova-blue" : "text-white/35 hover:text-white/70"
              }`}
              aria-label="Shuffle"
            >
              <Shuffle size={15} />
            </motion.button>
            <motion.button
              whileTap={TAP}
              onClick={prev}
              disabled={!current}
              className="text-white/60 transition-colors hover:text-white disabled:opacity-30"
              aria-label="Previous"
            >
              <SkipBack size={18} className="fill-current" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={togglePlay}
              disabled={!current}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0F0F12] shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-30"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={18} className="fill-[#0F0F12] relative z-10" />
              ) : (
                <Play size={18} className="fill-[#0F0F12] relative z-10 translate-x-[1px]" />
              )}
            </motion.button>
            <motion.button
              whileTap={TAP}
              onClick={next}
              disabled={!current}
              className="text-white/60 transition-colors hover:text-white disabled:opacity-30"
              aria-label="Next"
            >
              <SkipForward size={18} className="fill-current" />
            </motion.button>
            <motion.button
              whileTap={TAP}
              onClick={toggleRepeat}
              className={`hidden transition-colors sm:block ${
                repeat ? "text-nova-blue" : "text-white/35 hover:text-white/70"
              }`}
              aria-label="Repeat"
            >
              <Repeat size={15} />
            </motion.button>
          </div>

          {/* Seek bar */}
          <div className="flex w-full max-w-2xl items-center gap-2">
            <span className="text-right text-[10px] tabular-nums text-white/35 w-10 overflow-hidden">
              {fmt(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="nova-range flex-1"
              style={{
                background: `linear-gradient(to right, var(--blue), var(--cyan) ${progress}%, rgba(245,240,235,0.08) ${progress}%)`,
              }}
              aria-label="Seek"
            />
            <span className="text-[10px] tabular-nums text-white/35 w-10 overflow-hidden">
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* ════ Right Controls ════ */}
        <div className="hidden flex-1 items-center justify-end gap-3 sm:flex">
          <motion.button
            whileTap={TAP}
            onClick={handleDownload}
            disabled={!current || current?.isLocal || downloading}
            className="text-white/35 transition-colors hover:text-white/70 disabled:opacity-30"
            aria-label="Download MP3"
            title={current?.isLocal ? "Local file" : "Download MP3"}
          >
            {downloading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
          </motion.button>
          {current && <AddToPlaylistButton song={current} size={16} dropUp />}
          <motion.button
            whileTap={TAP}
            onClick={toggleQueue}
            className={`transition-colors hover:text-white/70 ${
              queueOpen ? "text-nova-blue" : "text-white/35"
            }`}
            aria-label="Toggle queue"
          >
            <ListMusic size={16} />
          </motion.button>
          <motion.button
            whileTap={TAP}
            onClick={toggleNowPlaying}
            className={`hidden transition-colors hover:text-white/70 lg:block ${
              nowPlayingOpen ? "text-nova-blue" : "text-white/35"
            }`}
            aria-label="Toggle now playing panel"
          >
            <PanelRightOpen size={16} />
          </motion.button>
          <div className="hidden w-24 items-center gap-2 md:flex">
            <Volume2 size={15} className="text-white/35" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="nova-range flex-1"
              style={{
                background: `linear-gradient(to right, var(--cyan) ${
                  volume * 100
                }%, rgba(245,240,235,0.08) ${volume * 100}%)`,
              }}
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
