"use client";

import { motion } from "framer-motion";
import { ListPlus } from "lucide-react";
import type { Song } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";

// Adds a song to the global queue (toast handled inside the player context).

interface Props {
  song: Song;
  size?: number;
  className?: string;
}

export default function QueueButton({ song, size = 18, className = "" }: Props) {
  const { addToQueue } = usePlayer();
  return (
    <span className="ml-0.5 flex h-7 w-7 items-center justify-center">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={(e) => {
          e.stopPropagation();
          addToQueue(song);
        }}
        aria-label="Add to queue"
        className={`text-white/45 transition-colors hover:text-white ${className}`}
      >
        <ListPlus size={size} />
      </motion.button>
    </span>
  );
}
