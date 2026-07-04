"use client";

// Dashboard — cinematic hero, mood selector bubbles, and trending carousel.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Sparkles } from "lucide-react";
import AppleCard from "@/components/ui/AppleCard";
import TiltCard from "@/components/ui/TiltCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { getTrending, recommendByMood } from "@/services/api";
import type { Mood, Song } from "@/types";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const MOODS: { key: Mood; label: string; emoji: string; gradient: string }[] = [
  { key: "chill", label: "Chill", emoji: "🌊", gradient: "from-blue-500/20 to-cyan-500/20" },
  { key: "energetic", label: "Energetic", emoji: "⚡", gradient: "from-yellow-500/20 to-orange-500/20" },
  { key: "happy", label: "Happy", emoji: "☀️", gradient: "from-yellow-400/20 to-pink-500/20" },
  { key: "focus", label: "Focus", emoji: "🎯", gradient: "from-purple-500/20 to-indigo-500/20" },
  { key: "ambient", label: "Ambient", emoji: "🌌", gradient: "from-indigo-500/20 to-purple-500/20" },
  { key: "melancholic", label: "Melancholic", emoji: "🌧️", gradient: "from-gray-500/20 to-blue-500/20" },
];

export default function DashboardPage() {
  const { playSong, addToQueue } = usePlayer();
  const [trending, setTrending] = useState<Song[]>([]);
  const [featuredSong, setFeaturedSong] = useState<Song | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [moodSongs, setMoodSongs] = useState<Song[]>([]);
  const [loadingMood, setLoadingMood] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getTrending().then((songs) => {
      setTrending(songs);
      if (songs.length > 0) setFeaturedSong(songs[0]);
    }).catch(() => setTrending([]));
  }, []);

  const selectMood = async (m: Mood) => {
    setMood(m);
    setLoadingMood(true);
    try {
      setMoodSongs(await recommendByMood(m));
    } catch {
      setMoodSongs([]);
    } finally {
      setLoadingMood(false);
    }
  };

  return (
    <div className="px-5 py-8 sm:px-8">
      {/* Cinematic Hero Featured Section */}
      {featuredSong && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-brand-navy/80 to-brand-ink/80 backdrop-blur-2xl shadow-2xl"
        >
          {/* Blurred background art */}
          <div className="absolute inset-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredSong.thumbnail || ""}
              alt=""
              className="h-full w-full object-cover blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
            {/* 3D Tilting Album Art */}
            <div className="flex items-center justify-center">
              <TiltCard max={15} scale={1.05} className="w-full max-w-md">
                <div className="aspect-square overflow-hidden rounded-3xl ring-1 ring-white/20 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredSong.thumbnail || ""}
                    alt={featuredSong.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </TiltCard>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-brand-lavender" />
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-lavender">
                  Featured Track
                </span>
              </div>

              <h2 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {featuredSong.title}
              </h2>
              <p className="mb-4 text-xl font-medium text-white/60">
                {featuredSong.artist}
              </p>

              {/* Mood pill */}
              <div className="mb-6 inline-flex">
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium capitalize text-white/80 backdrop-blur-xl">
                  {featuredSong.mood}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => playSong(featuredSong, trending)}
                  className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition-transform hover:scale-105"
                >
                  <Play size={18} className="fill-black" />
                  Play Now
                </button>
                <button
                  onClick={() => addToQueue(featuredSong)}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/20"
                >
                  <Plus size={18} />
                  Add to Queue
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Mood discovery bubbles */}
      <section className="mb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-nova-secondary">
          How are you feeling?
        </h2>
        <div className="flex flex-wrap gap-3">
          {MOODS.map((m, i) => {
            const active = mood === m.key;
            return (
              <motion.button
                key={m.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => selectMood(m.key)}
                className={`relative flex items-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "border-brand-cyan/60 bg-brand-cyan/20 text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-nova-secondary hover:text-nova-primary hover:border-white/20"
                }`}
              >
                {/* Gradient background for active mood */}
                {active && (
                  <motion.div
                    layoutId="mood-glow"
                    className={`absolute inset-0 -z-10 bg-gradient-to-br ${m.gradient} blur-xl`}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                {/* Pulsing ring for active mood */}
                {active && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border border-brand-cyan/40"
                  />
                )}
                <span>{m.emoji}</span>
                {m.label}
              </motion.button>
            );
          })}
        </div>

        {/* Mood results */}
        {mood && (
          <div className="mt-6">
            {loadingMood ? (
              <p className="text-sm text-nova-secondary">Reading the mood…</p>
            ) : moodSongs.length === 0 ? (
              <p className="text-sm text-nova-secondary">
                No {mood} tracks saved yet — try searching to fill your library.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {moodSongs.map((s, i) => (
                  <SongRow
                    key={s.yt_id}
                    song={s}
                    delay={i * 0.03}
                    onPlay={() => playSong(s, moodSongs)}
                    onAdd={() => addToQueue(s)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Trending carousel */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-nova-primary">
            Trending Now
          </h2>
        </div>

        <div
          ref={carouselRef}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-2"
        >
          {trending.map((s, i) => (
            <AppleCard
              key={s.yt_id}
              delay={i * 0.03}
              onClick={() => playSong(s, trending)}
              className="group w-44 flex-shrink-0 p-3"
            >
              <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-nova-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.thumbnail || ""}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 opacity-0 backdrop-blur-2xl transition-opacity group-hover:opacity-100">
                  <Play size={16} className="fill-nova-primary text-nova-primary" />
                </div>
              </div>
              <p className="truncate text-sm font-semibold text-nova-primary">
                {s.title}
              </p>
              <p className="truncate text-xs font-medium text-nova-secondary">
                {s.artist}
              </p>
            </AppleCard>
          ))}
        </div>
      </section>
    </div>
  );
}

// Compact reusable song row used for mood results.
function SongRow({
  song,
  onPlay,
  onAdd,
  delay = 0,
}: {
  song: Song;
  onPlay: () => void;
  onAdd: () => void;
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
      <button
        onClick={onAdd}
        className="text-nova-secondary transition-colors hover:text-nova-primary"
        aria-label="Add to queue"
      >
        <Plus size={18} />
      </button>
      <button
        onClick={onPlay}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-nova-elevated text-nova-primary transition-transform hover:scale-105"
        aria-label="Play"
      >
        <Play size={15} className="fill-nova-primary" />
      </button>
    </AppleCard>
  );
}

