"use client";

// MoodGlow — a fixed full-page ambient background tint that shifts by mood.
// Replaces the duplicated motion.div pattern used across all content pages.
// Positioned at -z-10 so it sits behind everything.

import { motion } from "framer-motion";
import { moodGlowColor } from "@/lib/moodGlow";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  mood: string | undefined | null;
}

export default function MoodGlow({ mood }: Props) {
  return (
    <motion.div
      key={mood || "none"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: moodGlowColor(mood) }}
    />
  );
}
