"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Glowing mood tile linking into the Mood AI flow. Big emoji + gradient glow.

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
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group relative flex aspect-[4/3] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br ${gradient} p-4`}
    >
      {/* Glow blob */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <span className="text-3xl drop-shadow-lg">{emoji}</span>
      <span className="text-base font-bold tracking-tight text-white">{label}</span>
    </motion.div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return <div onClick={onClick}>{inner}</div>;
}
