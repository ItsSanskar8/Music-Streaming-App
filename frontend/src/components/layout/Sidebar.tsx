"use client";

// Nova glass sidebar. 72px icon rail on mobile → 260px with labels on desktop.
// Active link gets a royal-blue→cyan glow. Shows the signed-in user's playlists
// (from the additive /api/playlists route) beneath the primary nav.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { listPlaylists, type PlaylistSummary } from "@/services/playlistsApi";

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

export default function Sidebar() {
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
    <aside className="z-30 flex h-full w-[72px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl md:w-[260px]">
      {/* Logo */}
      <Link href="/dashboard" className="flex h-20 items-center gap-3 px-4 md:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue to-nova-cyan shadow-glow-cyan">
          <Sparkles size={18} className="text-black" />
        </div>
        <span className="hidden text-xl font-bold tracking-tight text-white md:block">
          Nova
        </span>
      </Link>

      {/* Primary nav */}
      <nav className="mt-1 flex flex-col gap-0.5 px-3 md:px-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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
              <span className="hidden md:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User playlists */}
      <div className="mt-4 hidden min-h-0 flex-1 flex-col border-t border-white/[0.06] px-4 pt-4 md:flex">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
          Your Playlists
        </p>
        <div className="no-scrollbar flex-1 overflow-y-auto">
          {playlists.length === 0 ? (
            <p className="px-3 py-2 text-xs text-white/35">
              No playlists yet.
            </p>
          ) : (
            playlists.map((p) => (
              <Link
                key={p.id}
                href={`/playlists/${p.id}`}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/55 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <Music2 size={15} className="flex-shrink-0 text-white/40" />
                <span className="truncate">{p.name}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* User chip */}
      <div className="mt-auto border-t border-white/[0.06] p-3 md:p-4">
        {user && (
          <div className="flex items-center gap-3">
            <Link href="/profile" className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="hidden min-w-0 flex-1 md:block">
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
    </aside>
  );
}
