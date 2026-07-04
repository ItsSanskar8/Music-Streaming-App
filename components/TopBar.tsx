"use client";

// ------------------------------------------------------------------
//  TopBar — search input, notifications, theme/action button, profile.
//  Also holds the hamburger that opens the mobile Sidebar drawer.
// ------------------------------------------------------------------

import { useState } from "react";
import { Search, Bell, Sparkle, Menu } from "lucide-react";
import { usePlayer } from "@/lib/PlayerContext";

export default function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { handleSearch } = usePlayer();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-4 sm:px-6">
      {/* Frosted backdrop so content scrolls nicely behind it */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-void/40 backdrop-blur-xl" />

      {/* Mobile menu button */}
      <button
        onClick={onOpenMenu}
        className="rounded-xl glass p-2.5 text-white/70 transition hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: hook this into your real search.
          handleSearch(query);
        }}
        className="relative flex-1 max-w-xl"
      >
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder="Search songs, artists, moods…"
          className="w-full rounded-2xl glass py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-neon-purple/50 focus:shadow-glow"
        />
      </form>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme / action button (placeholder) */}
        <button
          className="rounded-xl glass p-2.5 text-white/70 transition hover:text-neon-purple hover:shadow-glow"
          aria-label="Toggle theme"
        >
          <Sparkle size={19} />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-xl glass p-2.5 text-white/70 transition hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-neon-pink shadow-glow-pink" />
        </button>

        {/* Profile chip */}
        <button className="flex items-center gap-2 rounded-full glass py-1.5 pl-1.5 pr-3 transition hover:glass-strong">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue" />
          <span className="hidden text-sm font-medium text-white sm:block">
            Nova
          </span>
        </button>
      </div>
    </header>
  );
}
