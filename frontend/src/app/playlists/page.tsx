"use client";

// Playlists — fetch from backend, create new, show playlist cards.

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListMusic, Plus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import AuthGuard from "@/components/auth/AuthGuard";
import PlaylistCard from "@/components/cards/PlaylistCard";
import EmptyState from "@/components/ui/EmptyState";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import { usePlayer } from "@/contexts/PlayerContext";
import { listPlaylists, createPlaylist, type PlaylistSummary } from "@/services/playlistsApi";
import { searchSongs } from "@/services/api";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const GRADIENTS = [
  "from-nova-blue/40 to-nova-cyan/30",
  "from-indigo-600/40 to-nova-blue/30",
  "from-nova-cyan/30 to-emerald-500/25",
  "from-orange-500/35 to-nova-blue/25",
  "from-violet-600/40 to-nova-cyan/20",
  "from-pink-500/35 to-nova-blue/25",
];

export default function PlaylistsPage() {
  const { playSong } = usePlayer();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const load = () => {
    listPlaylists()
      .then(setPlaylists)
      .catch(() => setPlaylists([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await createPlaylist(name);
      toast.success(`Created "${name}"`, { id: "create-playlist" });
      setNewName("");
      setShowCreate(false);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create playlist", { id: "create-playlist" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <AuthGuard>
      <div className="px-5 py-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 flex items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Playlists
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {loading ? "Loading…" : `${playlists.length} playlist${playlists.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-5 py-2.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
          >
            <Plus size={16} />
            New Playlist
          </button>
        </motion.div>

        {/* Create modal */}
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 glass-strong rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Create Playlist</h3>
              <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex gap-3">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Playlist name"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-nova-cyan/40"
              />
              <button
                type="submit"
                disabled={creating || !newName.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-nova-blue to-nova-cyan px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Create
              </button>
            </form>
          </motion.div>
        )}

        {/* Playlist grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <GlassSkeleton variant="card" count={6} />
          </div>
        ) : playlists.length === 0 ? (
          <EmptyState
            icon={ListMusic}
            title="No playlists yet"
            subtitle="Create your first playlist to organize your favorite tracks."
            action={
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
              >
                <Plus size={16} />
                Create Playlist
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {playlists.map((p, i) => (
              <PlaylistCard
                key={p.id}
                title={p.name}
                subtitle={`${p.song_count} track${p.song_count !== 1 ? "s" : ""}`}
                cover={p.cover_url}
                gradient={GRADIENTS[i % GRADIENTS.length]}
                href={`/playlists/${p.id}`}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
