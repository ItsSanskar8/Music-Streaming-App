"use client";

// ============================================================================
//  ScrollProgress — Fixed side-mounted scroll progress indicator.
//
//  Shows:
//    • A vertical track line that fills with gradient as you scroll
//    • Dots at each section position
//    • Active section dot highlighted with glow
//    • Section label that appears on hover / when active
//    • Click a dot to smoothly scroll to that section
// ============================================================================

import { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface Section {
  id: string;
  label: string;
}

interface Props {
  sections: readonly Section[];
  className?: string;
}

export default function ScrollProgress({ sections, className = "" }: Props) {
  const { scrollYProgress } = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Smooth spring for the fill height
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // Detect which section is in view using scroll-position scroll-spy.
  // Works in both directions (unlike Math.max-based IntersectionObserver).
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.3;
      let current = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          current = i;
          break;
        }
      }
      setActiveIndex(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <nav
      className={`fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 lg:flex flex-col items-center gap-0 ${className}`}
      aria-label="Section navigation"
    >
      {/* Track line container */}
      <div className="relative flex flex-col items-center">
        {/* Background track */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.08]" />

        {/* Filled track — animated with spring */}
        <motion.div
          className="absolute top-0 left-1/2 w-[2px] -translate-x-1/2 origin-top bg-gradient-to-b from-nova-blue via-nova-cyan to-nova-violet shadow-glow-emerald/30"
          style={{ scaleY: smoothProgress, height: "100%" }}
        />

        {/* Section dots */}
        {sections.map((section, idx) => {
          const isActive = idx <= activeIndex;
          const isHovered = hoveredIndex === idx;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={section.id}
              className="relative flex items-center justify-center"
              style={{ height: `${100 / sections.length}%`, minHeight: 44 }}
            >
              {/* Dot */}
              <button
                onClick={() => scrollTo(section.id)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative z-10 flex items-center justify-center"
                aria-label={`Scroll to ${section.label}`}
              >
                <motion.span
                  animate={{
                    scale: isCurrent ? 1.4 : isHovered ? 1.2 : 1,
                    backgroundColor: isActive
                      ? "rgba(0, 245, 212, 1)"
                      : "rgba(255, 255, 255, 0.15)",
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="block h-2.5 w-2.5 rounded-full transition-shadow duration-300"
                  style={{
                    boxShadow: isCurrent
                      ? "0 0 12px rgba(0, 245, 212, 0.5)"
                      : isHovered
                        ? "0 0 8px rgba(0, 245, 212, 0.25)"
                        : "none",
                  }}
                />

                {/* Active dot glow ring */}
                {isCurrent && (
                  <motion.span
                    layoutId="dot-glow"
                    className="absolute inset-0 rounded-full border border-nova-cyan/40"
                    animate={{ scale: [1, 1.6, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
              </button>

              {/* Label — appears on hover / active */}
              <motion.span
                initial={false}
                animate={{
                  opacity: isHovered || isCurrent ? 1 : 0,
                  x: isHovered || isCurrent ? 0 : 8,
                }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute right-8 whitespace-nowrap text-xs font-medium tracking-wide"
                style={{
                  color: isCurrent
                    ? "rgba(0, 245, 212, 1)"
                    : "rgba(255, 255, 255, 0.5)",
                }}
              >
                {section.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
