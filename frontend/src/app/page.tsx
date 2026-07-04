"use client";

// Landing page — minimalist Apple hero with generous whitespace.

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Soft depth: a single, very subtle radial glow (no neon). */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-nova-cyan/10 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-nova-secondary backdrop-blur-2xl"
      >
        <Sparkles size={14} className="text-nova-cyan" />
        Keyless streaming · Local mood AI
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        className="max-w-3xl text-5xl font-bold tracking-tight text-nova-primary sm:text-7xl"
      >
        Music, in its
        <br />
        purest form.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
        className="mt-6 max-w-xl text-lg font-medium text-nova-secondary"
      >
        Stream anything, download instantly, and let Nova read the mood — all
        without a single API key.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
      >
        <Link
          href="/signup"
          className="rounded-full bg-nova-primary px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold text-nova-primary backdrop-blur-2xl transition-colors hover:bg-white/10"
        >
          Sign In
        </Link>
      </motion.div>
    </div>
  );
}
