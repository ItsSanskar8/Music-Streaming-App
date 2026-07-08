"use client";

// Trending — weekly chart-style layout with rank numbers, play buttons, like buttons.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Play, Music2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import ArtistCard from "@/components/cards/ArtistCard";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { usePlayer } from "@/contexts/PlayerContext";
import { getTrending } from "@/services/api";
import MoodGlow from "@/components/ui/MoodGlow";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function TrendingPage() {
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending()
      .then(setSongs)
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, []);

  // Derive unique artists from trending for the artist section.
  const artists = (() => {
    const seen = new Map<string, Song>();
    for (const s of songs) if (!seen.has(s.artist)) seen.set(s.artist, s);
    return Array.from(seen.values()).slice(0, 6);
  })();

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
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue/30 to-nova-cyan/20 border border-white/[0.08]">
              <TrendingUp size={28} className="text-nova-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trending
              </h1>
              <p className="text-sm text-white/50">
                {loading ? "Loading…" : `Top ${songs.length} tracks right now`}
              </p>
            </div>
          </div>

          {songs.length > 0 && (
            <button
              onClick={() => playSong(songs[0], songs)}
              className="mt-4 flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0F0F12] shadow-md transition-transform hover:scale-[1.03]"
            >
              <Play size={16} className="fill-[#0F0F12]" />
              Play All
            </button>
          )}
        </motion.div>

        {loading ? (
          <GlassSkeleton variant="row" count={8} />
        ) : songs.length === 0 ? (
          <EmptyState
            icon={TrendingUp}
            title="No trending tracks"
            subtitle="Your Nova library is ready. Start exploring mood mixes and search for music."
            action={
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0F0F12] shadow-md transition-transform hover:scale-[1.03]"
              >
                <Music2 size={16} />
                Search Music
              </Link>
            }
          />
        ) : (
          <>
            {/* Chart list */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl mb-12">
              {songs.map((s, i) => (
                <SongRow key={s.yt_id} song={s} list={songs} rank={i + 1} index={i} />
              ))}
            </div>

            {/* Top Artists */}
            {artists.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl font-bold tracking-tight text-white">
                  Top Artists
                </h2>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-7">
                  {artists.map((s, i) => (
                    <ArtistCard
                      key={s.artist}
                      name={s.artist}
                      image={s.thumbnail}
                      meta="Trending artist"
                      index={i}
                      href={`/artists/${encodeURIComponent(s.artist)}`}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
