"use client";

// Slide-up Queue drawer, triggered from the Bottom Player. Lists the queue
// with Play / Remove per row, a Clear Queue action, and an empty state.

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
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-3xl border-t border-white/[0.1] bg-brand-navy/80 backdrop-blur-2xl"
          >
            <div className="mx-auto max-w-3xl px-5 py-5 sm:px-8">
              {/* Grab handle */}
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/15" />

              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Queue{" "}
                  <span className="text-sm font-normal text-white/40">
                    · {queue.length}
                  </span>
                </h3>
                <div className="flex items-center gap-3">
                  {queue.length > 0 && (
                    <button
                      onClick={clearQueue}
                      className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:text-brand-rose"
                    >
                      <ListX size={14} /> Clear
                    </button>
                  )}
                  <button
                    onClick={() => setQueue(false)}
                    className="text-white/40 transition-colors hover:text-white"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[46vh] space-y-1 overflow-y-auto no-scrollbar pb-2">
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
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.04] ${
                          active ? "bg-white/[0.05]" : ""
                        }`}
                      >
                        <span className="w-5 text-center text-xs text-white/30">
                          {active ? (
                            <Volume2 size={14} className="text-brand-cyan" />
                          ) : (
                            i + 1
                          )}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.thumbnail || ""}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-medium ${
                              active ? "text-brand-cyan" : "text-white"
                            }`}
                          >
                            {s.title}
                          </p>
                          <p className="truncate text-xs text-white/40">
                            {s.artist}
                          </p>
                        </div>
                        <button
                          onClick={() => playFromQueue(s.yt_id)}
                          className="rounded-full p-2 text-white/50 transition-colors hover:text-white"
                          aria-label="Play"
                        >
                          <Play size={15} className="fill-current" />
                        </button>
                        <button
                          onClick={() => removeFromQueue(s.yt_id)}
                          className="rounded-full p-2 text-white/40 opacity-0 transition-all hover:text-brand-rose group-hover:opacity-100"
                          aria-label="Remove"
                        >
                          <Trash2 size={15} />
                        </button>
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
