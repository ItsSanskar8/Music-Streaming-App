"use client";

// AmbientEffects — a single component that bundles the mood-matched ambient
// background glow (MoodGlow) with the subtle shimmer sweep (MoodShimmer).
// Use this on any page with song mood context instead of importing both
// components separately.

import MoodGlow from "@/components/ui/MoodGlow";
import MoodShimmer from "@/components/ui/MoodShimmer";

interface Props {
  /** The mood string that drives both effects. */
  mood: string | undefined | null;
  /** Set to false to disable the shimmer sweep (default: true). */
  shimmer?: boolean;
}

export default function AmbientEffects({ mood, shimmer = true }: Props) {
  return (
    <>
      <MoodGlow mood={mood} />
      {shimmer && <MoodShimmer mood={mood} />}
    </>
  );
}
