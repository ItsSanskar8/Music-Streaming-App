"use client";

// Reusable Apple-style frosted glass card with a subtle hover lift.

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface AppleCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  delay?: number;
}

export default function AppleCard({
  children,
  className = "",
  onClick,
  hover = true,
  delay = 0,
}: AppleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      whileHover={hover ? { scale: 1.02 } : undefined}
      onClick={onClick}
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-apple ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
