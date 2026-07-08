"use client";

// Command Palette — Cmd+K overlay with instant search across all songs.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Heart, Plus, X } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUI } from "@/contexts/UIContext";
import type { Song } from "@/types";

export default function CommandPalette() {
  const { catalog, playSong, addToQueue, toggleLike, isLiked } = usePlayer();
  const { commandOpen, setCommand } = useUI();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Song[]>([]);

  // Filter catalog on query change
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    const results = catalog.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
    );
    setFiltered(results.slice(0, 20)); // limit to 20 results
  }, [query, catalog]);

  const handlePlay = (song: Song) => {
    playSong(song);
    setCommand(false);
    setQuery("");
  };

  const handleQueue = (song: Song) => {
    addToQueue(song);
    setQuery("");
  };

  const handleLike = (song: Song) => {
    toggleLike(song);
  };

  const close = () => {
    setCommand(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {commandOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-[10vh] z-[101] w-full max-w-2xl -translate-x-1/2"
          >
            <div className="mx-4 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0F0F12]/95 shadow-2xl backdrop-blur-3xl">
              {/* Search input */}
              <div className="relative border-b border-white/[0.08] p-4">
                <Search
                  size={20}
                  className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your catalog..."
                  className="w-full bg-transparent py-3 pl-11 pr-10 text-lg font-medium text-white placeholder:text-white/30 outline-none"
                />
                <button
                  onClick={close}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                {query.trim() && filtered.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-white/40">No results found.</p>
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="p-2">
                    {filtered.map((s, i) => {
                      const liked = isLiked(s);
                      return (
                        <motion.div
                          key={s.yt_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02, duration: 0.2 }}
                          className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/[0.05]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.thumbnail || ""}
                            alt={s.title}
                            className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/10"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                              {s.title}
                            </p>
                            <p className="truncate text-xs text-white/45">
                              {s.artist}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => handleLike(s)}
                              className="rounded-full p-2 text-white/50 transition-colors hover:text-nova-rose"
                              aria-label="Like"
                            >
                              <Heart
                                size={16}
                                className={
                                  liked
                                    ? "fill-nova-rose text-nova-rose"
                                    : ""
                                }
                              />
                            </button>
                            <button
                              onClick={() => handleQueue(s)}
                              className="rounded-full p-2 text-white/50 transition-colors hover:text-nova-cyan"
                              aria-label="Add to queue"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => handlePlay(s)}
                              className="rounded-full bg-white p-2 text-[#0F0F12] transition-transform hover:scale-105 shadow-md"
                              aria-label="Play"
                            >
                              <Play size={16} className="fill-[#F5F0EB]" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Search size={32} className="mx-auto mb-3 text-white/20" />
                    <p className="text-sm font-medium text-white/40">
                      Type to search your catalog
                    </p>
                    <p className="mt-1 text-xs text-white/25">
                      Press <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">Esc</kbd> to close
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
