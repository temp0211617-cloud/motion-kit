import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { ParticleField, NoiseField, ImageTrail, CursorTrail } from "../src/experimental";
it("renders deterministic readable fields with static noise fallback on the server", () => {
  const content = (
    <MotionProvider>
      <ParticleField count={24}>
        <h2>One readable scene</h2>
      </ParticleField>
      <NoiseField>
        <p>Static grain</p>
      </NoiseField>
    </MotionProvider>
  );
  const first = renderToString(content),
    second = renderToString(content);
  expect(first).toBe(second);
  expect(first.match(/One readable scene/g)).toHaveLength(1);
  expect(first).not.toContain("feTurbulence");
  expect(first).toContain("repeating-linear-gradient");
});
it("preserves native child drafts through reduced pointer fallback", () => {
  const content = (reduced: "user" | "always") => (
    <MotionProvider reducedMotion={reduced}>
      <CursorTrail>
        <label>
          Draft
          <input />
        </label>
      </CursorTrail>
    </MotionProvider>
  );
  const view = render(content("user"));
  fireEvent.change(screen.getByRole("textbox", { name: "Draft" }), {
    target: { value: "Keep this" },
  });
  view.rerender(content("always"));
  expect(screen.getByRole("textbox", { name: "Draft" })).toHaveValue("Keep this");
});
it("keeps image trails unloaded and the native cursor intact on the server", () => {
  const html = renderToString(
    <MotionProvider>
      <ImageTrail src="/study.svg">
        <button type="button">Explore</button>
      </ImageTrail>
    </MotionProvider>,
  );
  expect(html).not.toContain("<img");
  expect(html).not.toContain("cursor:none");
  expect(html).toContain("Explore");
});
it("rejects unsafe trail sources and excessive particle counts", () => {
  expect(() => render(<ImageTrail src="javascript:alert(1)">Scene</ImageTrail>)).toThrow(
    "safe URL",
  );
  expect(() => render(<ParticleField count={49}>Scene</ParticleField>)).toThrow("1–48");
});
