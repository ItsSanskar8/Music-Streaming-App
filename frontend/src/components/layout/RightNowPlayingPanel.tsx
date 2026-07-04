"use client";

// Collapsible right-hand "Now Playing" drawer. 3D-tilting album art,
// CSS-keyframe equalizer bars (no canvas), song details, a glass Lyrics
// placeholder, and a mini queue preview.

import { motion, AnimatePresence } from "framer-motion";
import { X, Music2 } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUI } from "@/contexts/UIContext";
import TiltCard from "@/components/ui/TiltCard";

function Equalizer({ playing }: { playing: boolean }) {
  const bars = [0.5, 0.85, 0.35, 1, 0.6, 0.9, 0.45, 0.75];
  return (
    <div className={`eq ${playing ? "" : "paused"}`}>
      {bars.map((h, i) => (
        <span
          key={i}
          style={{
            height: `${h * 100}%`,
            animationDelay: `${i * 0.08}s`,
            animationDuration: `${0.7 + (i % 4) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function RightNowPlayingPanel() {
  const { current, isPlaying, queue } = usePlayer();
  const { nowPlayingOpen, setNowPlaying } = useUI();

  return (
    <AnimatePresence>
      {nowPlayingOpen && (
        <motion.aside
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed right-0 top-0 z-30 h-screen w-[340px] border-l border-white/[0.08] bg-brand-navy/60 p-5 pb-28 backdrop-blur-2xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Now Playing
            </span>
            <button
              onClick={() => setNowPlaying(false)}
              className="text-white/40 transition-colors hover:text-white"
              aria-label="Close panel"
            >
              <X size={18} />
            </button>
          </div>

          {current ? (
            <div className="space-y-5 overflow-y-auto no-scrollbar h-[calc(100%-2rem)]">
              {/* 3D tilting album art */}
              <TiltCard max={12} className="mx-auto w-full">
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.thumbnail || ""}
                    alt={current.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </TiltCard>

              <div className="text-center">
                <h3 className="truncate text-lg font-semibold text-white">
                  {current.title}
                </h3>
                <p className="truncate text-sm text-white/45">
                  {current.artist}
                </p>
                <div className="mt-3 flex justify-center">
                  <Equalizer playing={isPlaying} />
                </div>
              </div>

              {/* Lyrics placeholder */}
              <div className="glass rounded-2xl p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Lyrics
                </p>
                <p className="text-sm leading-relaxed text-white/35">
                  Lyrics will appear here once connected. For now, close your
                  eyes and let the sound carry you through the nebula…
                </p>
              </div>

              {/* Mini queue preview */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                  Up Next
                </p>
                <div className="space-y-2">
                  {queue.slice(0, 4).map((s) => (
                    <div key={s.yt_id} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.thumbnail || ""}
                        alt=""
                        className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white">
                          {s.title}
                        </p>
                        <p className="truncate text-[11px] text-white/35">
                          {s.artist}
                        </p>
                      </div>
                    </div>
                  ))}
                  {queue.length === 0 && (
                    <p className="text-xs text-white/30">Queue is empty.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center text-white/30">
              <Music2 size={30} className="mb-3" />
              <p className="text-sm">Play a track to see it here.</p>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
