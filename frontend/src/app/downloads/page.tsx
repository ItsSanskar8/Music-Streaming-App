"use client";

// Downloads page — shows tracked downloaded songs + storage usage.

import { motion } from "framer-motion";
import { Download, HardDrive, Music2, Play } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import EmptyState from "@/components/ui/EmptyState";
import SongRow from "@/components/music/SongRow";
import { usePlayer } from "@/contexts/PlayerContext";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DownloadsPage() {
  const { downloadedSongs, playSong } = usePlayer();

  const playAll = () => {
    if (downloadedSongs.length > 0) playSong(downloadedSongs[0], downloadedSongs);
  };

  return (
    <AuthGuard>
      <div className="px-5 py-8 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue/30 to-nova-cyan/20 border border-white/[0.08]">
              <Download size={28} className="text-nova-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Downloads
              </h1>
              <p className="text-sm text-white/50">
                {downloadedSongs.length} track{downloadedSongs.length !== 1 ? "s" : ""} downloaded
              </p>
            </div>
          </div>

          {downloadedSongs.length > 0 && (
            <button
              onClick={playAll}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-6 py-2.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
            >
              <Play size={16} className="fill-black" />
              Play All
            </button>
          )}
        </motion.div>

        {/* Storage usage indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.1 }}
          className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-white/40" />
              <span className="text-sm font-medium text-white/60">Storage</span>
            </div>
            <span className="text-xs text-white/40">
              {downloadedSongs.length} track{downloadedSongs.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan transition-all"
              style={{ width: `${Math.min(downloadedSongs.length * 10, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-white/35">
            Downloads are stored in your browser. Clearing browser data removes them.
          </p>
        </motion.div>

        {downloadedSongs.length === 0 ? (
          <EmptyState
            icon={Download}
            title="No downloads yet"
            subtitle="Download songs from Search, Trending, or the player to keep them available offline."
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
            {downloadedSongs.map((s, i) => (
              <SongRow key={s.yt_id} song={s} list={downloadedSongs} rank={i + 1} index={i} />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
