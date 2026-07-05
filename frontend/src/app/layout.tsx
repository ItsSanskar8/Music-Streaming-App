import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { UIProvider } from "@/contexts/UIContext";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Nova — Feel Music In Another Dimension",
  description:
    "Nova transforms songs, albums, playlists, and moods into an immersive 3D music universe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-nova-bg font-sans text-white antialiased">
        {/* Aurora / Nebula background (fixed, behind everything) */}
        <div className="aurora" />
        <div className="noise" />

        <AuthProvider>
          <PlayerProvider>
            <UIProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "rgba(10, 15, 31, 0.95)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                  },
                }}
              />
              {/* AppShell renders the full chrome on app routes and nothing
                  (bare children) on the public landing + auth routes. */}
              <AppShell>{children}</AppShell>
            </UIProvider>
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
