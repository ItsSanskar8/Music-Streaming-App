"use client";

// Search — debounced input, results grid, with Play / Add to Queue / Download.

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Plus, Download, Search as SearchIcon, Loader2 } from "lucide-react";
import AppleCard from "@/components/ui/AppleCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { searchSongs, triggerDownload } from "@/services/api";
import type { Song } from "@/types";

const EASE = [0.25, 0.1, 0.25, 1] as const;

function fmtDuration(sec: number): string {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SearchInner() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const { playSong, addToQueue } = usePlayer();

  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      setResults(await searchSongs(term.trim()));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce input by 500ms.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  return (
    <div className="px-5 py-8 sm:px-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-nova-primary">
        Search
      </h1>

      <div className="relative mb-8 max-w-xl">
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-nova-secondary"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full rounded-2xl border border-white/10 bg-nova-surface py-3.5 pl-11 pr-4 text-sm font-medium text-nova-primary placeholder:text-nova-secondary outline-none transition-colors focus:border-nova-cyan/40"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-nova-secondary">
          <Loader2 size={16} className="animate-spin" /> Searching…
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-sm text-nova-secondary">No results found.</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((s, i) => (
          <motion.div
            key={s.yt_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE, delay: Math.min(i * 0.03, 0.3) }}
          >
            <AppleCard hover={false} className="group flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-nova-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.thumbnail || ""}
                  alt={s.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-nova-primary">
                  {s.title}
                </p>
                <p className="truncate text-xs font-medium text-nova-secondary">
                  {s.artist}
                  {s.duration ? ` · ${fmtDuration(s.duration)}` : ""}
                </p>
                <span className="mt-1 inline-block rounded-full bg-nova-elevated px-2 py-0.5 text-[10px] font-medium capitalize text-nova-secondary">
                  {s.mood}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => addToQueue(s)}
                  className="rounded-full p-2 text-nova-secondary transition-colors hover:text-nova-primary"
                  aria-label="Add to queue"
                  title="Add to queue"
                >
                  <Plus size={17} />
                </button>
                <button
                  onClick={() => triggerDownload(s)}
                  className="rounded-full p-2 text-nova-secondary transition-colors hover:text-nova-primary"
                  aria-label="Download MP3"
                  title="Download MP3"
                >
                  <Download size={17} />
                </button>
                <button
                  onClick={() => playSong(s, results)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-nova-primary text-black transition-transform hover:scale-105"
                  aria-label="Play"
                  title="Play"
                >
                  <Play size={15} className="fill-black" />
                </button>
              </div>
            </AppleCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  // useSearchParams must be wrapped in Suspense in the App Router.
  return (
    <Suspense fallback={null}>
      <SearchInner />
    </Suspense>
  );
}
