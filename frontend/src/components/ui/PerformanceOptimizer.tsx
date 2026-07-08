"use client";

import { useEffect } from "react";
import { MotionGlobalConfig } from "framer-motion";

/**
 * PerformanceOptimizer — a lightweight client component that sets
 * framer-motion's global `skipAnimations` flag when the user is on a
 * touch device or prefers reduced motion.
 *
 * This eliminates ALL framer-motion JS animation overhead (entrance
 * animations, whileInView, AnimatePresence, layout animations) on
 * mobile with a single flag. Gesture-based animations (whileTap,
 * whileHover) are also skipped — but on touch devices hover doesn't
 * exist and tap animations are not worth the jank.
 *
 * Place this high in the component tree (e.g. inside <PlayerProvider>
 * in layout.tsx) so it runs before route-driven animations fire.
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    const touchMq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      MotionGlobalConfig.skipAnimations = touchMq.matches || motionMq.matches;
    };

    update();
    touchMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      touchMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
      // Reset on unmount so other pages aren't affected
      MotionGlobalConfig.skipAnimations = false;
    };
  }, []);

  return null;
}
