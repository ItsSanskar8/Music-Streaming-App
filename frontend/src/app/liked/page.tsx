"use client";

// Liked Songs — fetch from backend via likesApi, show liked tracks with heart state.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Play, Shuffle, Music2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { usePlayer } from "@/contexts/PlayerContext";
import { listLikes } from "@/services/likesApi";
import MoodGlow from "@/components/ui/MoodGlow";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LikedPage() {
  const { playSong, likedSongs, toggleLike, isLiked } = usePlayer();
  const [serverLiked, setServerLiked] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // Merge local liked + server liked; local is the source of truth for instant UX.
  const songs = useMemo(
    () => Array.from(new Map([...serverLiked, ...likedSongs].map(s => [s.yt_id, s])).values()),
    [serverLiked, likedSongs]
  );

  useEffect(() => {
    listLikes()
      .then(setServerLiked)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const playAll = () => {
    if (songs.length > 0) playSong(songs[0], songs);
  };

  return (
    <AuthGuard>
      <MoodGlow mood={songs[0]?.mood} />
      <div className="px-5 py-8 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/30 to-pink-600/20 border border-white/[0.08]">
              <Heart size={28} className="text-rose-400 fill-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Liked Songs
              </h1>
              <p className="text-sm text-white/50">
                {loading ? "Loading…" : `${songs.length} track${songs.length !== 1 ? "s" : ""} in your collection`}
              </p>
            </div>
          </div>

          {songs.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={playAll}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0F0F12] shadow-md transition-transform hover:scale-[1.03]"
              >
                <Play size={16} className="fill-[#F5F0EB]" />
                Play All
              </button>
              <button
                onClick={playAll}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:border-white/30"
              >
                <Shuffle size={16} />
                Shuffle
              </button>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {loading ? (
          <GlassSkeleton variant="row" count={6} />
        ) : songs.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No liked songs yet"
            subtitle="Your Nova library is ready. Start exploring trending tracks and mood mixes."
            action={
              <Link
                href="/trending"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0F0F12] shadow-md transition-transform hover:scale-[1.03]"
              >
                <Music2 size={16} />
                Explore Trending
              </Link>
            }
          />
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
            {songs.map((s, i) => (
              <SongRow key={s.yt_id} song={s} list={songs} rank={i + 1} index={i} showActions />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
