"use client";

// Nova glass sidebar. On desktop (md+) it's a persistent 260px rail.
// On mobile it renders as a slide-in drawer (opened via the TopBar hamburger),
// so every nav destination stays reachable without stealing layout width.
// Active link gets a royal-blue→cyan glow. Shows the signed-in user's playlists
// (from the additive /api/playlists route) beneath the primary nav.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  TrendingUp,
  Library,
  ListMusic,
  Heart,
  Download,
  Sparkles,
  Clock,
  LogOut,
  Music2,
  Crown,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";
import { listPlaylists, type PlaylistSummary } from "@/services/playlistsApi";

const NAV_ITEM_TAP = { scale: 0.96 };

const NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/library", label: "Library", icon: Library },
  { href: "/playlists", label: "Playlists", icon: ListMusic },
  { href: "/liked", label: "Liked Songs", icon: Heart },
  { href: "/downloads", label: "Downloads", icon: Download },
  { href: "/mood-match", label: "Mood Match", icon: Sparkles },
  { href: "/recently-played", label: "Recently Played", icon: Clock },
];

/** The inner sidebar UI — labels always visible, shared by the desktop rail
 *  and the mobile drawer. `onNavigate` fires when any link is tapped so the
 *  mobile drawer can close itself. */
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);

  useEffect(() => {
    if (!user) {
      setPlaylists([]);
      return;
    }
    listPlaylists()
      .then(setPlaylists)
      .catch(() => setPlaylists([]));
  }, [user]);

  return (
    <>
      {/* Logo */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex h-20 items-center gap-3 px-6"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
          <Sparkles size={18} className="text-black" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Nova</span>
      </Link>

      {/* Primary nav */}
      <nav className="mt-1 flex flex-col gap-0.5 px-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300 ${
                active ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-xl border border-nova-cyan/25 bg-gradient-to-r from-nova-blue/20 to-nova-cyan/10"
                  style={{ boxShadow: "0 0 24px rgba(0,245,212,0.18)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <Icon size={19} className={active ? "text-nova-cyan" : ""} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Premium — highlighted, it's free */}
      <div className="mt-2 px-4">
        <Link
          href="/premium"
          onClick={onNavigate}
          className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
            pathname === "/premium"
              ? "border-nova-gold/40 text-white"
              : "border-nova-gold/20 text-white/70 hover:border-nova-gold/40 hover:text-white"
          }`}
          style={{ boxShadow: "0 0 24px -6px rgba(251,191,36,0.25)" }}
        >
          <span className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-nova-gold/15 via-nova-violet/10 to-transparent" />
          <Crown size={19} className="flex-shrink-0 text-nova-gold" />
          <span>Premium</span>
          <span className="ml-auto inline rounded-full bg-nova-cyan/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-nova-cyan">
            Free
          </span>
        </Link>
      </div>

      {/* User playlists */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col border-t border-white/[0.06] px-4 pt-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
          Your Playlists
        </p>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          {playlists.length === 0 ? (
            <p className="px-3 py-2 text-xs text-white/35">No playlists yet.</p>
          ) : (
            playlists.map((p) => (
              <Link
                key={p.id}
                href={`/playlists/${p.id}`}
                onClick={onNavigate}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <motion.div whileTap={NAV_ITEM_TAP} className="flex items-center gap-2.5">
                  <Music2 size={15} className="flex-shrink-0 text-white/40" />
                  <span className="truncate">{p.name}</span>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* User chip */}
      <div className="mt-auto border-t border-white/[0.06] p-4">
        {user && (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              onClick={onNavigate}
              className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-white/40">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-white/40 transition-colors hover:text-nova-blue"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebar } = useUI();
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebar(false);
  }, [pathname, setSidebar]);

  return (
    <>
      {/* Desktop rail — persistent, hidden below md */}
      <aside className="z-30 hidden h-full w-[260px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer — overlays content, hidden on md+ */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebar(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Panel — swipe left to close */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: -280, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                // Close on slow drag >80px or on fast flick >30px
                if (info.offset.x < -80 || (info.offset.x < -30 && info.velocity.x < -500)) {
                  setSidebar(false);
                }
              }}
              className="absolute left-0 top-0 flex h-full w-[280px] max-w-[85vw] flex-col border-r border-white/[0.08] bg-nova-bg/95 backdrop-blur-2xl"
            >
              <button
                onClick={() => setSidebar(false)}
                className="absolute right-3 top-6 z-10 text-white/40 transition-colors hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <SidebarContent onNavigate={() => setSidebar(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
