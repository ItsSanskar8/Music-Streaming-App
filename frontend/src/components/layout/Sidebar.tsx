"use client";

// Nova glass sidebar — refined v5. On desktop (md+) it's a persistent 260px rail.
// On mobile it renders as a slide-in drawer. Cleaner hover states, better spacing,
// more refined active indicators with the new muted indigo palette.

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

const NAV_ITEM_TAP = { scale: 0.97 };

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
        className="flex h-[72px] items-center gap-2.5 px-5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-nova-blue to-nova-blue/70 shadow-glow-indigo">
          <Sparkles size={16} className="text-[#0F0F12]" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">Nova</span>
      </Link>

      {/* Primary nav */}
      <nav className="mt-0.5 flex flex-col gap-px px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                active
                  ? "text-white"
                  : "text-white/45 hover:text-white/80"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-white/[0.07]"
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <Icon
                size={18}
                className={`transition-colors duration-200 ${
                  active ? "text-nova-blue" : "text-white/40 group-hover:text-white/70"
                }`}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Premium — highlighted */}
      <div className="mt-1.5 px-3">
        <Link
          href="/premium"
          onClick={onNavigate}
          className={`group relative flex items-center gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-[13px] font-semibold transition-all duration-200 ${
            pathname === "/premium"
              ? "text-white"
              : "text-white/60 hover:text-white/80"
          }`}
        >
          {pathname === "/premium" && (
            <span className="absolute inset-0 -z-10 rounded-lg bg-nova-gold/10" />
          )}
          <Crown size={18} className="text-nova-gold" />
          <span>Premium</span>
          <span className="ml-auto inline rounded-full bg-nova-cyan/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-nova-cyan">
            Free
          </span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 mt-4 h-px bg-white/[0.06]" />

      {/* User playlists */}
      <div className="mt-3 flex min-h-0 flex-1 flex-col px-3">
        <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Your Playlists
        </p>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          {playlists.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-white/25">No playlists yet.</p>
          ) : (
            playlists.map((p) => (
              <Link
                key={p.id}
                href={`/playlists/${p.id}`}
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
              >
                <motion.div whileTap={NAV_ITEM_TAP} className="flex items-center gap-2">
                  <Music2 size={14} className="flex-shrink-0 text-white/30" />
                  <span className="truncate">{p.name}</span>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* User chip */}
      <div className="mt-auto border-t border-white/[0.06] p-3">
        {user && (
          <div className="flex items-center gap-2.5">
            <Link
              href="/profile"
              onClick={onNavigate}
              className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white/80">{user.name}</p>
              <p className="truncate text-[11px] text-white/35">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-white/30 transition-colors hover:text-white/60"
              aria-label="Log out"
            >
              <LogOut size={16} />
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
      <aside className="z-30 hidden h-full w-[252px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.015] backdrop-blur-2xl md:flex">
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
                if (info.offset.x < -80 || (info.offset.x < -30 && info.velocity.x < -500)) {
                  setSidebar(false);
                }
              }}
              className="absolute left-0 top-0 flex h-full w-[272px] max-w-[85vw] flex-col border-r border-white/[0.06] bg-[#0F0F12]/95 backdrop-blur-2xl"
            >
              <button
                onClick={() => setSidebar(false)}
                className="absolute right-3 top-5 z-10 text-white/35 transition-colors hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent onNavigate={() => setSidebar(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
