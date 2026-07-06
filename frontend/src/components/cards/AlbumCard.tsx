"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PlayButton from "@/components/ui/PlayButton";

// Presentational album card (Nova has no album entity in the backend — albums
// are derived/curated on the client). Optional onPlay handler.

interface Props {
  title: string;
  artist: string;
  cover?: string | null;
  index?: number;
  onPlay?: () => void;
  onClick?: () => void;
}

export default function AlbumCard({ title, artist, cover, index = 0, onPlay, onClick }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group w-full cursor-pointer"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/[0.07] bg-white/5 shadow-glass">
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width:768px) 45vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
        {onPlay && (
          <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <PlayButton
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                onPlay();
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-2 px-1">
        <p className="truncate text-sm font-semibold text-white">{title}</p>
        <p className="truncate text-xs text-white/50">{artist}</p>
      </div>
    </motion.div>
  );
}
