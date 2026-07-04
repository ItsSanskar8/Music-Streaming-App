"use client";

// ------------------------------------------------------------------
//  TrendingSongs — a list of SongCard rows.
// ------------------------------------------------------------------

import { TrendingUp } from "lucide-react";
import { songs } from "@/lib/mockData";
import SongCard from "./SongCard";

export default function TrendingSongs() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="text-neon-pink" size={22} />
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </div>

      <div className="rounded-3xl glass p-2 sm:p-3">
        {songs.map((song, i) => (
          <SongCard key={song.id} song={song} index={i} />
        ))}
      </div>
    </section>
  );
}
