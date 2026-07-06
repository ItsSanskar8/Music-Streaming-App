"use client";

// Playlist Detail — show playlist info, songs, play all, like, add to queue, remove.

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Shuffle, ArrowLeft, Music2, Trash2, ListPlus } from "lucide-react";
import toast from "react-hot-toast";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import EmptyState from "@/components/ui/EmptyState";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import MoodGlow from "@/components/ui/MoodGlow";
import { usePlayer } from "@/contexts/PlayerContext";
import { getPlaylist, removeSongFromPlaylist, deletePlaylist, type PlaylistDetail } from "@/services/playlistsApi";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const { playSong, addToQueue } = usePlayer();
  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getPlaylist(id)
      .then(setPlaylist)
      .catch(() => setPlaylist(null))
      .finally(() => setLoading(false));
  }, [id]);

  const playAll = () => {
    if (playlist?.songs.length) playSong(playlist.songs[0], playlist.songs);
  };

  const handleRemove = async (songId: number) => {
    if (!id) return;
    try {
      const updated = await removeSongFromPlaylist(id, songId);
      setPlaylist(updated);
      toast.success("Song removed", { id: "playlist-rm" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove song", { id: "playlist-rm" });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this playlist?")) return;
    try {
      await deletePlaylist(id);
      toast.success("Playlist deleted", { id: "playlist-del" });
      router.push("/playlists");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete", { id: "playlist-del" });
    }
  };

  const firstMood = playlist?.songs[0]?.mood;

  return (
    <AuthGuard>
      <MoodGlow mood={firstMood} />
      <div className="px-5 py-8 sm:px-8">
        {loading ? (
          <GlassSkeleton variant="row" count={6} />
        ) : !playlist ? (
          <EmptyState
            icon={Music2}
            title="Playlist not found"
            subtitle="This playlist may have been deleted."
            action={
              <Link href="/playlists" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue">
                <ArrowLeft size={16} />
                Back to Playlists
              </Link>
            }
          />
        ) : (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-8"
            >
              <Link href="/playlists" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/40 transition-colors hover:text-nova-cyan">
                <ArrowLeft size={14} />
                Playlists
              </Link>

              <div className="flex items-center gap-6">
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue/40 to-nova-cyan/30 border border-white/[0.08] shadow-glass">
                  {playlist.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={playlist.cover_url} alt="" className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <Music2 size={36} className="text-white/60" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Playlist</p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl truncate">
                    {playlist.name}
                  </h1>
                  <p className="mt-1 text-sm text-white/50">
                    {playlist.songs.length} track{playlist.songs.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={playAll}
                  disabled={playlist.songs.length === 0}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03] disabled:opacity-50"
                >
                  <Play size={16} className="fill-black" />
                  Play All
                </button>
                <button
                  onClick={playAll}
                  disabled={playlist.songs.length === 0}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:border-white/30 disabled:opacity-50"
                >
                  <Shuffle size={16} />
                  Shuffle
                </button>
                <button
                  onClick={handleDelete}
                  className="ml-auto flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>

            {/* Songs */}
            {playlist.songs.length === 0 ? (
              <EmptyState
                icon={ListPlus}
                title="No songs in this playlist"
                subtitle="Add songs from Search, Trending, or the player."
                action={
                  <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue">
                    <Music2 size={16} />
                    Find Songs
                  </Link>
                }
              />
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
                {playlist.songs.map((s, i) => (
                  <SongRow key={s.yt_id} song={s} list={playlist.songs} rank={i + 1} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
