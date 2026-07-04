"use client";

// Trending — full-page grid of trending tracks.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Download } from "lucide-react";
import AppleCard from "@/components/ui/AppleCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { getTrending, triggerDownload } from "@/services/api";
import type { Song } from "@/types";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function TrendingPage() {
  const { playSong, addToQueue } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    getTrending().then(setSongs).catch(() => setSongs([]));
  }, []);

  return (
    <div className="px-5 py-8 sm:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-2 text-4xl font-bold tracking-tight text-nova-primary"
      >
        Trending
      </motion.h1>
      <p className="mb-8 text-sm font-medium text-nova-secondary">
        The tracks everyone&apos;s playing right now.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {songs.map((s, i) => (
          <AppleCard
            key={s.yt_id}
            delay={Math.min(i * 0.03, 0.4)}
            className="group p-3"
          >
            <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-nova-elevated">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.thumbnail || ""}
                alt={s.title}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => playSong(s, songs)}
                className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-2xl transition-opacity group-hover:opacity-100"
                aria-label="Play"
              >
                <Play size={16} className="fill-nova-primary text-nova-primary" />
              </button>
            </div>

            <p className="truncate text-sm font-semibold text-nova-primary">
              {s.title}
            </p>
            <p className="truncate text-xs font-medium text-nova-secondary">
              {s.artist}
            </p>

            <div className="mt-2 flex items-center gap-1">
              <button
                onClick={() => addToQueue(s)}
                className="rounded-full p-1.5 text-nova-secondary transition-colors hover:text-nova-primary"
                aria-label="Add to queue"
                title="Add to queue"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => triggerDownload(s)}
                className="rounded-full p-1.5 text-nova-secondary transition-colors hover:text-nova-primary"
                aria-label="Download MP3"
                title="Download MP3"
              >
                <Download size={16} />
              </button>
            </div>
          </AppleCard>
        ))}
      </div>
    </div>
  );
}
