"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

// Compact centered mood tile — emoji + label stacked in the middle,
// with hover-reveal play button and subtle glassmorphism.

interface Props {
  label: string;
  emoji: string;
  gradient: string;
  href?: string;
  index?: number;
  onClick?: () => void;
}

export default function MoodCard({ label, emoji, gradient, href, index = 0, onClick }: Props) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br ${gradient} p-4 shadow-lg transition-shadow duration-500 hover:shadow-xl hover:shadow-white/[0.06]`}
    >
      {/* Ambient glow orb — top right */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/[0.15] blur-3xl opacity-50 transition-all duration-700 group-hover:scale-150 group-hover:opacity-100" />

      {/* Secondary glow orb — bottom left */}
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-white/[0.08] blur-3xl opacity-0 transition-all duration-700 group-hover:opacity-80" />

      {/* Frosted glass overlay on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/[0.08] bg-white/[0.02] opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100" />

      {/* Centered emoji + label */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <span className="text-3xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">
          {emoji}
        </span>
        <span className="text-sm font-bold tracking-tight text-white drop-shadow-md text-center leading-tight">
          {label}
        </span>
      </div>

      {/* Play icon — bottom-right on hover */}
      <div className="absolute bottom-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all duration-400 group-hover:opacity-100 group-hover:scale-100 scale-75">
        <Play size={12} className="fill-white text-white ml-0.5" />
      </div>

      {/* Shimmer line on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </motion.div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return <div onClick={onClick}>{inner}</div>;
}
