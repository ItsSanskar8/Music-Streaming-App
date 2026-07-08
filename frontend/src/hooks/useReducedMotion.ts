"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` when the user either prefers reduced motion or is on a
 * touch device. Components can use this to skip expensive framer-motion
 * entrance / scroll animations without losing gesture-based interactions
 * (whileTap, whileHover) entirely.
 *
 * Falls back to `false` during SSR to avoid hydration mismatch.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const touchMq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const check = () => {
      setReduced(touchMq.matches || motionMq.matches);
    };

    check();
    touchMq.addEventListener("change", check);
    motionMq.addEventListener("change", check);
    return () => {
      touchMq.removeEventListener("change", check);
      motionMq.removeEventListener("change", check);
    };
  }, []);

  return reduced;
}
