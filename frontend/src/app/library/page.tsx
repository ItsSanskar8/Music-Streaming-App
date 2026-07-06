"use client";

// Library — tabbed view for Liked Songs, Recently Played, and Local Imports.

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Clock, HardDrive } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import EmptyState from "@/components/ui/EmptyState";
import FileDropzone from "@/components/ui/FileDropzone";
import { usePlayer } from "@/contexts/PlayerContext";
import MoodGlow from "@/components/ui/MoodGlow";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

type Tab = "liked" | "recent" | "local";

export default function LibraryPage() {
  const { likedSongs, recentlyPlayed, catalog, playSong } = usePlayer();
  const [activeTab, setActiveTab] = useState<Tab>("liked");

  const localSongs = catalog.filter((s) => s.isLocal);

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: "liked", label: "Liked Songs", icon: Heart, count: likedSongs.length },
    { key: "recent", label: "Recently Played", icon: Clock, count: recentlyPlayed.length },
    { key: "local", label: "Local Imports", icon: HardDrive, count: localSongs.length },
  ];

  const getSongs = (): Song[] => {
    switch (activeTab) {
      case "liked":
        return likedSongs;
      case "recent":
        return recentlyPlayed;
      case "local":
        return localSongs;
      default:
        return [];
    }
  };

  const songs = getSongs();

  return (
    <AuthGuard>
      <MoodGlow mood={songs[0]?.mood} />
      <div className="px-5 py-8 sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-2 text-4xl font-bold tracking-tight text-white"
        >
          Your Library
        </motion.h1>
        <p className="mb-8 text-sm font-medium text-white/50">
          All your music in one place.
        </p>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-white/[0.06]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  active ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active
                      ? "bg-nova-cyan/20 text-nova-cyan"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {tab.count}
                </span>
                {active && (
                  <motion.div
                    layoutId="library-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-nova-cyan"
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Local imports tab shows dropzone first */}
        {activeTab === "local" && (
          <div className="mb-8">
            <FileDropzone />
          </div>
        )}

        {/* Song list */}
        {songs.length === 0 ? (
          <EmptyState
            icon={tabs.find((t) => t.key === activeTab)!.icon}
            title={
              activeTab === "liked"
                ? "No liked songs yet"
                : activeTab === "recent"
                ? "No recent plays"
                : "No local files"
            }
            subtitle={
              activeTab === "liked"
                ? "Tap the heart icon on any song to save it here."
                : activeTab === "recent"
                ? "Songs you play will appear here."
                : "Import MP3 files using the dropzone above."
            }
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
                showActions
              />
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
