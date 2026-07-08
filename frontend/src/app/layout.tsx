import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { UIProvider } from "@/contexts/UIContext";
import AppShell from "@/components/layout/AppShell";
import PerformanceOptimizer from "@/components/ui/PerformanceOptimizer";

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
            <PerformanceOptimizer />
            <UIProvider>
              <Toaster
                position="top-right"
                gutter={12}
                toastOptions={{
                  duration: 3000,
                  style: {
                    minWidth: "320px",
                    maxWidth: "min(520px, calc(100vw - 32px))",
                    padding: "14px 18px",
                    background: "rgba(15, 15, 18, 0.72)",
                    color: "#F5F0EB",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "20px",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow:
                      "0 12px 48px rgba(0,0,0,0.6), 0 0 24px -8px rgba(201,169,110,0.18)",
                  },
                  success: { iconTheme: { primary: "#5A9E8F", secondary: "#0F0F12" } },
                  error: {
                    iconTheme: { primary: "#F472B6", secondary: "#050505" },
                    style: {
                      boxShadow:
                        "0 12px 48px rgba(0,0,0,0.6), 0 0 24px -8px rgba(244,114,182,0.25)",
                    },
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
