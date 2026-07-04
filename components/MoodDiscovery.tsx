"use client";

// ------------------------------------------------------------------
//  MoodDiscovery — a grid of animated mood cards.
//  Clicking one could later filter songs by that mood.
// ------------------------------------------------------------------

import { motion } from "framer-motion";
import { moods } from "@/lib/mockData";

export default function MoodDiscovery() {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discover by Mood</h2>
          <p className="text-sm text-white/50">
            Pick a vibe, we&apos;ll do the rest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {moods.map((mood, i) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            // TODO: filter songs by this mood later.
            onClick={() => console.log("[selectMood]", mood.name)}
            className="group relative overflow-hidden rounded-2xl glass p-5 text-left"
          >
            {/* Gradient wash that brightens on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-20 transition-opacity duration-300 group-hover:opacity-40`}
            />
            {/* Floating emoji */}
            <div className="relative flex items-center justify-between">
              <span className="text-3xl transition-transform duration-300 group-hover:scale-125">
                {mood.emoji}
              </span>
              <span className="h-2 w-2 rounded-full bg-white/40 transition group-hover:bg-white" />
            </div>
            <p className="relative mt-6 font-semibold text-white">{mood.name}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
