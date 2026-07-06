"use client";

// MoodRadial — a mood-matched radial gradient halo that sits behind album art.
// Wraps the motion.div pattern used on the dashboard hero so it can be reused
// on any cover art (now-playing, album detail, etc.).

import { motion } from "framer-motion";
import { moodRadialGradient } from "@/lib/moodGlow";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  /** The mood string that drives the gradient color. */
  mood: string | undefined | null;
  /** Tailwind inset override. Defaults to "-inset-12" (3rem spread). */
  inset?: string;
  /** Additional classes for the wrapper. */
  className?: string;
}

export default function MoodRadial({
  mood,
  inset = "-inset-12",
  className = "",
}: Props) {
  return (
    <motion.div
      key={mood || "none"}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`pointer-events-none absolute ${inset} ${className}`}
      style={{ background: moodRadialGradient(mood) }}
    />
  );
}
