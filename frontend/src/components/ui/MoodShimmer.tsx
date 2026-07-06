"use client";

// MoodShimmer — a fixed, animated diagonal sweep overlay that shifts tint by mood.
// Positioned between the ambient glow (-z-10) and page content for a subtle
// cinematic shimmer that never distracts. Pure CSS animation, zero JS overhead.

import { motion } from "framer-motion";
import { moodShimmerColor } from "@/lib/moodGlow";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  mood: string | undefined | null;
}

export default function MoodShimmer({ mood }: Props) {
  return (
    <motion.div
      key={mood || "none"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="pointer-events-none fixed inset-0 animate-mood-shimmer"
      style={{
        zIndex: -5,
        background: `linear-gradient(
          135deg,
          transparent 0%,
          transparent 28%,
          ${moodShimmerColor(mood)} 46%,
          transparent 52%,
          transparent 72%,
          ${moodShimmerColor(mood)} 78%,
          transparent 84%,
          transparent 100%
        )`,
        backgroundSize: "300% 300%",
        backgroundPosition: "0% 50%",
      }}
    />
  );
}
