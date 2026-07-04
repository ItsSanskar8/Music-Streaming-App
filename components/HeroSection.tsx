"use client";

// ------------------------------------------------------------------
//  HeroSection — the big featured song card at the top of Discover.
//  Artwork, title, artist, mood tags + Play Now / Add to Queue.
// ------------------------------------------------------------------

import { motion } from "framer-motion";
import { Play, Plus } from "lucide-react";
import { featuredSong } from "@/lib/mockData";
import { usePlayer } from "@/lib/PlayerContext";

export default function HeroSection() {
  const { handlePlay, handleAddToQueue } = usePlayer();
  const song = featuredSong;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl glass p-6 sm:p-10"
    >
      {/* Aurora glow behind the card */}
      <div className="aurora-blob absolute -left-10 -top-16 h-60 w-60 bg-neon-purple/40" />
      <div className="aurora-blob absolute -bottom-16 right-0 h-60 w-60 bg-neon-pink/30" />

      <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-end">
        {/* Floating artwork */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-48 w-48 flex-shrink-0 sm:h-56 sm:w-56"
        >
          <div
            className={`h-full w-full rounded-3xl bg-gradient-to-br ${song.cover} shadow-2xl glow-border`}
          />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
        </motion.div>

        {/* Text + actions */}
        <div className="flex-1 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-white/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
            Featured Today
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {song.title}
          </h1>
          <p className="mt-2 text-lg text-white/60">{song.artist}</p>

          {/* Mood tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {song.moods.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <button
              onClick={() => handlePlay(song)}
              className="flex items-center gap-2 rounded-full neon-fill px-6 py-3 font-semibold text-white shadow-glow transition hover:scale-105"
            >
              <Play size={18} className="fill-white" />
              Play Now
            </button>
            <button
              onClick={() => handleAddToQueue(song)}
              className="flex items-center gap-2 rounded-full glass px-6 py-3 font-semibold text-white transition hover:glass-strong"
            >
              <Plus size={18} />
              Add to Queue
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
