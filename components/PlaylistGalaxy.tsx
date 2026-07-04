"use client";

// ------------------------------------------------------------------
//  PlaylistGalaxy — grid of glowing PlaylistCard components.
// ------------------------------------------------------------------

import { Orbit } from "lucide-react";
import { playlists } from "@/lib/mockData";
import PlaylistCard from "./PlaylistCard";

export default function PlaylistGalaxy() {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Orbit className="text-neon-purple" size={22} />
        <h2 className="text-2xl font-bold">Playlist Galaxy</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6 lg:grid-cols-3">
        {playlists.map((playlist, i) => (
          <PlaylistCard key={playlist.id} playlist={playlist} index={i} />
        ))}
      </div>
    </section>
  );
}
