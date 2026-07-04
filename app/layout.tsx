import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/lib/PlayerContext";
import AuroraBackground from "@/components/AuroraBackground";

// Futuristic geometric font loaded via next/font (no network request at runtime).
const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SoundVerse — Futuristic Music",
  description: "A premium, animated, futuristic music streaming UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans antialiased">
        {/* Animated aurora sits behind everything */}
        <AuroraBackground />
        {/* PlayerProvider shares song / play state across the whole app */}
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
