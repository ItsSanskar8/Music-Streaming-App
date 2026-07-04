"use client";

// ------------------------------------------------------------------
//  PlaylistCard — a single glowing card in the Playlist Galaxy.
//  Floating artwork, name, mood, song count + a play button.
// ------------------------------------------------------------------

import { motion } from "framer-motion";
import { Play, Music2 } from "lucide-react";
import type { Playlist } from "@/lib/mockData";
import { usePlayer } from "@/lib/PlayerContext";

export default function PlaylistCard({
  playlist,
  index,
}: {
  playlist: Playlist;
  index: number;
}) {
  const { handleSelectPlaylist, handlePlay } = usePlayer();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      onClick={() => handleSelectPlaylist(playlist)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl glass p-4 transition-all duration-300"
      style={{ boxShadow: `0 10px 40px -20px ${playlist.accent}` }}
    >
      {/* Soft glow that intensifies on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 40px ${playlist.accent}` }}
      />

      {/* Artwork */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl">
        <div
          className={`h-full w-full bg-gradient-to-br ${playlist.cover} transition-transform duration-500 group-hover:scale-110`}
        />
        {/* Decorative floating icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Music2 className="animate-float text-white/70" size={40} />
        </div>

        {/* Play button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          className="absolute bottom-3 right-3 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full neon-fill text-white opacity-0 shadow-glow transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Play ${playlist.name}`}
        >
          <Play size={20} className="fill-white" />
        </button>
      </div>

      {/* Meta */}
      <h3 className="clamp-1 font-semibold text-white">{playlist.name}</h3>
      <div className="mt-1 flex items-center justify-between text-sm text-white/50">
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
          {playlist.mood}
        </span>
        <span>{playlist.songsCount} songs</span>
      </div>
    </motion.div>
  );
}
