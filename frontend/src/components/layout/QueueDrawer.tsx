"use client";

// Slide-up Queue drawer — refined v5. Cleaner glass surfaces, muted colors,
// better spacing, refined active states.

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Trash2, ListX, Volume2 } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUI } from "@/contexts/UIContext";
import EmptyState from "@/components/ui/EmptyState";

export default function QueueDrawer() {
  const { queue, current, playFromQueue, removeFromQueue, clearQueue } =
    usePlayer();
  const { queueOpen, setQueue } = useUI();

  return (
    <AnimatePresence>
      {queueOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQueue(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-3xl border-t border-white/[0.06] bg-[#0F0F12]/85 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-3xl px-5 py-5 sm:px-8">
              {/* Grab handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/12" />

              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">
                  Queue{" "}
                  <span className="text-sm font-normal text-white/35">
                    · {queue.length}
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  {queue.length > 0 && (
                    <button
                      onClick={clearQueue}
                      className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-white/45 transition-colors hover:text-nova-rose"
                    >
                      <ListX size={13} /> Clear
                    </button>
                  )}
                  <button
                    onClick={() => setQueue(false)}
                    className="text-white/35 transition-colors hover:text-white"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[46vh] space-y-0.5 overflow-y-auto no-scrollbar pb-2">
                {queue.length === 0 ? (
                  <EmptyState
                    icon={ListX}
                    title="Your queue is empty"
                    subtitle="Add songs from Search, Trending or the dashboard to build your queue."
                  />
                ) : (
                  queue.map((s, i) => {
                    const active = current?.yt_id === s.yt_id;
                    return (
                      <div
                        key={s.yt_id}
                        className={`group flex items-center rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.04] ${
                          active ? "bg-white/[0.05]" : ""
                        }`}
                      >
                        <span className="w-5 text-center text-[11px] text-white/25">
                          {active ? (
                            <Volume2 size={13} className="text-nova-blue" />
                          ) : (
                            i + 1
                          )}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.thumbnail || ""}
                          alt=""
                          className="ml-3 h-10 w-10 rounded-lg object-cover ring-1 ring-white/[0.06]"
                        />
                        <div className="ml-3 min-w-0 flex-1">
                          <p
                            className={`truncate text-[13px] font-medium ${
                              active ? "text-nova-blue" : "text-white/80"
                            }`}
                          >
                            {s.title}
                          </p>
                          <p className="truncate text-[11px] text-white/35">
                            {s.artist}
                          </p>
                        </div>
                        <span className="ml-1 flex h-7 w-7 items-center justify-center">
                          <button
                            onClick={() => playFromQueue(s.yt_id)}
                            className="rounded-full text-white/40 transition-colors hover:text-white/70"
                            aria-label="Play"
                          >
                            <Play size={14} className="fill-current" />
                          </button>
                        </span>
                        <span className="ml-1 flex h-7 w-7 items-center justify-center">
                          <button
                            onClick={() => removeFromQueue(s.yt_id)}
                            className="rounded-full text-white/30 opacity-0 transition-all hover:text-nova-rose group-hover:opacity-100"
                            aria-label="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
