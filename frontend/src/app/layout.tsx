import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { UIProvider } from "@/contexts/UIContext";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import BottomPlayer from "@/components/layout/BottomPlayer";
import QueueDrawer from "@/components/layout/QueueDrawer";
import RightNowPlayingPanel from "@/components/layout/RightNowPlayingPanel";
import CommandPalette from "@/components/ui/CommandPalette";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nova — Music",
  description: "A premium, dark-mode music streaming experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-nova-black font-sans text-nova-primary antialiased">
        {/* Aurora / Nebula background */}
        <div className="aurora" />
        <div className="noise" />

        <AuthProvider>
          <PlayerProvider>
            <UIProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "rgba(10, 10, 26, 0.95)",
                    color: "#F5F5F7",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                  },
                }}
              />
              <div className="flex min-h-screen">
                {/* Sidebar/TopBar/BottomPlayer self-hide on landing + auth pages. */}
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
            </UIProvider>
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
