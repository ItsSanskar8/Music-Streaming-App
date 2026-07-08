"use client";

// Artist detail — banner, image, name, verified badge, top songs, albums.
// Nova has no artist entity — data is derived from the song catalog.

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Play, Music2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import AlbumCard from "@/components/cards/AlbumCard";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { usePlayer } from "@/contexts/PlayerContext";
import { getTrending, searchSongs } from "@/services/api";
import MoodGlow from "@/components/ui/MoodGlow";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ArtistDetailPage() {
  const params = useParams();
  const artistName = decodeURIComponent(String(params?.id || ""));
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistName) return;
    // Try searching for the artist name to get their songs.
    searchSongs(artistName)
      .then((results) => {
        // Filter to songs where the artist name matches.
        const filtered = results.filter(
          (s) => s.artist.toLowerCase() === artistName.toLowerCase()
        );
        setSongs(filtered.length ? filtered : results.slice(0, 12));
      })
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, [artistName]);

  // Derive albums from unique title patterns (presentational).
  const albums = useMemo(() => {
    const seen = new Set<string>();
    return songs.filter((s) => {
      if (seen.has(s.title)) return false;
      seen.add(s.title);
      return true;
    }).slice(0, 6);
  }, [songs]);

  const bannerImage = songs[0]?.thumbnail;

  return (
    <AuthGuard>
      <MoodGlow mood={songs[0]?.mood} />
      <div className="px-5 py-8 sm:px-8">
        {loading ? (
          <GlassSkeleton variant="row" count={6} />
        ) : songs.length === 0 ? (
          <EmptyState
            icon={Music2}
            title="Artist not found"
            subtitle="We couldn't find any songs for this artist."
            action={
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0F0F12] shadow-md">
                <ArrowLeft size={16} />
                Back to Search
              </Link>
            }
          />
        ) : (
          <>
            {/* Artist banner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-nova-bg2/80 to-nova-bg/80 shadow-glass-lg backdrop-blur-2xl"
            >
              {/* Blurred background */}
              {bannerImage && (
                <div className="absolute inset-0 opacity-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerImage} alt="" className="h-full w-full object-cover blur-3xl" />
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center gap-6 p-8 sm:flex-row sm:p-12">
                {/* Artist image */}
                <div className="h-36 w-36 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/10 shadow-2xl ring-4 ring-white/5">
                  {bannerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bannerImage} alt={artistName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/[0.04]">
                      <Music2 size={48} className="text-white/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                      {artistName}
                    </h1>
                    <BadgeCheck size={22} className="text-nova-cyan" />
                  </div>
                  <p className="mt-2 text-sm text-white/50">
                    {songs.length} track{songs.length !== 1 ? "s" : ""} · Trending artist
                  </p>
                  <button
                    onClick={() => songs.length > 0 && playSong(songs[0], songs)}
                    className="mt-4 flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0F0F12] shadow-md transition-transform hover:scale-[1.03]"
                  >
                    <Play size={16} className="fill-[#F5F0EB]" />
                    Play All
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Top Songs */}
            <section className="mb-12">
              <h2 className="mb-5 text-xl font-bold tracking-tight text-white">Top Songs</h2>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
                {songs.slice(0, 10).map((s, i) => (
                  <SongRow key={s.yt_id} song={s} list={songs} rank={i + 1} index={i} />
                ))}
              </div>
            </section>

            {/* Albums / Singles */}
            {albums.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl font-bold tracking-tight text-white">Albums & Singles</h2>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {albums.map((s, i) => (
                    <AlbumCard
                      key={s.yt_id}
                      title={s.title}
                      artist={s.artist}
                      cover={s.thumbnail}
                      index={i}
                      onPlay={() => playSong(s, albums)}
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
