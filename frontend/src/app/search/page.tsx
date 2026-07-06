"use client";

// Search — debounced input, grouped results, loading/empty states.

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Loader2, Music2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import SongRow from "@/components/music/SongRow";
import MusicCard from "@/components/cards/MusicCard";
import EmptyState from "@/components/ui/EmptyState";
import { usePlayer } from "@/contexts/PlayerContext";
import { searchSongs } from "@/services/api";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function SearchInner() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const { playSong } = usePlayer();

  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the search when navigating to /search without a query param.
  useEffect(() => {
    setQuery(params.get("q") ?? "");
    if (!params.get("q")) {
      setResults([]);
      setSearched(false);
    }
  }, [params]);

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

  // Debounce input by 400ms.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  // Derive artist groupings from results.
  const artistGroups = (() => {
    const map = new Map<string, Song[]>();
    for (const s of results) {
      const existing = map.get(s.artist) || [];
      existing.push(s);
      map.set(s.artist, existing);
    }
    return Array.from(map.entries()).slice(0, 5);
  })();

  return (
    <AuthGuard>
      <div className="px-5 py-8 sm:px-8">
        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">
            Search
          </h1>
          <div className="relative max-w-2xl">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-12 pr-5 text-sm font-medium text-white placeholder:text-white/40 outline-none transition-all focus:border-nova-cyan/40 focus:shadow-glow-cyan focus:bg-white/[0.06]"
            />
          </div>
        </motion.div>

        {/* Loading */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-white/50"
            >
              <Loader2 size={16} className="animate-spin text-nova-cyan" />
              Searching…
            </motion.div>
          )}

          {/* Empty state — no query */}
          {!loading && !searched && (
            <motion.div
              key="empty-search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={SearchIcon}
                title="Search Nova"
                subtitle="Find songs, artists, albums, and more. Start typing to explore."
              />
            </motion.div>
          )}

          {/* No results */}
          {!loading && searched && results.length === 0 && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                icon={Music2}
                title="No results found"
                subtitle={`Nothing matched "${query}". Try a different search term.`}
              />
            </motion.div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mb-4 text-sm text-white/50">
                {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                <span className="font-medium text-nova-cyan">"{query}"</span>
              </p>

              {/* Top Results — full-width song list */}
              <div className="mb-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
                {/* No `list` — playing a search result plays only that track.
                    Users build the queue deliberately via each row's QueueButton. */}
                {results.slice(0, 10).map((s, i) => (
                  <SongRow key={s.yt_id} song={s} rank={i + 1} index={i} />
                ))}
              </div>

              {/* Artists found */}
              {artistGroups.length > 0 && (
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-bold tracking-tight text-white">
                    Artists Found
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {artistGroups.map(([artist, artistSongs], i) => (
                      <MusicCard
                        key={artist}
                        song={artistSongs[0]}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchInner />
    </Suspense>
  );
}
