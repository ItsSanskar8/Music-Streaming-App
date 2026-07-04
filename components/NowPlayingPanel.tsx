"use client";

// ------------------------------------------------------------------
//  NowPlayingPanel — right-hand column (desktop only).
//  Big artwork, CSS-only waveform, queue preview + lyrics preview.
// ------------------------------------------------------------------

import { motion } from "framer-motion";
import { ListMusic, Mic2 } from "lucide-react";
import { usePlayer } from "@/lib/PlayerContext";
import { lyricsPreview } from "@/lib/mockData";

// A small CSS-only "waveform" made of animated bars.
function Waveform({ playing }: { playing: boolean }) {
  // Different heights + delays make it look organic.
  const bars = [0.4, 0.7, 0.3, 0.9, 0.5, 1, 0.6, 0.35, 0.8, 0.5, 0.9, 0.45];
  return (
    <div className={`waveform ${playing ? "" : "is-paused"}`}>
      {bars.map((h, i) => (
        <span
          key={i}
          className="bar"
          style={{
            height: `${h * 100}%`,
            animationDelay: `${i * 0.09}s`,
            animationDuration: `${0.8 + (i % 4) * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function NowPlayingPanel() {
  const { currentSong, isPlaying, queue } = usePlayer();

  return (
    <aside className="hidden w-80 flex-shrink-0 xl:block">
      <div className="sticky top-24 space-y-4">
        {/* Artwork + title + waveform */}
        <div className="relative overflow-hidden rounded-3xl glass p-5">
          <div className="aurora-blob absolute -right-8 -top-8 h-32 w-32 bg-neon-blue/40" />

          <motion.div
            key={currentSong.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative mx-auto aspect-square w-full rounded-2xl bg-gradient-to-br ${currentSong.cover} shadow-2xl glow-border`}
          />

          <div className="relative mt-4 text-center">
            <h3 className="clamp-1 text-lg font-bold text-white">
              {currentSong.title}
            </h3>
            <p className="text-sm text-white/50">{currentSong.artist}</p>
          </div>

          {/* CSS-only waveform */}
          <div className="relative mt-5 flex justify-center">
            <Waveform playing={isPlaying} />
          </div>
        </div>

        {/* Queue preview */}
        <div className="rounded-3xl glass p-5">
          <div className="mb-3 flex items-center gap-2 text-white/70">
            <ListMusic size={18} />
            <h4 className="text-sm font-semibold">Up Next</h4>
          </div>
          <div className="space-y-2">
            {queue.slice(0, 4).map((song) => (
              <div key={song.id} className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 flex-shrink-0 rounded-lg bg-gradient-to-br ${song.cover}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="clamp-1 text-sm text-white">{song.title}</p>
                  <p className="clamp-1 text-xs text-white/40">{song.artist}</p>
                </div>
                <span className="text-xs text-white/30">{song.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lyrics preview */}
        <div className="rounded-3xl glass p-5">
          <div className="mb-3 flex items-center gap-2 text-white/70">
            <Mic2 size={18} />
            <h4 className="text-sm font-semibold">Lyrics</h4>
          </div>
          <div className="space-y-1.5">
            {lyricsPreview.map((line, i) => (
              <p
                key={i}
                className={`text-sm transition ${
                  i === 0 ? "font-medium neon-text" : "text-white/45"
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
