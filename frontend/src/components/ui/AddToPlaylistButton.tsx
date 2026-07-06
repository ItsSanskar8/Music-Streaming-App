"use client";

// AddToPlaylistButton — shows a dropdown of the user's playlists.
// Checks each playlist for existing songs to prevent duplicates.

import { useEffect, useRef, useState } from "react";
import { FolderPlus, Plus, Check, Loader2, Music2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Song } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  listPlaylists,
  getPlaylist,
  addSongToPlaylist,
  createPlaylist,
  type PlaylistSummary,
} from "@/services/playlistsApi";

interface Props {
  song: Song;
  size?: number;
  className?: string;
}

export default function AddToPlaylistButton({ song, size = 18, className = "" }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [addedTo, setAddedTo] = useState<Set<number>>(new Set());
  const [alreadyIn, setAlreadyIn] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  // Load playlists and check which ones already contain this song.
  useEffect(() => {
    if (!open || !user) return;
    setLoading(true);
    setAlreadyIn(new Set());
    listPlaylists()
      .then(async (pls) => {
        setPlaylists(pls);
        // Check each playlist for the song in parallel.
        const checks = pls.map(async (pl) => {
          try {
            const detail = await getPlaylist(pl.id);
            return detail.songs.some((s) => s.yt_id === song.yt_id) ? pl.id : null;
          } catch {
            return null;
          }
        });
        const results = await Promise.all(checks);
        const ids = new Set(results.filter((id): id is number => id !== null));
        setAlreadyIn(ids);
      })
      .catch(() => setPlaylists([]))
      .finally(() => setLoading(false));
  }, [open, user, song.yt_id]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleAdd = async (playlist: PlaylistSummary) => {
    if (alreadyIn.has(playlist.id)) {
      toast(`Already in "${playlist.name}"`, { icon: "📋", id: `add-pl-${song.yt_id}` });
      return;
    }
    setAdding(playlist.id);
    try {
      await addSongToPlaylist(playlist.id, song);
      setAddedTo((prev) => new Set(prev).add(playlist.id));
      setAlreadyIn((prev) => new Set(prev).add(playlist.id));
      toast.success(`Added to "${playlist.name}"`, { id: `add-pl-${song.yt_id}` });
      setTimeout(() => {
        setAddedTo((prev) => {
          const next = new Set(prev);
          next.delete(playlist.id);
          return next;
        });
      }, 1500);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to playlist", { id: `add-pl-${song.yt_id}` });
    } finally {
      setAdding(null);
    }
  };

  const handleCreateAndAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    try {
      const pl = await createPlaylist(name);
      setPlaylists((prev) => [pl, ...prev]);
      await addSongToPlaylist(pl.id, song);
      setAddedTo((prev) => new Set(prev).add(pl.id));
      setAlreadyIn((prev) => new Set(prev).add(pl.id));
      toast.success(`Created "${name}" and added song`, { id: `add-pl-${song.yt_id}` });
      setNewName("");
      setCreatingNew(false);
      setTimeout(() => {
        setAddedTo((prev) => {
          const next = new Set(prev);
          next.delete(pl.id);
          return next;
        });
      }, 1500);
    } catch (err: any) {
      toast.error(err?.message || "Failed", { id: `add-pl-${song.yt_id}` });
    }
  };

  if (!user) return null;

  return (
    <span className="ml-0.5 flex h-7 w-7 items-center justify-center">
    <div ref={ref} className="relative w-full">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Add to playlist"
        title="Add to playlist"
        className={`text-white/45 transition-colors hover:text-nova-cyan ${className}`}
      >
        <FolderPlus size={size} />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/[0.1] bg-nova-bg2/95 shadow-2xl backdrop-blur-2xl"
        >
          <div className="border-b border-white/[0.08] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Add to Playlist
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto no-scrollbar p-2">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={18} className="animate-spin text-nova-cyan" />
              </div>
            ) : playlists.length === 0 && !creatingNew ? (
              <p className="px-3 py-4 text-center text-xs text-white/40">
                No playlists yet. Create one below.
              </p>
            ) : (
              playlists.map((pl) => {
                const added = addedTo.has(pl.id);
                const inPlaylist = alreadyIn.has(pl.id);
                const isAdding = adding === pl.id;
                return (
                  <button
                    key={pl.id}
                    onClick={() => handleAdd(pl)}
                    disabled={isAdding || added}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05] disabled:opacity-60"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                      {added ? (
                        <Check size={14} className="text-nova-cyan" />
                      ) : inPlaylist ? (
                        <Music2 size={14} className="text-nova-cyan/60" />
                      ) : isAdding ? (
                        <Loader2 size={14} className="animate-spin text-nova-cyan" />
                      ) : (
                        <FolderPlus size={14} className="text-white/40" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{pl.name}</p>
                      <p className="truncate text-[11px] text-white/35">
                        {inPlaylist ? (
                          <span className="text-nova-cyan/60">Already in playlist</span>
                        ) : (
                          `${pl.song_count} track${pl.song_count !== 1 ? "s" : ""}`
                        )}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Create new playlist */}
          <div className="border-t border-white/[0.08] p-2">
            {creatingNew ? (
              <form onSubmit={handleCreateAndAdd} className="flex gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Playlist name"
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white placeholder:text-white/40 outline-none focus:border-nova-cyan/40"
                />
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="rounded-lg bg-nova-cyan/20 px-3 py-2 text-xs font-semibold text-nova-cyan transition-colors hover:bg-nova-cyan/30 disabled:opacity-40"
                >
                  Add
                </button>
              </form>
            ) : (
              <button
                onClick={() => setCreatingNew(true)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <Plus size={14} />
                New Playlist
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    </span>
  );
}
