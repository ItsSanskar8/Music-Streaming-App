"use client";

// Nova top bar — refined v5. Cleaner search, better spacing, muted controls.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Search, Command, Sparkles, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";

export default function TopBar() {
  const router = useRouter();
  const { user } = useAuth();
  const { openCommand, toggleSidebar } = useUI();
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname === "/search" && prevPathname.current !== "/search") {
      setQ("");
    }
    prevPathname.current = pathname;
  }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-nova-bg/60 px-5 backdrop-blur-2xl sm:px-8">
      {/* Hamburger — mobile only */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={toggleSidebar}
        className="flex items-center justify-center text-white/40 transition-colors hover:text-white/80 md:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </motion.button>

      {/* Search */}
      <form onSubmit={submit} className="relative w-full max-w-md">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search songs, artists, albums…"
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-10 pr-4 text-[13px] font-medium text-white placeholder:text-white/35 outline-none backdrop-blur-xl transition-all focus:border-white/[0.12] focus:bg-white/[0.05]"
        />
      </form>

      {/* Command palette trigger */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={openCommand}
        className="hidden items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-white/40 transition-colors hover:text-white/70 sm:flex"
      >
        <Command size={12} />
        <span>K</span>
      </motion.button>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Premium button */}
        <motion.div whileTap={{ scale: 0.95 }} className="hidden md:block">
          <Link
            href="/premium"
            className="flex items-center gap-1.5 rounded-lg bg-nova-blue/90 px-3.5 py-1.5 text-[12px] font-semibold text-white transition-all hover:bg-nova-blue"
          >
            <Sparkles size={12} />
            Premium
          </Link>
        </motion.div>

        {/* User chip */}
        {user && (
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] py-1 pl-1 pr-2.5 backdrop-blur-xl transition-colors hover:bg-white/[0.05]"
            >
              <div className="h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden text-[13px] font-medium text-white/70 sm:block">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
}
