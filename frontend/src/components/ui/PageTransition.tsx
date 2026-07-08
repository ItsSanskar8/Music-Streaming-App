"use client";

// ============================================================================
//  PageTransition — wraps page content in a motion.div keyed on the route
//  pathname so every navigation triggers a smooth entrance animation.
//
//  On touch / reduced-motion devices the animation is skipped immediately
//  so the page content is visible without delay.
//
//  NOTE: We avoid AnimatePresence here because Next.js App Router replaces
//  the children prop synchronously on route change, which conflicts with
//  AnimatePresence's exit-before-enter sequencing. Instead we use a simple
//  key-switch pattern: React unmounts the old div and mounts the new one
//  with a fresh entrance animation.
// ============================================================================

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
