import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { Curtains, DepthSection, FloatingHeroObjects, ImageMaskReveal } from "../src/cinematic";

it("renders a single visible scene with two inert decorative curtains on the server", () => {
  const html = renderToString(
    <MotionProvider>
      <Curtains>
        <h2>Clear & open</h2>
        <button type="button">Explore</button>
      </Curtains>
    </MotionProvider>,
  );
  expect(html.match(/Clear &amp; open/g)).toHaveLength(1);
  expect(html.match(/aria-hidden="true" inert=""/g)).toHaveLength(2);
  expect(html).toContain("scaleX(0)");
  expect(html).not.toContain("opacity:0");
});
it("replays without remounting drafts and changes axis without hiding reduced content", () => {
  const content = (key: number, direction: "horizontal" | "vertical") => (
    <MotionProvider reducedMotion="always">
      <Curtains replayKey={key} direction={direction}>
        <label>
          Draft
          <input defaultValue="" />
        </label>
      </Curtains>
    </MotionProvider>
  );
  const view = render(content(0, "horizontal"));
  fireEvent.change(screen.getByRole("textbox", { name: "Draft" }), {
    target: { value: "Keep this" },
  });
  view.rerender(content(1, "vertical"));
  expect(screen.getByRole("textbox", { name: "Draft" })).toHaveValue("Keep this");
});
it("preserves depth children when the provider becomes static", () => {
  const content = (reduced: "user" | "always") => (
    <MotionProvider reducedMotion={reduced}>
      <DepthSection>
        <label>
          Note
          <input />
        </label>
      </DepthSection>
    </MotionProvider>
  );
  const view = render(content("user"));
  fireEvent.change(screen.getByRole("textbox", { name: "Note" }), { target: { value: "Stable" } });
  view.rerender(content("always"));
  expect(screen.getByRole("textbox", { name: "Note" })).toHaveValue("Stable");
});
it("rejects unsafe image sources and excessive decorative objects", () => {
  expect(() =>
    render(<ImageMaskReveal src="javascript:alert(1)" alt="Study" width={400} height={240} />),
  ).toThrow("safe URL");
  expect(() =>
    render(
      <FloatingHeroObjects objects={Array.from({ length: 9 }, () => "Object")}>
        Scene
      </FloatingHeroObjects>,
    ),
  ).toThrow("eight");
});
