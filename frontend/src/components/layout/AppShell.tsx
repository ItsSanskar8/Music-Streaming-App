"use client";

// Route-aware chrome. Public routes (landing + auth) render full-screen with no
// sidebar/topbar/player so the cinematic landing can own the viewport. App
// routes get the full Nova chrome. The player audio element lives in
// PlayerProvider (in layout.tsx), so it stays mounted across every route and
// playback never restarts on navigation.

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BottomPlayer from "@/components/layout/BottomPlayer";
import QueueDrawer from "@/components/layout/QueueDrawer";
import RightNowPlayingPanel from "@/components/layout/RightNowPlayingPanel";
import CommandPalette from "@/components/ui/CommandPalette";

// Routes that render bare (no app chrome).
const PUBLIC_ROUTES = ["/", "/login", "/signup"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          {/* pb-28 clears the persistent 96px BottomPlayer. */}
          <main className="flex-1 pb-28">{children}</main>
        </div>
      </div>
      <BottomPlayer />
      <QueueDrawer />
      <RightNowPlayingPanel />
      <CommandPalette />
    </>
  );
}
