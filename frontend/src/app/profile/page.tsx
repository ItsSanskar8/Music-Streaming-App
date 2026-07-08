"use client";

// Profile — user info from /api/auth/me, avatar, stats, logout.

import { motion } from "framer-motion";
import { User, Mail, LogOut, Music2, Heart, Clock, ListMusic } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { likedSongs, recentlyPlayed, catalog } = usePlayer();

  return (
    <AuthGuard>
      {user && (
        <div className="px-5 py-8 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Profile header */}
            <div className="glass-strong mb-8 rounded-3xl p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-28 w-28 overflow-hidden rounded-full ring-2 ring-nova-cyan/30 ring-offset-4 ring-offset-nova-bg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-nova-cyan text-black shadow-glow-emerald">
                    <User size={14} />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    {user.name}
                  </h1>
                  <div className="mt-1 flex items-center gap-2 text-sm text-white/50">
                    <Mail size={14} />
                    {user.email}
                  </div>
                  <p className="mt-1 text-xs text-white/35">
                    Member since {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Liked Songs", value: likedSongs.length, icon: Heart, color: "text-rose-400" },
                { label: "Recently Played", value: recentlyPlayed.length, icon: Clock, color: "text-nova-cyan" },
                { label: "Catalog", value: catalog.length, icon: Music2, color: "text-nova-blue" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                    className="glass rounded-2xl p-5 text-center"
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <Icon size={20} className={stat.color} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-white/45">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Settings section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.3 }}
              className="glass rounded-2xl p-5"
            >
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
                Account
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-white/40" />
                    <span className="text-sm text-white/70">Name</span>
                  </div>
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-white/40" />
                    <span className="text-sm text-white/70">Email</span>
                  </div>
                  <span className="text-sm font-medium text-white">{user.email}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ListMusic size={16} className="text-white/40" />
                    <span className="text-sm text-white/70">Playlists</span>
                  </div>
                  <span className="text-sm font-medium text-white">—</span>
                </div>
              </div>
            </motion.div>

            {/* Logout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 hover:border-red-500/30"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AuthGuard>
  );
}
