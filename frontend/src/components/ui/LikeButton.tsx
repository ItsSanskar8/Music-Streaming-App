"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Song } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";

// Heart toggle wired to the global player's like state (localStorage-backed,
// optimistic). Stops propagation so it works inside clickable cards/rows.

interface Props {
  song: Song;
  size?: number;
  className?: string;
}

export default function LikeButton({ song, size = 18, className = "" }: Props) {
  const { toggleLike, likedSongs } = usePlayer();
  const liked = likedSongs.some((s) => s.yt_id === song.yt_id);

  return (
    <span className="ml-0.5 flex h-7 w-7 items-center justify-center">
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(song);
        }}
        aria-label={liked ? "Remove from Liked" : "Add to Liked"}
        aria-pressed={liked}
        className={`transition-colors ${
          liked ? "text-nova-cyan" : "text-white/45 hover:text-white"
        } ${className}`}
      >
        <Heart size={size} className={liked ? "fill-nova-cyan" : ""} />
      </motion.button>
    </span>
  );
}
