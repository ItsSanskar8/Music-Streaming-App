"use client";

// Premium — a celebratory "it's free for you" section. Every premium perk is
// unlocked at no cost; the hero pairs a heart with surprise emojis per request.

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  Infinity as InfinityIcon,
  AudioLines,
  BellOff,
  Download,
  ListMusic,
  Sparkles,
  Youtube,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

const EASE = [0.22, 1, 0.36, 1] as const;

const PERKS = [
  { icon: InfinityIcon, title: "Unlimited streaming", desc: "Play as much as you want, whenever you want." },
  { icon: AudioLines, title: "High-quality audio", desc: "Crisp, full-fidelity sound on every track." },
  { icon: BellOff, title: "Ad-free listening", desc: "No interruptions — just the music." },
  { icon: Download, title: "Offline downloads", desc: "Save songs as MP3 and take them anywhere." },
  { icon: ListMusic, title: "Unlimited playlists", desc: "Build and share as many playlists as you like." },
  { icon: Sparkles, title: "Mood AI & Mood Match", desc: "Smart, mood-aware mixes tuned to how you feel." },
  { icon: Youtube, title: "Real-time library", desc: "Fresh tracks streamed live — nothing locked away." },
];

export default function PremiumPage() {
  return (
    <AuthGuard>
      <div className="relative px-5 py-8 sm:px-8">
        {/* Ambient premium glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-nova-violet/15 via-nova-blue/5 to-transparent blur-2xl" />

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-nova-gold/30 to-nova-violet/20 border border-white/[0.1] shadow-glow-violet">
            <Crown size={36} className="text-nova-gold" />
          </div>

          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-nova-cyan/25 bg-nova-cyan/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-nova-cyan">
            Nova Premium
          </span>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            It&apos;s free for you{" "}
            <span className="whitespace-nowrap" aria-label="love and surprise">
              ❤️ 🎉 🎁 🥳 ✨
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base text-white/55">
            Surprise! Every Premium perk is unlocked on your account at{" "}
            <span className="font-semibold text-white">no cost, forever</span>. No
            card, no trial, no catch — just enjoy the music.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="flex items-baseline gap-1 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-6 py-3 backdrop-blur-xl">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-sm font-medium text-white/45">/ forever</span>
              <span className="ml-2 text-sm text-white/35 line-through">$9.99</span>
            </span>
          </div>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-violet via-nova-blue to-nova-cyan px-8 py-3 text-sm font-semibold text-black shadow-glow-violet transition-transform hover:scale-[1.03]"
          >
            <Sparkles size={16} className="fill-[#F5F0EB]" />
            Start listening
          </Link>
        </motion.div>

        {/* Perks grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2"
        >
          {PERKS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.2 + i * 0.05 }}
              className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-nova-cyan/25 hover:shadow-glow-emerald"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-nova-blue/25 to-nova-cyan/10 border border-white/[0.08]">
                <Icon size={20} className="text-nova-cyan" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{title}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-nova-cyan/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-nova-cyan">
                    <Check size={10} strokeWidth={3} />
                    Free
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/50">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-12 max-w-xl text-center text-sm text-white/40"
        >
          Consider it our gift to you 🎁 — the whole Nova experience, unlocked. ❤️
        </motion.p>
      </div>
    </AuthGuard>
  );
}
