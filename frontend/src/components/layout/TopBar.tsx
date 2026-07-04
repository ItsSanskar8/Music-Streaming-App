"use client";

// Top bar: a search field that routes to /search, a ⌘K command-palette
// trigger, and the user profile chip. (Restyled for v2.)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Command } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";

export default function TopBar() {
  const router = useRouter();
  const { user } = useAuth();
  const { openCommand } = useUI();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center gap-3 border-b border-white/[0.06] bg-brand-ink/50 px-5 backdrop-blur-2xl sm:px-8">
      <form onSubmit={submit} className="relative w-full max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search songs, artists…"
          className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm font-medium text-white placeholder:text-white/40 outline-none backdrop-blur-xl transition-colors focus:border-brand-cyan/40"
        />
      </form>

      {/* Command palette trigger */}
      <button
        onClick={openCommand}
        className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:text-white sm:flex"
      >
        <Command size={13} />
        <span>K</span>
      </button>

      <div className="ml-auto flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] py-1 pl-1 pr-3 backdrop-blur-xl">
            <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/10">
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
            <span className="hidden text-sm font-medium text-white/80 sm:block">
              {user.name.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
