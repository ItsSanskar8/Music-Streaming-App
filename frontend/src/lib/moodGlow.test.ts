import { describe, it, expect } from "vitest";
import {
  MOOD_GLOW,
  moodGlowColor,
  moodRadialGradient,
  moodShimmerColor,
} from "./moodGlow";

describe("MOOD_GLOW", () => {
  it("has entries for all 6 moods", () => {
    expect(Object.keys(MOOD_GLOW)).toEqual([
      "chill",
      "focus",
      "happy",
      "melancholic",
      "energetic",
      "ambient",
    ]);
  });

  it("uses rgba with 0.06 opacity for each mood", () => {
    for (const color of Object.values(MOOD_GLOW)) {
      expect(color).toMatch(/^rgba\(\d+,\d+,\d+,0\.06\)$/);
    }
  });
});

describe("moodGlowColor", () => {
  it("returns the correct color for a known mood", () => {
    expect(moodGlowColor("chill")).toBe("rgba(0,245,212,0.06)");
    expect(moodGlowColor("focus")).toBe("rgba(59,130,246,0.06)");
  });

  it("returns 'transparent' for an unknown mood string", () => {
    expect(moodGlowColor("unknown")).toBe("transparent");
  });

  it("returns 'transparent' for null", () => {
    expect(moodGlowColor(null)).toBe("transparent");
  });

  it("returns 'transparent' for undefined", () => {
    expect(moodGlowColor(undefined)).toBe("transparent");
  });

  it("returns 'transparent' for an empty string", () => {
    expect(moodGlowColor("")).toBe("transparent");
  });
});

describe("moodRadialGradient", () => {
  it("returns a CSS radial-gradient for a known mood", () => {
    const result = moodRadialGradient("chill");
    expect(result).toContain("radial-gradient");
    expect(result).toContain("rgba(0,245,212");
  });

  it("returns 'transparent' for an unknown mood", () => {
    expect(moodRadialGradient("unknown")).toBe("transparent");
  });

  it("returns 'transparent' for null", () => {
    expect(moodRadialGradient(null)).toBe("transparent");
  });
});

describe("moodShimmerColor", () => {
  it("returns the correct shimmer color for a known mood", () => {
    expect(moodShimmerColor("chill")).toBe("rgba(0,245,212,0.04)");
  });

  it("returns 'transparent' for an unknown mood", () => {
    expect(moodShimmerColor("unknown")).toBe("transparent");
  });

  it("returns 'transparent' for undefined", () => {
    expect(moodShimmerColor(undefined)).toBe("transparent");
  });
});
