"use client";

// ============================================================================
//  NOVA Dashboard v4 — Cinematic hero banner + staggered animated sections
//  • Scroll-triggered section reveals with staggered children
//  • Mood-reactive radial glow on album art
//  • Animated section headers with pulse accent
//  • Smooth transitions between loading/content states
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Sparkles, Disc3 } from "lucide-react";
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
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Staggered section wrapper ───────────────────────────────────────────
function StaggerSection({ children, className = "" }: {
  children: React.ReactNode; className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

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
    Promise.allSettled([
      getTrending(),
      recommendByMood("chill"),
    ]).then(([trendingRes, recoRes]) => {
      if (trendingRes.status === "fulfilled") setTrending(trendingRes.value);
      if (recoRes.status === "fulfilled") setRecommended(recoRes.value);
    }).finally(() => setLoading(false));
  }, []);

  const featured = trending[0] ?? null;
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
        {/* ════ Hero Banner ════ */}
        {loading ? (
          <div className="skeleton mb-12 h-72 rounded-[2rem] border border-white/[0.06]" />
        ) : featured ? (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/[0.06] bg-gradient-to-br from-nova-bg2/60 to-nova-bg/60 shadow-glass-lg backdrop-blur-2xl"
          >
            {/* Blurred background */}
            <div className="absolute inset-0 opacity-25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.thumbnail || ""} alt="" className="h-full w-full object-cover blur-3xl" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-nova-bg/60 via-transparent to-transparent" />

            <div className="relative z-10 grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
              {/* Album art with mood-matched radial */}
              <div className="relative flex items-center justify-center">
                <MoodRadial mood={featured.mood} />
                {/* Outer decorative ring */}
                <div className="pointer-events-none absolute h-[95%] w-[95%] rounded-full border border-white/[0.04] animate-spin-slower" />
                <TiltCard max={14} scale={1.04} className="w-full max-w-sm">
                  <div className="aspect-square overflow-hidden rounded-3xl shadow-glass-lg ring-1 ring-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.thumbnail || ""}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </TiltCard>
                {/* Playing indicator */}
                {current?.yt_id === featured.yt_id && isPlaying && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
                  >
                    <Disc3 size={16} className="text-[#0F0F12] animate-spin-slow" />
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
                  className="mb-4 flex items-center gap-2"
                >
                  <Sparkles size={16} className="text-white/40" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                    Featured Today
                  </span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
                  className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-[2.75rem]"
                >
                  {featured.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
                  className="mb-4 text-xl font-medium text-white/50"
                >
                  {featured.artist}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
                  className="mb-6 flex items-center gap-4"
                >
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-sm font-medium capitalize text-white/60 backdrop-blur-xl">
                    {featured.mood}
                  </span>
                  <AnimatedWaveform
                    bars={8}
                    heightClass="h-6"
                    active={current?.yt_id === featured.yt_id && isPlaying}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
                  className="flex flex-wrap gap-3"
                >
                  <button
                    onClick={() => playSong(featured, trending)}
                    className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#0F0F12] shadow-md transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <Play size={18} className="fill-[#0F0F12]" />
                    Play Now
                  </button>
                  <button
                    onClick={() => addToQueue(featured)}
                    className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-8 py-3.5 text-base font-semibold text-white/70 backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:border-white/[0.12]"
                  >
                    <Plus size={18} />
                    Add to Library
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.section>
        ) : null}

        {/* ════ Recently Played ════ */}
        {recentlyPlayed.length > 0 && (
          <StaggerSection className="mb-12">
            <SectionHeader
              title="Recently Played"
              subtitle="Pick up where you left off"
              href="/recently-played"
            />
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
              {recentlyPlayed.slice(0, 6).map((s, i) => (
                <motion.div
                  key={`recent-${s.yt_id}-${i}`}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
                >
                  <SongRow song={s} list={recentlyPlayed} rank={i + 1} index={i} />
                </motion.div>
              ))}
            </div>
          </StaggerSection>
        )}

        {/* ════ Top Singles ════ */}
        <StaggerSection className="mb-12">
          <SectionHeader title="Top Singles" subtitle="The tracks everyone's playing right now" href="/trending" />
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
            {loading
              ? <GlassSkeleton variant="row" count={6} />
              : trending.slice(0, 8).map((s, i) => (
                  <motion.div
                    key={s.yt_id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
                  >
                    <SongRow song={s} list={trending} rank={i + 1} index={i} />
                  </motion.div>
                ))}
          </div>
        </StaggerSection>

        {/* ════ Top Albums ════ */}
        {albums.length > 0 && (
          <StaggerSection className="mb-12">
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
          </StaggerSection>
        )}

        {/* ════ Popular Artists ════ */}
        {artists.length > 0 && (
          <StaggerSection className="mb-12">
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
          </StaggerSection>
        )}

        {/* ════ Recommended ════ */}
        {recoList.length > 0 && (
          <StaggerSection className="mb-12">
            <SectionHeader title="Recommended For You" subtitle="Tuned to the Nova catalog and your vibe" href="/mood-ai" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {recoList.slice(0, 6).map((s, i) => (
                <MusicCard key={s.yt_id} song={s} list={recoList} index={i} />
              ))}
            </div>
          </StaggerSection>
        )}

        {/* ════ Mood Mixes ════ */}
        <StaggerSection className="mb-4">
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
        </StaggerSection>
      </div>
    </AuthGuard>
  );
}
