import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MoodShimmer from "./MoodShimmer";

describe("MoodShimmer", () => {
  it("renders a motion div", () => {
    const { container } = render(<MoodShimmer mood="chill" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("DIV");
  });

  it("includes the shimmer animation class", () => {
    const { container } = render(<MoodShimmer mood="focus" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("animate-mood-shimmer");
  });

  it("has the correct zIndex", () => {
    const { container } = render(<MoodShimmer mood="chill" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.zIndex).toBe("-5");
  });

  it("includes the shimmer color in the background gradient for a known mood", () => {
    const { container } = render(<MoodShimmer mood="happy" />);
    const el = container.firstChild as HTMLElement;
    // Browser normalises rgba — strip spaces before matching
    const bg = el.style.background.replace(/\s/g, "");
    expect(bg).toContain("rgba(250,204,21,0.04)");
  });

  it("renders with transparent shimmer for null mood", () => {
    const { container } = render(<MoodShimmer mood={null} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toContain("transparent");
  });

  it("is pointer-events-none", () => {
    const { container } = render(<MoodShimmer mood="energetic" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("pointer-events-none");
  });
});
