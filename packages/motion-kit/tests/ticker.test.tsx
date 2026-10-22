import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { LiveTicker, ImageTicker, RulerTicker } from "../src/ticker";
import { normalizeLoop, safeSpeed, boundedOffset } from "../src/ticker/math";
it("wraps either direction without exceeding a cycle", () => {
  for (const length of [1, 32, 100, 1112])
    for (const value of [-10000, -501, -100, -50, 0, 50, 100, 10000]) {
      const position = normalizeLoop(value, length);
      expect(position).toBeLessThanOrEqual(0);
      expect(position).toBeGreaterThan(-length);
      expect(normalizeLoop(value + length * 3, length)).toBe(position);
    }
  expect(normalizeLoop(NaN, 100)).toBe(0);
  expect(normalizeLoop(10, 0)).toBe(0);
});
it("caps speeds and finite rails without invalid numbers", () => {
  expect(safeSpeed(-10)).toBe(0);
  expect(safeSpeed(1000)).toBe(240);
  expect(safeSpeed(NaN)).toBe(40);
  expect(boundedOffset(-900, 500, 200)).toBe(-300);
  expect(boundedOffset(20, 500, 200)).toBe(0);
  expect(boundedOffset(NaN, 500, 200)).toBe(0);
});
it("SSR renders one complete escaped copy", () => {
  const html = renderToString(
    <MotionProvider>
      <LiveTicker label="Words">
        <span>Quiet & clear</span>
      </LiveTicker>
    </MotionProvider>,
  );
  expect(html.match(/Quiet &amp; clear/g)).toHaveLength(1);
  expect(html).toContain("static layout");
});
it("names controls and keeps reduced rails static", () => {
  render(
    <MotionProvider reducedMotion="always">
      <LiveTicker label="Words">Readable words</LiveTicker>
    </MotionProvider>,
  );
  expect(screen.getByRole("button", { name: "Words: static layout" })).toBeDisabled();
  expect(screen.getByText("Readable words")).toBeVisible();
});
it("rejects unsafe image sources, missing names and invalid rulers", () => {
  expect(() =>
    render(
      <ImageTicker
        label="Images"
        images={[{ src: "javascript:alert(1)", alt: "Image", width: 20, height: 20 }]}
      />,
    ),
  ).toThrow("safe image");
  expect(() => render(<LiveTicker label=" ">Content</LiveTicker>)).toThrow("label");
  expect(() => render(<RulerTicker label="Ruler" count={121} />)).toThrow("2–120");
});
