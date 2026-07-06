// Shared mood-to-ambient-glow mapping.
// Each mood gets a subtle RGBA tint that washes the background behind the page content.
// Mirrors the effect used on the mood-match page.

export const MOOD_GLOW: Record<string, string> = {
  chill: "rgba(0,245,212,0.06)",
  focus: "rgba(59,130,246,0.06)",
  happy: "rgba(250,204,21,0.06)",
  melancholic: "rgba(100,116,139,0.06)",
  energetic: "rgba(249,115,22,0.06)",
  ambient: "rgba(139,92,246,0.06)",
};

/** Resolve a mood string to its glow background color, falling back to transparent. */
export function moodGlowColor(mood: string | undefined | null): string {
  return mood ? (MOOD_GLOW[mood] ?? "transparent") : "transparent";
}

// Brighter radial-gradient colors for the hero album-art overlay.
const MOOD_RADIAL: Record<string, string> = {
  chill: "radial-gradient(ellipse at center, rgba(0,245,212,0.2) 0%, rgba(0,245,212,0.06) 45%, transparent 70%)",
  focus: "radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.06) 45%, transparent 70%)",
  happy: "radial-gradient(ellipse at center, rgba(250,204,21,0.2) 0%, rgba(250,204,21,0.06) 45%, transparent 70%)",
  melancholic: "radial-gradient(ellipse at center, rgba(100,116,139,0.2) 0%, rgba(100,116,139,0.06) 45%, transparent 70%)",
  energetic: "radial-gradient(ellipse at center, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0.06) 45%, transparent 70%)",
  ambient: "radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.06) 45%, transparent 70%)",
};

/**
 * Return a CSS radial-gradient string positioned behind the hero album art.
 * Brighter than the page-level glow to create a focused halo effect.
 */
export function moodRadialGradient(mood: string | undefined | null): string {
  return mood ? (MOOD_RADIAL[mood] ?? "transparent") : "transparent";
}

// Subtle shimmer sweep overlay (low-opacity) for each mood.
const MOOD_SHIM: Record<string, string> = {
  chill: "rgba(0,245,212,0.04)",
  focus: "rgba(59,130,246,0.04)",
  happy: "rgba(250,204,21,0.04)",
  melancholic: "rgba(100,116,139,0.04)",
  energetic: "rgba(249,115,22,0.04)",
  ambient: "rgba(139,92,246,0.04)",
};

/**
 * Resolve a mood to its shimmer highlight color for the animated overlay.
 */
export function moodShimmerColor(mood: string | undefined | null): string {
  return mood ? (MOOD_SHIM[mood] ?? "transparent") : "transparent";
}


