"use client";

// Mood Match — renamed from Mood AI. Mood selector, fetch recommendations, play/like/queue.

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Music2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import MoodGlow from "@/components/ui/MoodGlow";
import SongRow from "@/components/music/SongRow";
import EmptyState from "@/components/ui/EmptyState";
import GlassSkeleton from "@/components/ui/GlassSkeleton";
import { usePlayer } from "@/contexts/PlayerContext";
import { recommendByMood } from "@/services/api";
import type { Song } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const MOODS = [
  { key: "chill", label: "Chill", emoji: "🌊", gradient: "from-nova-cyan/30 to-nova-blue/25" },
  { key: "focus", label: "Focus", emoji: "🎯", gradient: "from-nova-blue/40 to-indigo-500/25" },
  { key: "happy", label: "Happy", emoji: "☀️", gradient: "from-yellow-400/30 to-nova-blue/20" },
  { key: "melancholic", label: "Sad", emoji: "🌧️", gradient: "from-slate-500/30 to-nova-blue/25" },
  { key: "energetic", label: "Energetic", emoji: "⚡", gradient: "from-orange-500/35 to-nova-blue/25" },
];

function MoodMatchInner() {
  const params = useSearchParams();
  const initialMood = params.get("mood") || "";
  const { playSong } = usePlayer();

  const [selected, setSelected] = useState<string>(initialMood);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (initialMood) setSelected(initialMood);
  }, [initialMood]);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setFetched(true);
    recommendByMood(selected)
      .then(setSongs)
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, [selected]);

  const activeMood = MOODS.find((m) => m.key === selected);

  // Arrow-key navigation between mood tabs
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = MOODS.findIndex((m) => m.key === selected && m.label === activeMood?.label);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelected(MOODS[(idx + 1) % MOODS.length].key);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelected(MOODS[(idx - 1 + MOODS.length) % MOODS.length].key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, activeMood?.label]);

  return (
    <AuthGuard>
      <MoodGlow mood={selected} />

      <div className="px-5 py-8 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-nova-blue/30 to-nova-cyan/20 border border-white/[0.06]">
              <Sparkles size={28} className="text-white/40" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Mood Match
              </h1>
              <p className="text-sm text-white/40">
                Pick a feeling — Nova scores the soundtrack
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mood selector */}
        <div className="mb-8 flex flex-wrap gap-3">
          {MOODS.map((m, i) => {
            const isActive = selected === m.key && activeMood?.label === m.label;
            return (
              <motion.button
                key={m.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: i * 0.03 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelected(m.key)}
                className={`relative flex items-center gap-2 overflow-hidden rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "border-white/[0.15] bg-white/[0.06] text-white shadow-md"
                    : "border-white/[0.06] bg-white/[0.03] text-white/45 hover:text-white hover:border-white/[0.12]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mood-match-glow"
                    className={`absolute inset-0 -z-10 bg-gradient-to-br ${m.gradient} blur-xl`}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span>{m.emoji}</span>
                {m.label}
              </motion.button>
            );
          })}
        </div>

        {/* Results with smooth cross-fade */}
        <AnimatePresence mode="wait">
          {!fetched ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <EmptyState
                icon={Sparkles}
                title="Select a mood"
                subtitle="Choose a mood above and Nova will recommend the perfect tracks for your vibe."
              />
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <GlassSkeleton variant="row" count={6} />
            </motion.div>
          ) : songs.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <EmptyState
                icon={Music2}
                title={`No ${activeMood?.label.toLowerCase() || ""} tracks found`}
                subtitle="Your Nova library is ready. Try searching to fill it with music."
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="mb-4 flex items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${songs.length}-${activeMood?.label}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="text-sm text-white/40"
                  >
                    {songs.length} track{songs.length !== 1 ? "s" : ""} recommended for{" "}
                    <span className="font-medium text-white/70">{activeMood?.label}</span>
                  </motion.p>
                </AnimatePresence>
                <button
                  onClick={() => songs.length > 0 && playSong(songs[0], songs)}
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0F0F12] shadow-md transition-transform hover:scale-[1.03]"
                >
                  Play All
                </button>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
                {songs.map((s, i) => (
                  <motion.div
                    key={s.yt_id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                  >
                    <SongRow song={s} list={songs} rank={i + 1} index={i} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}

export default function MoodMatchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white/30 border-t-transparent rounded-full" />
      </div>
    }>
      <MoodMatchInner />
    </Suspense>
  );
}
