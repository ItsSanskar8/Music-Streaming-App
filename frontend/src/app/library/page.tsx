"use client";

// Library — tabbed view for Liked Songs, Recently Played, and Local Imports.

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Clock, HardDrive, Play, Plus, Trash2 } from "lucide-react";
import AppleCard from "@/components/ui/AppleCard";
import EmptyState from "@/components/ui/EmptyState";
import FileDropzone from "@/components/ui/FileDropzone";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Song } from "@/types";

const EASE = [0.25, 0.1, 0.25, 1] as const;

type Tab = "liked" | "recent" | "local";

export default function LibraryPage() {
  const {
    likedSongs,
    recentlyPlayed,
    catalog,
    playSong,
    addToQueue,
    toggleLike,
  } = usePlayer();
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
    <div className="px-5 py-8 sm:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-2 text-4xl font-bold tracking-tight text-nova-primary"
      >
        Your Library
      </motion.h1>
      <p className="mb-8 text-sm font-medium text-nova-secondary">
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
                    ? "bg-brand-lavender/20 text-brand-lavender"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {tab.count}
              </span>
              {active && (
                <motion.div
                  layoutId="library-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-lavender"
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((s, i) => (
            <SongRow
              key={s.yt_id}
              song={s}
              delay={i * 0.03}
              onPlay={() => playSong(s, songs)}
              onAdd={() => addToQueue(s)}
              onLike={() => toggleLike(s)}
              showDelete={activeTab === "local"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SongRow({
  song,
  onPlay,
  onAdd,
  onLike,
  showDelete,
  delay = 0,
}: {
  song: Song;
  onPlay: () => void;
  onAdd: () => void;
  onLike: () => void;
  showDelete?: boolean;
  delay?: number;
}) {
  return (
    <AppleCard delay={delay} hover={false} className="group flex items-center gap-3 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={song.thumbnail || ""}
        alt={song.title}
        className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-nova-primary">
          {song.title}
        </p>
        <p className="truncate text-xs font-medium text-nova-secondary">
          {song.artist}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onLike}
          className="rounded-full p-2 text-nova-secondary transition-colors hover:text-brand-rose"
          aria-label="Like"
        >
          <Heart size={16} />
        </button>
        <button
          onClick={onAdd}
          className="rounded-full p-2 text-nova-secondary transition-colors hover:text-nova-primary"
          aria-label="Add to queue"
        >
          <Plus size={16} />
        </button>
        {showDelete && (
          <button
            onClick={onLike}
            className="rounded-full p-2 text-nova-secondary transition-colors hover:text-brand-rose"
            aria-label="Remove"
          >
            <Trash2 size={16} />
          </button>
        )}
        <button
          onClick={onPlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-nova-elevated text-nova-primary transition-transform hover:scale-105"
          aria-label="Play"
        >
          <Play size={15} className="fill-nova-primary" />
        </button>
      </div>
    </AppleCard>
  );
}
