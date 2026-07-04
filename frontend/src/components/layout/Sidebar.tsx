"use client";

// Glass sidebar. 72px icon rail on mobile → 240px with labels on desktop.
// Active link gets a soft cyan glow. (Restyled for the v2 design system.)

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  TrendingUp,
  Library,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/library", label: "Library", icon: Library },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="z-30 flex h-screen w-[72px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl md:w-[240px]">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-4 md:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-lavender/30 to-brand-cyan/30 ring-1 ring-white/10">
          <Sparkles size={18} className="text-brand-lavender" />
        </div>
        <span className="hidden text-lg font-semibold tracking-tight text-white md:block">
          Nova
        </span>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3 md:px-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-300 ${
                active ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-xl border border-brand-cyan/25 bg-brand-cyan/10"
                  style={{ boxShadow: "0 0 24px rgba(34,211,238,0.18)" }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                />
              )}
              <Icon
                size={20}
                className={active ? "text-brand-cyan" : ""}
              />
              <span className="hidden md:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/[0.06] p-3 md:p-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user.avatar_url ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                }
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden min-w-0 flex-1 md:block">
              <p className="truncate text-sm font-medium text-white">
                {user.name}
              </p>
              <p className="truncate text-xs text-white/40">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-white/40 transition-colors hover:text-brand-rose"
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
