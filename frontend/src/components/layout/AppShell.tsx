"use client";

// Route-aware chrome with animated page transitions. Public routes
// (landing + auth) render full-screen with no app chrome. App routes get
// the full Nova sidebar/topbar/player. Every route change triggers a
// smooth PageTransition fade+slide animation.
//
// The player audio element lives in PlayerProvider (layout.tsx), so it
// stays mounted across every route and playback never restarts.

import { usePathname } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BottomPlayer from "@/components/layout/BottomPlayer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import QueueDrawer from "@/components/layout/QueueDrawer";
import RightNowPlayingPanel from "@/components/layout/RightNowPlayingPanel";
import CommandPalette from "@/components/ui/CommandPalette";
import PageTransition from "@/components/ui/PageTransition";


// Routes that render bare (no app chrome — landing + full-screen auth).
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (isPublic) {
    return (
      <PageTransition>
        {children}
      </PageTransition>
    );
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <TopBar />
          {/* Clear the fixed chrome: on mobile the 96px player stacks on the
              64px bottom nav (pb-40); on md+ only the 96px player (pb-28). */}
          <main className="flex-1 pb-40 md:pb-28">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
      <BottomPlayer />
      <MobileBottomNav />
      <QueueDrawer />
      <RightNowPlayingPanel />
      <CommandPalette />
    </>
  );
}
