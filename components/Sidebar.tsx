"use client";

// ------------------------------------------------------------------
//  Sidebar — logo + primary navigation.
//  On desktop it's a fixed rail; on mobile it collapses to a slide-in
//  drawer toggled from the TopBar (see `open` / `onClose` props).
// ------------------------------------------------------------------

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Library,
  ListMusic,
  Mic2,
  Disc3,
  Download,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

// Nav items — purely visual for now. Wire up routing later if needed.
const NAV = [
  { name: "Discover", icon: Compass },
  { name: "Library", icon: Library },
  { name: "Playlists", icon: ListMusic },
  { name: "Artists", icon: Mic2 },
  { name: "Albums", icon: Disc3 },
  { name: "Downloads", icon: Download },
  { name: "Settings", icon: Settings },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  // Track which link is "active" just for the highlight (no routing yet).
  const [active, setActive] = useState("Discover");

  return (
    <div className="flex h-full flex-col gap-8 p-5">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl neon-fill shadow-glow">
          <Sparkles size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Sound<span className="neon-text">Verse</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                onNavigate?.();
              }}
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "glass-strong text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              {/* Active glow bar */}
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full neon-fill"
                />
              )}
              <Icon
                size={19}
                className={isActive ? "text-neon-purple" : ""}
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="relative overflow-hidden rounded-2xl glass p-4">
        <div className="aurora-blob absolute -right-6 -top-6 h-24 w-24 bg-neon-purple/50" />
        <p className="relative text-sm font-semibold text-white">
          Go Infinite
        </p>
        <p className="relative mt-1 text-xs text-white/50">
          Lossless audio & spatial sound.
        </p>
        <button className="relative mt-3 w-full rounded-xl neon-fill py-2 text-xs font-semibold text-white shadow-glow transition hover:opacity-90">
          Upgrade
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="sticky top-0 h-screen glass border-r border-white/10">
          <NavContent />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-72 glass-strong lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-5 rounded-full p-2 text-white/60 hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <NavContent onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
