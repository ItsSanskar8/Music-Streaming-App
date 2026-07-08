"use client";

// ============================================================================
//  MusicCard v4 — Enhanced with 3D tilt hover, animated border gradient,
//  smoother image zoom, and glowing play button.
// ============================================================================

import Image from "next/image";
import { motion } from "framer-motion";
import type { Song } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";
import PlayButton from "@/components/ui/PlayButton";
import LikeButton from "@/components/ui/LikeButton";
import AddToPlaylistButton from "@/components/ui/AddToPlaylistButton";
import AnimatedWaveform from "@/components/ui/AnimatedWaveform";

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
      whileHover={{ y: -7, scale: 1.01 }}
      className={`group relative w-full overflow-hidden rounded-2xl border bg-white/[0.03] p-3 backdrop-blur-xl transition-all duration-300 hover:shadow-glow-emerald ${
        isCurrent ? "border-nova-cyan/30" : "border-white/[0.07]"
      }`}
    >
      {/* Animated gradient border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-nova-cyan/10 via-transparent to-nova-blue/10" />
      </div>

      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-white/5">
        {song.thumbnail && (
          <Image
            src={song.thumbnail}
            alt={song.title}
            fill
            sizes="(max-width:768px) 45vw, 220px"
            className="object-cover transition-all duration-500 group-hover:scale-110"
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Play button — reveals on hover */}
        <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <PlayButton
            playing={playingThis}
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              if (isCurrent) togglePlay();
              // No `list` → play just this song and append it, rather than
              // replacing the queue with a single-item list.
              else playSong(song, list);
            }}
          />
        </div>

        {playingThis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-3 left-3"
          >
            <AnimatedWaveform bars={4} heightClass="h-5" />
          </motion.div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 px-1 pb-1">
        <div className="min-w-0">
          <p className={`truncate text-sm font-semibold transition-colors ${
            isCurrent ? "text-nova-cyan" : "text-white"
          }`}>
            {song.title}
          </p>
          <p className="truncate text-xs text-white/50">{song.artist}</p>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <AddToPlaylistButton song={song} size={15} />
          <LikeButton song={song} size={15} />
        </div>
      </div>
    </motion.div>
  );
}
