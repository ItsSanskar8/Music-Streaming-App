"use client";

// ============================================================================
//  NOVA — Public landing page.
//  A cinematic, scroll-snap, music-first showcase. One lazy-loaded WebGL hero
//  scene (mobile-reduced), Framer-Motion reveals, glassmorphism throughout.
//  100% music — no fetching required here (visuals use static showcase data +
//  real YouTube thumbnails already allowed by next.config remotePatterns).
// ============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Sparkles,
  Play,
  Search,
  ListMusic,
  Heart,
  ListEnd,
  Download,
  Radio,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  TrendingUp,
} from "lucide-react";
import AnimatedWaveform from "@/components/ui/AnimatedWaveform";

// three.js kept out of the initial bundle; only mounts on capable viewports.
const ThreeHeroScene = dynamic(() => import("@/components/3d/ThreeHeroScene"), {
  ssr: false,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// ------------------------------ Demo data ------------------------------- //
const FEATURED = [
  { id: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd", tag: "Editor’s Pick" },
  { id: "b1kbLwvqugk", title: "Flowers", artist: "Miley Cyrus", tag: "New Release" },
  { id: "TUVcZfQe-Kw", title: "Levitating", artist: "Dua Lipa", tag: "Top Album" },
  { id: "mRD0-GxqHVo", title: "Heat Waves", artist: "Glass Animals", tag: "Trending" },
  { id: "H5v3kku4y6Q", title: "As It Was", artist: "Harry Styles", tag: "Artist Spotlight" },
];

const TRENDING = [
  { id: "JGwWNGJdvx8", title: "Shape of You", artist: "Ed Sheeran" },
  { id: "DyDfgMOUjCI", title: "bad guy", artist: "Billie Eilish" },
  { id: "kTJczUoc26U", title: "Stay", artist: "The Kid LAROI" },
  { id: "E07s5ZYygMg", title: "Watermelon Sugar", artist: "Harry Styles" },
  { id: "tQ0yjYUFKAE", title: "Peaches", artist: "Justin Bieber" },
];

const MOODS = [
  { label: "Chill", emoji: "🌊" },
  { label: "Focus", emoji: "🎯" },
  { label: "Happy", emoji: "☀️" },
  { label: "Sad", emoji: "🌧️" },
  { label: "Gym", emoji: "⚡" },
  { label: "Party", emoji: "🎉" },
  { label: "Romantic", emoji: "💜" },
  { label: "Lo-fi", emoji: "🎧" },
  { label: "Travel", emoji: "✈️" },
  { label: "Deep Work", emoji: "🧠" },
];

const FEATURES = [
  { icon: Search, title: "Discover", desc: "Search songs, artists, albums, genres, and moods." },
  { icon: ListMusic, title: "Playlists", desc: "Create and manage your own sound collections." },
  { icon: Heart, title: "Liked Songs", desc: "Save the tracks you love in one glowing place." },
  { icon: ListEnd, title: "Smart Queue", desc: "A seamless, uninterrupted now-playing queue." },
  { icon: Download, title: "Downloads", desc: "Keep selected tracks available offline." },
  { icon: Sparkles, title: "Recommendations", desc: "Personalized suggestions tuned to your taste." },
];

const COLLECTIONS = [
  { name: "Chill Mix", grad: "from-nova-blue/40 to-nova-cyan/30" },
  { name: "Night Drive", grad: "from-indigo-600/40 to-nova-blue/30" },
  { name: "Focus Flow", grad: "from-nova-cyan/30 to-emerald-500/25" },
  { name: "Workout Energy", grad: "from-orange-500/35 to-nova-blue/25" },
  { name: "Late Night Lo-fi", grad: "from-violet-600/40 to-nova-cyan/20" },
  { name: "Feel Good Hits", grad: "from-pink-500/35 to-nova-blue/25" },
];

// --------------------------- Small helpers ------------------------------ //
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const NAV_LINKS = ["Home", "Discover", "Trending", "Playlists", "Mood Match", "Premium"];

// ================================ Page ================================== //
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Only mount WebGL on wider viewports without a reduced-motion preference.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnable3D(window.innerWidth >= 768 && !reduce);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* ============================ Navbar ============================ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.08] bg-nova-bg/70 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
              <Sparkles size={16} className="text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Nova</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {l}
                <span className="absolute inset-x-4 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-nova-blue to-nova-cyan transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-5 py-2 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ============================= Hero ============================= */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
        {/* 3D scene / fallback glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          {enable3D ? (
            <div className="absolute right-0 top-0 h-full w-full md:w-3/5">
              <ThreeHeroScene />
            </div>
          ) : (
            <div className="absolute right-[-10%] top-1/4 h-[420px] w-[420px] animate-float rounded-full bg-gradient-to-br from-nova-blue/40 to-nova-cyan/30 blur-[120px]" />
          )}
          <div className="absolute left-1/4 top-1/3 h-[360px] w-[360px] rounded-full bg-nova-blue/15 blur-[140px]" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="pill"
            >
              <Sparkles size={13} className="text-nova-cyan" />
              Next-Gen Music Streaming
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.06 }}
              className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
            >
              Feel Music In{" "}
              <span className="text-gradient text-glow">Another Dimension</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}
              className="mt-6 max-w-lg text-lg text-white/60"
            >
              Nova transforms songs, albums, playlists, and moods into an
              immersive 3D music universe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-7 py-3.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
              >
                <Play size={16} className="fill-black" />
                Start Listening
              </Link>
              <Link
                href="/trending"
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:border-white/30"
              >
                <TrendingUp size={16} />
                Explore Trending
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {["Mood Match", "Smart Playlists", "Trending Tracks", "Immersive Player", "Offline Access"].map(
                (p) => (
                  <span key={p} className="pill">
                    {p}
                  </span>
                )
              )}
            </motion.div>
          </div>

          {/* Floating glass mini-player */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="relative mx-auto hidden w-full max-w-sm lg:block"
          >
            <div className="glass-strong animate-float rounded-3xl p-5 shadow-glass-lg">
              <div className="flex items-center gap-4">
                <Image
                  src={thumb(FEATURED[0].id)}
                  alt={FEATURED[0].title}
                  width={72}
                  height={72}
                  unoptimized
                  className="h-[72px] w-[72px] rounded-2xl object-cover shadow-lg ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{FEATURED[0].title}</p>
                  <p className="truncate text-sm text-white/50">{FEATURED[0].artist}</p>
                  <div className="mt-2">
                    <AnimatedWaveform bars={14} heightClass="h-6" />
                  </div>
                </div>
              </div>
              <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-white/70">
                <Shuffle size={16} />
                <SkipBack size={18} className="fill-current" />
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black shadow-glow-cyan">
                  <Play size={18} className="translate-x-[1px] fill-black" />
                </span>
                <SkipForward size={18} className="fill-current" />
                <Repeat size={16} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================= Featured showcase ===================== */}
      <Section title="Featured On Nova" subtitle="Top albums, trending songs, editor’s picks & new releases">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURED.map((s, i) => (
            <ShowcaseCard key={s.id} {...s} index={i} />
          ))}
        </div>
      </Section>

      {/* ========================== Trending =========================== */}
      <Section title="Trending Right Now" subtitle="Viral tracks, top artists & weekly charts">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {TRENDING.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 backdrop-blur-xl transition-all hover:border-nova-cyan/25 hover:bg-white/[0.05]">
                <span className="w-6 text-center text-lg font-bold text-white/30">{i + 1}</span>
                <Image
                  src={thumb(s.id)}
                  alt={s.title}
                  width={52}
                  height={52}
                  unoptimized
                  className="h-[52px] w-[52px] rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{s.title}</p>
                  <p className="truncate text-sm text-white/50">{s.artist}</p>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <AnimatedWaveform bars={5} heightClass="h-6" />
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black opacity-0 transition-opacity group-hover:opacity-100">
                  <Play size={16} className="translate-x-[1px] fill-black" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* =========================== Mood Match =========================== */}
      <Section title="Your Mood. Your Soundtrack." subtitle="Select a feeling and let Nova recommend music based on your vibe, history, and taste">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative flex items-center justify-center py-8">
              <div className="absolute h-56 w-56 animate-glow-pulse rounded-full bg-gradient-to-br from-nova-blue/40 to-nova-cyan/40 blur-3xl" />
              <div className="animate-spin-slow relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-nova-blue/20 to-nova-cyan/10 backdrop-blur-xl">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
                  <Sparkles size={40} className="text-black" />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-6 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <span key={m.label} className="pill cursor-default hover:border-nova-cyan/30 hover:text-white">
                  <span>{m.emoji}</span>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="glass rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-nova-cyan">
                Recommendation Preview
              </p>
              <div className="mt-3 flex items-center gap-4">
                <Image
                  src={thumb("mRD0-GxqHVo")}
                  alt="Heat Waves"
                  width={56}
                  height={56}
                  unoptimized
                  className="h-14 w-14 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">Heat Waves</p>
                  <p className="truncate text-sm text-white/50">Glass Animals · matches “Chill”</p>
                </div>
                <span className="rounded-full bg-nova-cyan/15 px-3 py-1 text-xs font-semibold text-nova-cyan">
                  98% match
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================== Features =========================== */}
      <Section title="Everything You Need For Music" subtitle="A complete, music-first streaming toolkit">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-nova-cyan/25 hover:shadow-glow-cyan">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-nova-blue/25 to-nova-cyan/20 ring-1 ring-white/10 transition-transform group-hover:scale-110">
                  <f.icon size={22} className="text-nova-cyan" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm text-white/50">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ==================== Artists & Albums universe ================ */}
      <Section title="Explore Artists And Albums" subtitle="Featured artists, new albums, top charts & curated collections">
        <div className="no-scrollbar mb-6 flex gap-6 overflow-x-auto pb-2">
          {FEATURED.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05} className="flex-shrink-0">
              <div className="flex w-28 flex-col items-center text-center">
                <Image
                  src={thumb(s.id)}
                  alt={s.artist}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-24 w-24 rounded-full object-cover ring-1 ring-white/10 transition-all hover:ring-2 hover:ring-nova-cyan/40"
                />
                <p className="mt-3 truncate text-sm font-medium text-white">{s.artist}</p>
                <p className="text-xs text-white/40">Artist</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TRENDING.map((s, i) => (
            <ShowcaseCard key={s.id} {...s} tag="Album" index={i} />
          ))}
        </div>
      </Section>

      {/* ======================== Player preview ======================= */}
      <Section title="A Player That Feels Alive" subtitle="Smooth controls, immersive feedback, animated waveforms, and a smart queue">
        <Reveal>
          <div className="glass-strong mx-auto max-w-3xl rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Image
                src={thumb(FEATURED[2].id)}
                alt={FEATURED[2].title}
                width={140}
                height={140}
                unoptimized
                className="h-32 w-32 rounded-2xl object-cover shadow-glass ring-1 ring-white/10"
              />
              <div className="w-full flex-1">
                <p className="text-xl font-bold text-white">{FEATURED[2].title}</p>
                <p className="text-white/50">{FEATURED[2].artist}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs tabular-nums text-white/40">1:24</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan" />
                  </div>
                  <span className="text-xs tabular-nums text-white/40">3:23</span>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-5 text-white/70">
                    <Shuffle size={18} />
                    <SkipBack size={20} className="fill-current" />
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black shadow-glow-cyan">
                      <Play size={20} className="translate-x-[1px] fill-black" />
                    </span>
                    <SkipForward size={20} className="fill-current" />
                    <Repeat size={18} />
                  </div>
                  <div className="hidden items-center gap-3 text-white/60 sm:flex">
                    <Heart size={18} className="fill-nova-cyan text-nova-cyan" />
                    <Volume2 size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ====================== Playlist collections =================== */}
      <Section title="Build Your Sound Library" subtitle="Curated mixes for every moment">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <div className={`group aspect-square overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br ${c.grad} p-4 transition-transform hover:-translate-y-1.5`}>
                <div className="flex h-full flex-col justify-between">
                  <Radio size={22} className="text-white/80" />
                  <p className="text-sm font-bold text-white">{c.name}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* =========================== Final CTA ========================= */}
      <section className="relative overflow-hidden px-6 py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse rounded-full bg-gradient-to-br from-nova-blue/30 to-nova-cyan/25 blur-[160px]" />
        </div>
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
            <Sparkles size={28} className="text-black" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Nova Is Not Just Music.{" "}
            <span className="text-gradient text-glow">It’s A Dimension.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
            Step into a futuristic music experience built for discovery, mood,
            playlists, and sound.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-8 py-3.5 text-sm font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03]"
            >
              Enter Nova
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/15 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-colors hover:border-white/30"
            >
              Create Account
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ============================ Footer =========================== */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nova-blue to-nova-cyan">
              <Sparkles size={14} className="text-black" />
            </div>
            <span className="font-bold text-white">Nova</span>
          </div>
          <p className="text-sm text-white/40">
            © 2026 Nova · A new-generation music universe.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ------------------------- Reusable sections ---------------------------- //
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <Reveal className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-white/50">{subtitle}</p>}
      </Reveal>
      {children}
    </section>
  );
}

function ShowcaseCard({
  id,
  title,
  artist,
  tag,
  index = 0,
}: {
  id: string;
  title: string;
  artist: string;
  tag?: string;
  index?: number;
}) {
  return (
    <Reveal delay={index * 0.05}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:shadow-glow-cyan">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
          <Image
            src={thumb(id)}
            alt={title}
            fill
            sizes="(max-width:768px) 45vw, 200px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {tag && (
            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-nova-cyan backdrop-blur-md">
              {tag}
            </span>
          )}
          <span className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black opacity-0 shadow-glow-cyan transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Play size={16} className="translate-x-[1px] fill-black" />
          </span>
        </div>
        <div className="mt-3 px-1">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className="truncate text-xs text-white/50">{artist}</p>
        </div>
      </div>
    </Reveal>
  );
}
