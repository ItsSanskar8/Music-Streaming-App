"use client";

// Recently Played — shows listening history from PlayerContext.

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Music2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import EmptyState from "@/components/ui/EmptyState";
import MoodGlow from "@/components/ui/MoodGlow";
import { usePlayer } from "@/contexts/PlayerContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function RecentlyPlayedPage() {
  const { recentlyPlayed, playSong } = usePlayer();

  return (
    <AuthGuard>
      <MoodGlow mood={recentlyPlayed[0]?.mood} />
      <div className="px-5 py-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-cyan/30 to-nova-blue/20 border border-white/[0.08]">
              <Clock size={28} className="text-nova-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Recently Played
              </h1>
              <p className="text-sm text-white/50">
                {recentlyPlayed.length} track{recentlyPlayed.length !== 1 ? "s" : ""} in your history
              </p>
            </div>
          </div>
        </motion.div>

        {recentlyPlayed.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="No recent plays"
            subtitle="Songs you play will appear here. Start exploring Nova!"
            action={
              <Link
                href="/trending"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
              >
                <Music2 size={16} />
                Explore Trending
              </Link>
            }
          />
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
            {recentlyPlayed.map((s, i) => (
              <SongRow key={`${s.yt_id}-${i}`} song={s} list={recentlyPlayed} rank={i + 1} index={i} />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
