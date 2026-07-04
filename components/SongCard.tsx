"use client";

// ------------------------------------------------------------------
//  SongCard — one row in the Trending Songs list.
//  Shows cover, title, artist, duration + like / play / queue buttons.
// ------------------------------------------------------------------

import { motion } from "framer-motion";
import { Heart, Play, Plus } from "lucide-react";
import type { Song } from "@/lib/mockData";
import { usePlayer } from "@/lib/PlayerContext";

export default function SongCard({ song, index }: { song: Song; index: number }) {
  const {
    handlePlay,
    handleLike,
    handleAddToQueue,
    handleSelectSong,
    likedIds,
    currentSong,
  } = usePlayer();

  const isLiked = likedIds.includes(song.id);
  const isActive = currentSong.id === song.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={() => handleSelectSong(song)}
      className={`group flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-all duration-300 hover:bg-white/5 cursor-pointer ${
        isActive ? "bg-white/5 glow-border" : ""
      }`}
    >
      {/* Index / cover */}
      <div className="relative h-12 w-12 flex-shrink-0">
        <div
          className={`h-full w-full rounded-xl bg-gradient-to-br ${song.cover} shadow-lg`}
        />
        {/* Play overlay on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay(song);
          }}
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
          aria-label={`Play ${song.title}`}
        >
          <Play size={18} className="fill-white text-white" />
        </button>
      </div>

      {/* Title + artist */}
      <div className="min-w-0 flex-1">
        <p
          className={`clamp-1 font-medium ${
            isActive ? "neon-text" : "text-white"
          }`}
        >
          {song.title}
        </p>
        <p className="clamp-1 text-sm text-white/50">{song.artist}</p>
      </div>

      {/* Mood chips (hidden on small screens) */}
      <div className="hidden gap-1.5 lg:flex">
        {song.moods.slice(0, 2).map((m) => (
          <span
            key={m}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/60"
          >
            {m}
          </span>
        ))}
      </div>

      {/* Duration */}
      <span className="hidden w-12 text-right text-sm text-white/40 sm:block">
        {song.duration}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike(song);
          }}
          className="rounded-full p-2 text-white/60 transition hover:text-neon-pink"
          aria-label="Like"
        >
          <Heart
            size={18}
            className={isLiked ? "fill-neon-pink text-neon-pink" : ""}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToQueue(song);
          }}
          className="rounded-full p-2 text-white/60 transition hover:text-neon-blue"
          aria-label="Add to queue"
        >
          <Plus size={18} />
        </button>
      </div>
    </motion.div>
  );
}
