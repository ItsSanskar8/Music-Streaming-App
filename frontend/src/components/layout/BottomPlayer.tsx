"use client";

// Persistent glass bottom player. Cyan-gradient seek bar (drives seek()),
// shuffle/repeat toggles, volume, like, real MP3 download, and toggles for
// the Queue drawer + Now-Playing panel. (Fully restyled for v2.)

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
  Download,
  ListMusic,
  PanelRightOpen,
  Loader2,
} from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUI } from "@/contexts/UIContext";
import { triggerDownload } from "@/services/api";

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
  } = usePlayer();
  const { toggleQueue, toggleNowPlaying, queueOpen, nowPlayingOpen } = useUI();
  const [downloading, setDownloading] = useState(false);

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const liked = current ? isLiked(current) : false;

  const handleDownload = () => {
    if (!current || current.isLocal) return;
    setDownloading(true);
    triggerDownload(current);
    setTimeout(() => setDownloading(false), 2500);
  };

  return (
    <motion.footer
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-x-0 bottom-0 z-40 h-24 border-t border-white/[0.08] bg-brand-ink/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-full max-w-[1700px] items-center gap-4 px-4 sm:px-6">
        {/* Track info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {current ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.thumbnail || ""}
                alt={current.title}
                className="h-14 w-14 flex-shrink-0 rounded-xl object-cover shadow-lg ring-1 ring-white/10"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {current.title}
                </p>
                <p className="truncate text-xs font-medium text-white/45">
                  {current.artist}
                </p>
              </div>
              <button
                onClick={() => toggleLike(current)}
                className="ml-1 hidden text-white/45 transition-colors hover:text-brand-rose sm:block"
                aria-label="Like"
              >
                <Heart
                  size={18}
                  className={liked ? "fill-brand-rose text-brand-rose" : ""}
                />
              </button>
            </>
          ) : (
            <p className="text-sm text-white/40">Nothing playing</p>
          )}
        </div>

        {/* Controls + seek */}
        <div className="flex flex-[1.5] flex-col items-center gap-1.5">
          <div className="flex items-center gap-4 sm:gap-5">
            <button
              onClick={toggleShuffle}
              className={`hidden transition-colors sm:block ${
                shuffle ? "text-brand-cyan" : "text-white/45 hover:text-white"
              }`}
              aria-label="Shuffle"
            >
              <Shuffle size={17} />
            </button>
            <button
              onClick={prev}
              disabled={!current}
              className="text-white/70 transition-colors hover:text-white disabled:opacity-40"
              aria-label="Previous"
            >
              <SkipBack size={20} className="fill-current" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!current}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-105 disabled:opacity-40"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={19} className="fill-black" />
              ) : (
                <Play size={19} className="fill-black" />
              )}
            </button>
            <button
              onClick={next}
              disabled={!current}
              className="text-white/70 transition-colors hover:text-white disabled:opacity-40"
              aria-label="Next"
            >
              <SkipForward size={20} className="fill-current" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`hidden transition-colors sm:block ${
                repeat ? "text-brand-cyan" : "text-white/45 hover:text-white"
              }`}
              aria-label="Repeat"
            >
              <Repeat size={17} />
            </button>
          </div>

          <div className="flex w-full max-w-2xl items-center gap-2">
            <span className="w-10 text-right text-[11px] tabular-nums text-white/40">
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
                background: `linear-gradient(to right, #22D3EE ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
              }}
              aria-label="Seek"
            />
            <span className="w-10 text-[11px] tabular-nums text-white/40">
              {fmt(duration)}
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <button
            onClick={handleDownload}
            disabled={!current || current?.isLocal || downloading}
            className="text-white/45 transition-colors hover:text-brand-lavender disabled:opacity-40"
            aria-label="Download MP3"
            title={current?.isLocal ? "Local file" : "Download MP3"}
          >
            {downloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
          </button>
          <button
            onClick={toggleQueue}
            className={`transition-colors hover:text-white ${
              queueOpen ? "text-brand-cyan" : "text-white/45"
            }`}
            aria-label="Toggle queue"
          >
            <ListMusic size={18} />
          </button>
          <button
            onClick={toggleNowPlaying}
            className={`hidden transition-colors hover:text-white lg:block ${
              nowPlayingOpen ? "text-brand-cyan" : "text-white/45"
            }`}
            aria-label="Toggle now playing panel"
          >
            <PanelRightOpen size={18} />
          </button>
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
                background: `linear-gradient(to right, #C4B5FD ${
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
