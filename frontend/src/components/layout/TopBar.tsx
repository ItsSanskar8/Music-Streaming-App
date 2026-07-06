"use client";

// Nova top bar: search field (routes to /search), ⌘K command-palette trigger,
// a Premium pill, notifications, and the user profile chip.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Command, Bell, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";

export default function TopBar() {
  const router = useRouter();
  const { user } = useAuth();
  const { openCommand } = useUI();
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Clear TopBar search input only when navigating TO /search from another route.
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
    <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-white/[0.06] bg-nova-bg/50 px-5 backdrop-blur-2xl sm:px-8">
      <form onSubmit={submit} className="relative w-full max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search songs, artists, albums…"
          className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm font-medium text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition-colors focus:border-nova-cyan/40 focus:shadow-glow-cyan"
        />
      </form>

      <button
        onClick={openCommand}
        className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:text-white sm:flex"
      >
        <Command size={13} />
        <span>K</span>
      </button>

      <div className="ml-auto flex items-center gap-3">
        <button className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-nova-blue to-nova-cyan px-4 py-2 text-xs font-semibold text-black shadow-glow-blue transition-transform hover:scale-[1.03] md:flex">
          <Sparkles size={13} />
          Premium
        </button>

        <button
          className="hidden text-white/50 transition-colors hover:text-white sm:block"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] py-1 pl-1 pr-3 backdrop-blur-xl transition-colors hover:border-white/20"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden text-sm font-medium text-white/80 sm:block">
              {user.name.split(" ")[0]}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
