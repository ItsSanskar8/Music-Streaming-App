"use client";

// Explore — songs ranked by play count.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Loader2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import EmptyState from "@/components/ui/EmptyState";
import { usePlayer } from "@/contexts/PlayerContext";
import { getExplore } from "@/services/api";
import MoodGlow from "@/components/ui/MoodGlow";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ExplorePage() {
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExplore(30)
      .then(setSongs)
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard>
      <MoodGlow mood={songs[0]?.mood} />
      <div className="px-5 py-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} className="text-nova-cyan" />
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Explore
            </h1>
          </div>
          <p className="text-sm text-white/50">
            Most played tracks across Nova — ranked by community play count.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Loader2 size={16} className="animate-spin text-nova-cyan" />
            Loading explore…
          </div>
        ) : songs.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="Nothing played yet"
            subtitle="Start playing songs to see them ranked here by play count."
          />
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
            {songs.map((s, i) => (
              <SongRow
                key={s.yt_id}
                song={s}
                list={songs}
                rank={i + 1}
                index={i}
                showPlayCount
              />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
