import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { WordReveal, CharacterReveal, Typewriter, AnimatedNumber } from "../src/text";
import { splitText } from "../src/text/segmentation";

describe("text semantics", () => {
  it("keeps emoji and combining marks in complete graphemes", () => {
    expect(splitText("A👨‍👩‍👧‍👦é", "characters")).toEqual(["A", "👨‍👩‍👧‍👦", "é"]);
    expect(splitText("One  thought.\nNext", "words").join("")).toBe("One  thought.\nNext");
  });
  it("exposes one complete heading to assistive technology", () => {
    render(
      <MotionProvider reducedMotion="always">
        <h2>
          <CharacterReveal>A complete thought.</CharacterReveal>
        </h2>
      </MotionProvider>,
    );
    expect(screen.getByRole("heading", { name: "A complete thought." })).toBeInTheDocument();
  });
  it("preserves full text and safely escapes HTML during SSR", () => {
    const html = renderToString(
      <MotionProvider>
        <WordReveal>{"<script>text only</script>"}</WordReveal>
        <Typewriter>Complete sentence</Typewriter>
      </MotionProvider>,
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Complete sentence");
    expect(html).not.toContain("opacity:0");
  });
  it("uses finite numeric fallback and deterministic locale formatting", () => {
    render(
      <MotionProvider reducedMotion="always">
        <h2>
          <AnimatedNumber value={Infinity} locale="!" decimals={NaN} />
        </h2>
        <h3>
          <AnimatedNumber value={1234.5} decimals={2} />
        </h3>
      </MotionProvider>,
    );
    expect(screen.getByRole("heading", { name: "0" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1,234.50" })).toBeInTheDocument();
  });
});
