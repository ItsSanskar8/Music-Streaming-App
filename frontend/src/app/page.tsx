"use client";

// ============================================================================
//  NOVA — Cinematic Landing Page v4.
//  • Dramatic hero with staggered text reveals, floating 3D orbs
//  • Animated gradient text that shifts
//  • Section dividers between content blocks
//  • Scroll-triggered parallax and reveals
//  • Floating glass mini-player with animated disc
//  • Particle-like glowing background elements
// ============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Music2,
  Disc3,
  Waves,
} from "lucide-react";
import AnimatedWaveform from "@/components/ui/AnimatedWaveform";
import ScrollProgress from "@/components/ui/ScrollProgress";

const ThreeHeroScene = dynamic(() => import("@/components/3d/ThreeHeroScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-br from-nova-blue/20 to-nova-cyan/15 blur-[100px]" />
  ),
});

// ── Constants ───────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// ── Demo data ───────────────────────────────────────────────────────────
const FEATURED = [
  { id: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd", tag: "Editor's Pick" },
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
  { label: "Chill", emoji: "🌊" }, { label: "Focus", emoji: "🎯" },
  { label: "Happy", emoji: "☀️" }, { label: "Sad", emoji: "🌧️" },
  { label: "Gym", emoji: "⚡" }, { label: "Party", emoji: "🎉" },
  { label: "Romantic", emoji: "💜" }, { label: "Lo-fi", emoji: "🎧" },
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

// ── Reusable animation helpers ──────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
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

/** Staggered word reveal animation for headings */
function AnimatedHeading({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-[0.25em]">
          <motion.span
            initial={{ opacity: 0, y: "100%", skewY: -4 }}
            animate={{ opacity: 1, y: "0%", skewY: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.6 + i * 0.08 }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Nav links — all same-page anchors using #id for smooth scroll.
// No app-route navigation here to avoid AuthGuard redirects.
const NAV_LINKS = [
  { label: "Home", href: "/#hero" },
  { label: "Discover", href: "/#features" },
  { label: "Trending", href: "/#trending" },
  { label: "Playlists", href: "/#collections" },
  { label: "Mood Match", href: "/#mood-match" },
  { label: "Premium", href: "/#features" },
] as const;

// ── Floating glowing orbs (decorative) ──────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-5 overflow-hidden">
      {/* Orb 1 - top right */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[15%] top-[18%] h-32 w-32 rounded-full bg-nova-cyan/20 blur-[80px]"
      />
      {/* Orb 2 - middle left */}
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-[10%] top-[40%] h-40 w-40 rounded-full bg-nova-blue/20 blur-[100px]"
      />
      {/* Orb 3 - bottom */}
      <motion.div
        animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute right-[30%] top-[60%] h-24 w-24 rounded-full bg-nova-violet/15 blur-[70px]"
      />
      {/* Morphing blob */}
      <motion.div
        animate={{
          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute left-[5%] top-[20%] h-48 w-48 border border-white/[0.03] bg-gradient-to-br from-nova-blue/8 to-nova-cyan/5 blur-[60px]"
      />
    </div>
  );
}

// ── Section divider ─────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="section-divider" />
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [enable3D, setEnable3D] = useState(false);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnable3D(window.innerWidth >= 768 && !reduce);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const SECTIONS = [
    { id: "hero", label: "Home" },
    { id: "featured", label: "Featured" },
    { id: "trending", label: "Trending" },
    { id: "mood-match", label: "Mood Match" },
    { id: "features", label: "Features" },
    { id: "artists-albums", label: "Artists" },
    { id: "player", label: "Player" },
    { id: "collections", label: "Collections" },
    { id: "cta", label: "Get Started" },
  ] as const;

  return (
    <div className="relative min-h-screen">
      {/* ── Scroll Progress Indicator ── */}
      <ScrollProgress sections={SECTIONS} />
      {/* ── Navbar ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.08] bg-nova-bg/70 backdrop-blur-3xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan transition-shadow group-hover:shadow-glow-blue"
            >
              <Sparkles size={16} className="text-black" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-white">Nova</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {label}
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
              className="rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-5 py-2 text-sm font-semibold text-black shadow-glow-blue transition-all hover:scale-[1.04] hover:shadow-glow-cyan"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Full-page 3D background — renders behind all sections ── */}
      {enable3D && <ThreeHeroScene />}

      {/* Fallback gradient blobs when 3D is disabled */}
      {!enable3D && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 3, -2, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-5%] top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-nova-blue/30 to-nova-cyan/20 blur-[140px]"
          />
          <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-nova-violet/15 blur-[120px]" />
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <motion.section
        id="hero"
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="scroll-mt-0 relative flex min-h-screen items-center overflow-hidden px-6 pt-24"
      >
        <FloatingOrbs />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            {/* Pill badge — animated entrance */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="pill animate-gradient-shift bg-gradient-to-r from-nova-blue/15 via-nova-cyan/15 to-nova-blue/15">
                <Sparkles size={13} className="text-nova-cyan" />
                Next-Gen Music Streaming
              </span>
            </motion.div>

            {/* Main heading — split word reveal */}
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
              <AnimatedHeading text="Feel Music In" />
              <br />
              <span className="mt-2 inline-block text-gradient text-glow-strong">
                <AnimatedHeading text="Another Dimension" />
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 1.2 }}
              className="mt-6 max-w-lg text-lg text-white/60 leading-relaxed"
            >
              Nova transforms songs, albums, playlists, and moods into an
              immersive music universe.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 1.4 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/signup"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-7 py-3.5 text-sm font-semibold text-black shadow-glow-blue transition-all hover:scale-[1.03] hover:shadow-glow-cyan"
              >
                <motion.span
                  className="absolute inset-0 -z-10 bg-gradient-to-r from-nova-cyan to-nova-blue opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <Play size={16} className="fill-black transition-transform group-hover:scale-110" />
                Start Listening
              </Link>
              <Link
                href="/trending"
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/[0.08]"
              >
                <TrendingUp size={16} />
                Explore Trending
              </Link>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {["Mood Match", "Smart Playlists", "Trending Tracks", "Immersive Player"].map(
                (p, i) => (
                  <motion.span
                    key={p}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 1.8 + i * 0.08 }}
                    className="pill cursor-default"
                  >
                    {p}
                  </motion.span>
                )
              )}
            </motion.div>
          </div>

          {/* Floating mini-player */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.8 }}
            className="relative mx-auto hidden w-full max-w-sm lg:block"
          >
            {/* Glow behind */}
            <motion.div
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-nova-blue/20 via-nova-cyan/15 to-nova-violet/10 blur-[60px]"
            />

            <div className="glass-strong relative animate-float rounded-3xl p-5 shadow-glass-lg">
              {/* Now playing header */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-nova-cyan/20">
                  <div className="h-2 w-2 rounded-full bg-nova-cyan animate-pulse-ring-fast" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-nova-cyan">
                  Now Playing
                </span>
              </div>

              {/* Album art with disc effect */}
              <div className="group relative flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={thumb(FEATURED[0].id)}
                    alt={FEATURED[0].title}
                    width={72}
                    height={72}
                    unoptimized
                    className="h-[72px] w-[72px] rounded-2xl object-cover shadow-lg ring-1 ring-white/10"
                  />
                  {/* Spinning disc ring on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="animate-spin-slow h-full w-full rounded-2xl border-2 border-transparent border-t-nova-cyan/40 border-r-nova-blue/30" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white text-base">{FEATURED[0].title}</p>
                  <p className="truncate text-sm text-white/50">{FEATURED[0].artist}</p>
                  <div className="mt-2">
                    <AnimatedWaveform bars={14} heightClass="h-6" />
                  </div>
                </div>
              </div>

              {/* Seek bar */}
              <div className="mt-5">
                <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: ["40%", "42%", "39%", "41%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-nova-blue via-nova-cyan to-nova-violet"
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-white/40">
                  <span>1:24</span>
                  <span>3:23</span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-center gap-5 text-white/70">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Shuffle size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <SkipBack size={18} className="fill-current" />
                </motion.button>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black shadow-glow-cyan"
                >
                  <Play size={20} className="translate-x-[1px] fill-black" />
                </motion.div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <SkipForward size={18} className="fill-current" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Repeat size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── FEATURED ── */}
      <Section id="featured" title="Featured On Nova" subtitle="Top albums, trending songs, editor's picks & new releases">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURED.map((s, i) => (
            <ShowcaseCard key={s.id} {...s} index={i} />
          ))}
        </div>
      </Section>

      {/* ── SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── TRENDING ── */}
      <Section id="trending" title="Trending Right Now" subtitle="Viral tracks, top artists & weekly charts">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {TRENDING.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <motion.div
                whileHover={{ x: 4 }}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 backdrop-blur-xl transition-all hover:border-nova-cyan/25 hover:bg-white/[0.06] hover:shadow-glow-cyan/10"
              >
                {/* Animated rank */}
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-lg font-bold text-white/30"
                >
                  {i + 1}
                </motion.span>
                <Image
                  src={thumb(s.id)}
                  alt={s.title}
                  width={52}
                  height={52}
                  unoptimized
                  className="h-[52px] w-[52px] rounded-xl object-cover ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{s.title}</p>
                  <p className="truncate text-sm text-white/50">{s.artist}</p>
                </div>
                <div className="opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <AnimatedWaveform bars={5} heightClass="h-6" />
                </div>
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black opacity-0 shadow-glow-cyan transition-all duration-300 group-hover:opacity-100"
                >
                  <Play size={16} className="translate-x-[1px] fill-black" />
                </motion.span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── MOOD MATCH ── */}
      <Section id="mood-match" title="Your Mood. Your Soundtrack." subtitle="Select a feeling and let Nova recommend music based on your vibe">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative flex items-center justify-center py-8">
              {/* Morphing animated blob */}
              <motion.div
                animate={{
                  borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 50% 50% / 50% 50% 50% 50%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-56 w-56 animate-glow-pulse rounded-full bg-gradient-to-br from-nova-blue/40 to-nova-cyan/40 blur-3xl"
              />
              {/* Outer rotating ring */}
              <div className="animate-spin-slow relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-nova-blue/20 to-nova-cyan/10 backdrop-blur-xl shadow-glass-lg">
                {/* Inner fixed content */}
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
                  <Sparkles size={40} className="text-black" />
                </div>
              </div>
              {/* Orbiting particle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute h-52 w-52"
              >
                <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-nova-cyan shadow-glow-cyan" />
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-6 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <span key={m.label} className="pill cursor-default hover:border-nova-cyan/30 hover:text-white transition-colors">
                  <span>{m.emoji}</span>
                  {m.label}
                </span>
              ))}
            </div>
            <div className="glass-dynamic rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-nova-cyan">
                <Waves size={13} className="inline mr-1" />
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
                  <p className="truncate text-sm text-white/50">Glass Animals · matches "Chill"</p>
                </div>
                <motion.span
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-full bg-nova-cyan/15 px-3 py-1 text-xs font-semibold text-nova-cyan"
                >
                  98% match
                </motion.span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── FEATURES ── */}
      <Section id="features" title="Everything You Need For Music" subtitle="A complete, music-first streaming toolkit">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group h-full rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:border-nova-cyan/25 hover:shadow-glow-cyan"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-nova-blue/25 to-nova-cyan/20 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:from-nova-blue/35 group-hover:to-nova-cyan/30">
                  <f.icon size={22} className="text-nova-cyan" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm text-white/50">{f.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── ARTISTS & ALBUMS ── */}
      <Section id="artists-albums" title="Explore Artists And Albums" subtitle="Featured artists, new albums, top charts & curated collections">
        <div className="no-scrollbar mb-6 flex gap-6 overflow-x-auto pb-2">
          {FEATURED.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05} className="flex-shrink-0">
              <motion.div
                whileHover={{ y: -3 }}
                className="flex w-28 flex-col items-center text-center"
              >
                <div className="relative">
                  <Image
                    src={thumb(s.id)}
                    alt={s.artist}
                    width={96}
                    height={96}
                    unoptimized
                    className="h-24 w-24 rounded-full object-cover ring-1 ring-white/10 transition-all duration-300 hover:ring-2 hover:ring-nova-cyan/40 hover:shadow-glow-cyan"
                  />
                  <motion.div
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-nova-blue/20 to-nova-cyan/20 opacity-0 transition-opacity duration-300"
                  />
                </div>
                <p className="mt-3 truncate text-sm font-medium text-white">{s.artist}</p>
                <p className="text-xs text-white/40">Artist</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TRENDING.map((s, i) => (
            <ShowcaseCard key={s.id} {...s} tag="Album" index={i} />
          ))}
        </div>
      </Section>

      {/* ── SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── PLAYER PREVIEW ── */}
      <Section id="player" title="A Player That Feels Alive" subtitle="Smooth controls, immersive feedback, animated waveforms, and a smart queue">
        <Reveal>
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="glass-strong mx-auto max-w-3xl rounded-3xl p-6 sm:p-8 shadow-glass-lg"
          >
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              {/* Animated disc art */}
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="relative flex-shrink-0"
              >
                <Image
                  src={thumb(FEATURED[2].id)}
                  alt={FEATURED[2].title}
                  width={140}
                  height={140}
                  unoptimized
                  className="h-32 w-32 rounded-2xl object-cover shadow-glass ring-1 ring-white/10"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 right-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nova-cyan/80 shadow-lg">
                    <Disc3 size={16} className="text-black" />
                  </div>
                </div>
              </motion.div>
              <div className="w-full flex-1">
                <p className="text-xl font-bold text-white">{FEATURED[2].title}</p>
                <p className="text-white/50">{FEATURED[2].artist}</p>
                {/* Animated seek bar */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs tabular-nums text-white/40">1:24</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ width: ["30%", "34%", "29%", "33%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-nova-blue via-nova-cyan to-nova-violet"
                    />
                  </div>
                  <span className="text-xs tabular-nums text-white/40">3:23</span>
                </div>
                {/* Controls */}
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 sm:gap-5 text-white/70">
                    {[Shuffle, SkipBack, null, SkipForward, Repeat].map((Icon, i) =>
                      Icon ? (
                        <motion.button key={i} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                          <Icon size={18} className={i === 0 || i === 4 ? "" : "fill-current"} />
                        </motion.button>
                      ) : (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.94 }}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black shadow-glow-cyan"
                        >
                          <Play size={20} className="translate-x-[1px] fill-black" />
                        </motion.div>
                      )
                    )}
                  </div>
                  <div className="hidden items-center gap-3 text-white/60 sm:flex">
                    <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                      <Heart size={18} className="fill-nova-cyan text-nova-cyan" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
                      <Volume2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </Section>

      {/* ── SECTION DIVIDER ── */}
      <SectionDivider />

      {/* ── PLAYLIST COLLECTIONS ── */}
      <Section id="collections" title="Build Your Sound Library" subtitle="Curated mixes for every moment">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group aspect-square overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br ${c.grad} p-4 shadow-glass transition-all duration-300 hover:shadow-glow-cyan`}
              >
                <div className="flex h-full flex-col justify-between">
                  <Radio size={22} className="text-white/80 transition-transform group-hover:scale-110" />
                  <div>
                    <p className="text-sm font-bold text-white">{c.name}</p>
                    <p className="text-xs text-white/40">Curated mix</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── FINAL CTA ── */}
      <section id="cta" className="scroll-mt-20 relative overflow-hidden px-6 py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-nova-blue/30 to-nova-cyan/25 blur-[160px]"
          />
        </div>
        <Reveal className="mx-auto max-w-3xl text-center">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan"
          >
            <Sparkles size={28} className="text-black" />
          </motion.div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl leading-[1.1]">
            Nova Is Not Just Music.{" "}
            <span className="text-gradient text-glow-strong">It's A Dimension.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/60 leading-relaxed">
            Step into a futuristic music experience built for discovery, mood,
            playlists, and sound.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-8 py-3.5 text-sm font-semibold text-black shadow-glow-blue transition-all hover:scale-[1.03] hover:shadow-glow-cyan"
            >
              Enter Nova
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/15 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/[0.08]"
            >
              Create Account
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-nova-blue to-nova-cyan"
            >
              <Sparkles size={14} className="text-black" />
            </motion.div>
            <span className="font-bold text-white">Nova</span>
          </div>
          <p className="text-sm text-white/40">
            &copy; 2026 Nova &middot; A new-generation music universe.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Reusable Section wrapper ────────────────────────────────────────────
function Section({ id, title, subtitle, children }: {
  id?: string; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <Reveal className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-2xl text-white/50">{subtitle}</p>}
      </Reveal>
      {children}
    </section>
  );
}

// ── Showcase card ───────────────────────────────────────────────────────
function ShowcaseCard({ id, title, artist, tag, index = 0 }: {
  id: string; title: string; artist: string; tag?: string; index?: number;
}) {
  return (
    <Reveal delay={index * 0.05}>
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 backdrop-blur-xl transition-all hover:border-nova-cyan/20 hover:shadow-glow-cyan"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
          <Image
            src={thumb(id)}
            alt={title}
            fill
            sizes="(max-width:768px) 45vw, 200px"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {tag && (
            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-nova-cyan backdrop-blur-md">
              {tag}
            </span>
          )}
          <motion.span
            whileHover={{ scale: 1.06 }}
            className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-gradient-to-br from-nova-blue to-nova-cyan text-black opacity-0 shadow-glow-cyan transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Play size={16} className="translate-x-[1px] fill-black" />
          </motion.span>
        </div>
        <div className="mt-3 px-1">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className="truncate text-xs text-white/50">{artist}</p>
        </div>
      </motion.div>
    </Reveal>
  );
}
