"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import type { Song } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";
import { formatTime } from "@/lib/format";
import LikeButton from "@/components/ui/LikeButton";
import QueueButton from "@/components/ui/QueueButton";
import DownloadButton from "@/components/ui/DownloadButton";
import AddToPlaylistButton from "@/components/ui/AddToPlaylistButton";
import AnimatedWaveform from "@/components/ui/AnimatedWaveform";

// A single ranked track row: rank · cover · title/artist · actions · duration.
// Clicking the row (or the cover) plays it within `list` (queue context).

interface Props {
  song: Song;
  /** The list this row belongs to — becomes the queue when played. */
  list?: Song[];
  rank?: number;
  index?: number;
  /** Keep actions always visible (e.g. on the Liked page). */
  showActions?: boolean;
  /** Show play count badge next to duration. */
  showPlayCount?: boolean;
}

export default function SongRow({ song, list, rank, index = 0, showActions = false, showPlayCount = false }: Props) {
  const { current, isPlaying, playSong, togglePlay } = usePlayer();
  const isCurrent = current?.yt_id === song.yt_id;

  const onPlay = () => {
    if (isCurrent) togglePlay();
    else playSong(song, list);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4) }}
      onClick={onPlay}
      className={`group flex cursor-pointer items-center gap-4 rounded-xl px-3 py-2.5 transition-colors ${
        isCurrent ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
      }`}
    >
      {/* Rank / equalizer */}
      {rank !== undefined && (
        <div className="hidden w-6 flex-shrink-0 justify-center text-sm font-semibold tabular-nums text-white/40 sm:flex">
          {isCurrent && isPlaying ? (
            <AnimatedWaveform bars={3} heightClass="h-4" className="w-4" />
          ) : (
            rank
          )}
        </div>
      )}

      {/* Cover + hover play */}
      <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
        {song.thumbnail && (
          <Image
            src={song.thumbnail}
            alt={song.title}
            fill
            sizes="44px"
            className="object-cover"
            unoptimized
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
          {isCurrent && isPlaying ? (
            <Pause size={16} className="fill-white text-white" />
          ) : (
            <Play size={16} className="translate-x-[1px] fill-white text-white" />
          )}
        </div>
      </div>

      {/* Title / artist */}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${isCurrent ? "text-nova-cyan" : "text-white"}`}>
          {song.title}
        </p>
        <p className="truncate text-xs text-white/50">{song.artist}</p>
      </div>

      {/* Mood tag */}
      <span className="hidden rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/40 md:inline">
        {song.mood}
      </span>

      {/* Actions (reveal on hover, or always visible when showActions is true) */}
      <div className={`flex items-center transition-opacity focus-within:opacity-100 ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <QueueButton song={song} size={17} />
        <AddToPlaylistButton song={song} size={17} />
        <DownloadButton song={song} size={17} />
        <LikeButton song={song} size={17} />
      </div>

      <div className="flex items-center gap-3">
        {showPlayCount && song.play_count != null && song.play_count > 0 && (
          <span className="hidden text-[11px] font-medium text-white/35 tabular-nums sm:inline">
            {song.play_count.toLocaleString()} plays
          </span>
        )}
        <span className="w-10 flex-shrink-0 text-right text-xs tabular-nums text-white/40">
          {formatTime(song.duration)}
        </span>
      </div>
    </motion.div>
  );
}
