"use client";

// ============================================================================
//  NOVA Dashboard — cinematic hero banner + Top Singles / Albums / Artists /
//  Recommended / Mood Mixes. Uses the existing backend endpoints only
//  (getTrending, recommendByMood). Albums & artists are derived presentationally
//  from the trending catalog (no album/artist entity in the backend).
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Sparkles } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import TiltCard from "@/components/ui/TiltCard";
import SectionHeader from "@/components/ui/SectionHeader";
import AnimatedWaveform from "@/components/ui/AnimatedWaveform";
import SongRow from "@/components/music/SongRow";
import MusicCard from "@/components/cards/MusicCard";
import AlbumCard from "@/components/cards/AlbumCard";
import ArtistCard from "@/components/cards/ArtistCard";
import MoodCard from "@/components/cards/MoodCard";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import AmbientEffects from "@/components/ui/AmbientEffects";
import MoodRadial from "@/components/ui/MoodRadial";
import { usePlayer } from "@/contexts/PlayerContext";
import { getTrending, recommendByMood } from "@/services/api";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

// One card per supported backend mood — each key maps to a real endpoint.
const MOOD_MIXES = [
  { key: "focus", label: "Focus", emoji: "🎯", gradient: "from-nova-blue/40 to-indigo-500/25" },
  { key: "chill", label: "Chill", emoji: "🌊", gradient: "from-nova-cyan/30 to-nova-blue/25" },
  { key: "energetic", label: "Gym", emoji: "⚡", gradient: "from-orange-500/35 to-nova-blue/25" },
  { key: "energetic", label: "Party", emoji: "🎉", gradient: "from-pink-500/35 to-violet-500/25" },
  { key: "melancholic", label: "Sad", emoji: "🌧️", gradient: "from-slate-500/30 to-nova-blue/25" },
  { key: "happy", label: "Romantic", emoji: "💜", gradient: "from-rose-500/35 to-violet-500/25" },
  { key: "focus", label: "Lo-fi", emoji: "🎧", gradient: "from-violet-600/40 to-nova-cyan/20" },
  { key: "happy", label: "Happy", emoji: "☀️", gradient: "from-yellow-500/30 to-nova-blue/25" },
];

export default function DashboardPage() {
  const { playSong, addToQueue, current, isPlaying, recentlyPlayed } = usePlayer();
  const [trending, setTrending] = useState<Song[]>([]);
  const [recommended, setRecommended] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire both API calls in parallel with Promise.allSettled so the page
    // renders as soon as the first paintable data arrives.
    Promise.allSettled([
      getTrending(),
      recommendByMood("chill"),
    ]).then(([trendingRes, recoRes]) => {
      if (trendingRes.status === "fulfilled") setTrending(trendingRes.value);
      if (recoRes.status === "fulfilled") setRecommended(recoRes.value);
    }).finally(() => setLoading(false));
  }, []);

  const featured = trending[0] ?? null;

  // Derive presentational albums + unique artists from the trending catalog.
  const albums = useMemo(() => trending.slice(1, 7), [trending]);
  const artists = useMemo(() => {
    const seen = new Map<string, Song>();
    for (const s of trending) if (!seen.has(s.artist)) seen.set(s.artist, s);
    return Array.from(seen.values()).slice(0, 6);
  }, [trending]);

  const recoList = recommended.length ? recommended : trending.slice(0, 6);

  return (
    <AuthGuard>
      <AmbientEffects mood={featured?.mood} />

      <div className="px-5 py-8 sm:px-8">
        {/* ===================== Hero banner ===================== */}
        {loading ? (
          <div className="skeleton mb-12 h-72 rounded-[2rem] border border-white/[0.06]" />
        ) : featured ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-nova-bg2/80 to-nova-bg/80 shadow-glass-lg backdrop-blur-2xl"
          >
            <div className="absolute inset-0 opacity-25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.thumbnail || ""} alt="" className="h-full w-full object-cover blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
              {/* Left column — album art with mood-matched radial halo */}
              <div className="relative flex items-center justify-center">
                <MoodRadial mood={featured.mood} />
                <TiltCard max={14} scale={1.04} className="w-full max-w-sm">
                  <div className="aspect-square overflow-hidden rounded-3xl shadow-glass-lg ring-1 ring-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featured.thumbnail || ""} alt={featured.title} className="h-full w-full object-cover" />
                  </div>
                </TiltCard>
              </div>

              <div className="flex flex-col justify-center">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-nova-cyan" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-nova-cyan">
                    Featured Today
                  </span>
                </div>
                <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {featured.title}
                </h1>
                <p className="mb-4 text-xl font-medium text-white/60">{featured.artist}</p>

                <div className="mb-6 flex items-center gap-4">
                  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium capitalize text-white/80 backdrop-blur-xl">
                    {featured.mood}
                  </span>
                  <AnimatedWaveform bars={8} heightClass="h-6" active={current?.yt_id === featured.yt_id && isPlaying} />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => playSong(featured, trending)}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-8 py-3.5 text-base font-semibold text-black shadow-glow-blue transition-transform hover:scale-105"
                  >
                    <Play size={18} className="fill-black" />
                    Play Now
                  </button>
                  <button
                    onClick={() => addToQueue(featured)}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-xl transition-colors hover:bg-white/20"
                  >
                    <Plus size={18} />
                    Add to Library
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        ) : null}

        {/* ===================== Recently Played ===================== */}
        {recentlyPlayed.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Recently Played"
              subtitle="Pick up where you left off"
              href="/recently-played"
            />
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
              {recentlyPlayed.slice(0, 6).map((s, i) => (
                <SongRow
                  key={`recent-${s.yt_id}-${i}`}
                  song={s}
                  list={recentlyPlayed}
                  rank={i + 1}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===================== Top Singles ===================== */}
        <section className="mb-12">
          <SectionHeader title="Top Singles" subtitle="The tracks everyone’s playing right now" href="/trending" />
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
            {loading
              ? <GlassSkeleton variant="row" count={6} />
              : trending.slice(0, 8).map((s, i) => (
                  <SongRow key={s.yt_id} song={s} list={trending} rank={i + 1} index={i} />
                ))}
          </div>
        </section>

        {/* ===================== Top Albums ===================== */}
        {albums.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Top Albums" subtitle="Fresh rotations for your ears" />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {albums.map((s, i) => (
                <AlbumCard
                  key={s.yt_id}
                  title={s.title}
                  artist={s.artist}
                  cover={s.thumbnail}
                  index={i}
                  onPlay={() => playSong(s, trending)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===================== Popular Artists ===================== */}
        {artists.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Popular Artists" subtitle="Voices trending across Nova" />
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-7">
              {artists.map((s, i) => (
                <ArtistCard
                  key={s.artist}
                  name={s.artist}
                  image={s.thumbnail}
                  meta="Trending artist"
                  index={i}
                  onClick={() => playSong(s, trending)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ===================== Recommended For You ===================== */}
        {recoList.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Recommended For You" subtitle="Tuned to the Nova catalog and your vibe" href="/mood-ai" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {recoList.slice(0, 6).map((s, i) => (
                <MusicCard key={s.yt_id} song={s} list={recoList} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ===================== Mood Mixes ===================== */}
        <section className="mb-4">
          <SectionHeader title="Mood Mixes" subtitle="Pick a feeling — Nova scores the soundtrack" href="/mood-ai" />
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {MOOD_MIXES.map((m, i) => (
              <MoodCard
                key={m.label}
                label={m.label}
                emoji={m.emoji}
                gradient={m.gradient}
                href={`/mood-ai?mood=${m.key}`}
                index={i}
              />
            ))}
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
