import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MoodGlow from "./MoodGlow";

describe("MoodGlow", () => {
  it("renders a motion div", () => {
    const { container } = render(<MoodGlow mood="chill" />);
    // Should render a div (framer-motion motion.div renders as a div)
    const el = container.firstChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("DIV");
  });

  it("has the correct background for a known mood", () => {
    const { container } = render(<MoodGlow mood="chill" />);
    const el = container.firstChild as HTMLElement;
    // Browser normalises rgba — match the spaced format
    expect(el.style.background.replace(/\s/g, "")).toBe("rgba(0,245,212,0.06)");
  });

  it("has transparent background for null mood", () => {
    const { container } = render(<MoodGlow mood={null} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toBe("transparent");
  });

  it("has transparent background for undefined mood", () => {
    const { container } = render(<MoodGlow mood={undefined} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.background).toBe("transparent");
  });

  it("is pointer-events-none", () => {
    const { container } = render(<MoodGlow mood="focus" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("pointer-events-none");
  });
});
