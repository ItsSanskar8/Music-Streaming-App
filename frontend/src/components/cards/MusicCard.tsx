"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Song } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";
import PlayButton from "@/components/ui/PlayButton";
import LikeButton from "@/components/ui/LikeButton";
import AnimatedWaveform from "@/components/ui/AnimatedWaveform";

// Vertical music card — cover art, hover play overlay + waveform, title/artist.

interface Props {
  song: Song;
  list?: Song[];
  index?: number;
}

export default function MusicCard({ song, list, index = 0 }: Props) {
  const { current, isPlaying, playSong, togglePlay } = usePlayer();
  const isCurrent = current?.yt_id === song.yt_id;
  const playingThis = isCurrent && isPlaying;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.5), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 backdrop-blur-xl transition-shadow hover:shadow-glow-cyan"
    >
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-white/5">
        {song.thumbnail && (
          <Image
            src={song.thumbnail}
            alt={song.title}
            fill
            sizes="(max-width:768px) 45vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Play button — reveals on hover, bottom-right */}
        <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <PlayButton
            playing={playingThis}
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              if (isCurrent) togglePlay();
              else playSong(song, list ?? [song]);
            }}
          />
        </div>

        {playingThis && (
          <div className="absolute bottom-3 left-3">
            <AnimatedWaveform bars={4} heightClass="h-5" />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 px-1 pb-1">
        <div className="min-w-0">
          <p className={`truncate text-sm font-semibold ${isCurrent ? "text-nova-cyan" : "text-white"}`}>
            {song.title}
          </p>
          <p className="truncate text-xs text-white/50">{song.artist}</p>
        </div>
        <LikeButton song={song} size={16} className="mt-0.5" />
      </div>
    </motion.div>
  );
}
