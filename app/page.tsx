"use client";

// ------------------------------------------------------------------
//  Home page — assembles every section into the full SoundVerse app.
//
//  Layout:  [ Sidebar ] [ main scroll area ] [ NowPlayingPanel ]
//  with a sticky BottomPlayer across the bottom.
// ------------------------------------------------------------------

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import HeroSection from "@/components/HeroSection";
import MoodDiscovery from "@/components/MoodDiscovery";
import TrendingSongs from "@/components/TrendingSongs";
import PlaylistGalaxy from "@/components/PlaylistGalaxy";
import NowPlayingPanel from "@/components/NowPlayingPanel";
import BottomPlayer from "@/components/BottomPlayer";

export default function Home() {
  // Controls the mobile sidebar drawer.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left navigation */}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main content + right panel */}
      <div className="flex min-w-0 flex-1">
        <main className="min-w-0 flex-1">
          <TopBar onOpenMenu={() => setMenuOpen(true)} />

          {/* pb-40 leaves room for the sticky BottomPlayer */}
          <div className="space-y-10 px-4 pb-40 pt-2 sm:px-6">
            <HeroSection />
            <MoodDiscovery />

            {/* Two-column-ish flow: trending list + playlists */}
            <TrendingSongs />
            <PlaylistGalaxy />
          </div>
        </main>

        {/* Right "Now Playing" column (desktop only) */}
        <div className="hidden px-4 pb-40 pt-2 xl:block">
          <NowPlayingPanel />
        </div>
      </div>

      {/* Sticky bottom player */}
      <BottomPlayer />
    </div>
  );
}
