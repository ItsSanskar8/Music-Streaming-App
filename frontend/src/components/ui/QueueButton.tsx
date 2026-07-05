"use client";

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
    <button
      onClick={(e) => {
        e.stopPropagation();
        addToQueue(song);
      }}
      aria-label="Add to queue"
      className={`text-white/45 transition-colors hover:text-white ${className}`}
    >
      <ListPlus size={size} />
    </button>
  );
}
