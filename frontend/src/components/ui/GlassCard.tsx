"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Frosted-glass surface with an optional hover lift + glow. The base building
// block for cards and panels across Nova.

interface Props {
  children: ReactNode;
  className?: string;
  /** Adds a hover lift + cyan glow when true. */
  interactive?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = "",
  interactive = false,
  onClick,
}: Props) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        interactive
          ? { y: -6, boxShadow: "0 24px 80px rgba(0,0,0,0.65), 0 0 40px -8px rgba(0,245,212,0.35)" }
          : undefined
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
