"use client";

// Album detail — cover, title, artist, release date, song list, play all.
// Nova has no album entity — data is derived from the song catalog.

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Shuffle, Music2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { usePlayer } from "@/contexts/PlayerContext";
import { getTrending, searchSongs } from "@/services/api";
import MoodGlow from "@/components/ui/MoodGlow";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AlbumDetailPage() {
  const params = useParams();
  const albumName = decodeURIComponent(String(params?.id || ""));
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!albumName) return;
    searchSongs(albumName)
      .then((results) => {
        // Group songs that share a similar title as the album.
        const matches = results.filter(
          (s) => s.title.toLowerCase().includes(albumName.toLowerCase())
        );
        setSongs(matches.length ? matches : results.slice(0, 8));
      })
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, [albumName]);

  const cover = songs[0]?.thumbnail;
  const artist = songs[0]?.artist || "Unknown Artist";

  return (
    <AuthGuard>
      <MoodGlow mood={songs[0]?.mood} />
      <div className="px-5 py-8 sm:px-8">
        {loading ? (
          <GlassSkeleton variant="row" count={6} />
        ) : songs.length === 0 ? (
          <EmptyState
            icon={Music2}
            title="Album not found"
            subtitle="We couldn't find this album in the Nova catalog."
            action={
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue">
                <ArrowLeft size={16} />
                Back to Search
              </Link>
            }
          />
        ) : (
          <>
            {/* Album header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-8 flex flex-col items-center gap-8 sm:flex-row"
            >
              {/* Cover art */}
              <div className="h-48 w-48 flex-shrink-0 overflow-hidden rounded-3xl border border-white/[0.08] shadow-2xl ring-1 ring-white/10">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={albumName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.04]">
                    <Music2 size={48} className="text-white/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Album</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  {albumName}
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  {artist} · {songs.length} track{songs.length !== 1 ? "s" : ""}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
                  <button
                    onClick={() => playSong(songs[0], songs)}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
                  >
                    <Play size={16} className="fill-black" />
                    Play All
                  </button>
                  <button
                    onClick={() => playSong(songs[0], songs)}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:border-white/30"
                  >
                    <Shuffle size={16} />
                    Shuffle
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Song list */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
              {songs.map((s, i) => (
                <SongRow key={s.yt_id} song={s} list={songs} rank={i + 1} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
