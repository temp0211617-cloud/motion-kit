import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { HoverCard, ExpandableCard, HoverRevealCard, StackCard } from "../src/cards";
it("server renders readable content once and escapes text", () => {
  const html = renderToString(
    <MotionProvider>
      <StackCard>
        <h2>Safe & clear</h2>
      </StackCard>
    </MotionProvider>,
  );
  expect(html).toContain("Safe &amp; clear");
  expect(html.match(/<h2>/g)).toHaveLength(1);
});
it("keeps native actions inside semantic surfaces", () => {
  render(
    <MotionProvider reducedMotion="always">
      <HoverCard>
        <a href="#details">Explore</a>
      </HoverCard>
    </MotionProvider>,
  );
  expect(screen.getByRole("article")).toContainElement(
    screen.getByRole("link", { name: "Explore" }),
  );
});
it("requires meaningful disclosure labels", () => {
  expect(() => render(<ExpandableCard summary=" ">Content</ExpandableCard>)).toThrow("summary");
});
it("explicit reveal hides child controls until activated", () => {
  render(
    <HoverRevealCard summary="Details">
      <button>Inner action</button>
    </HoverRevealCard>,
  );
  expect(screen.queryByRole("button", { name: "Inner action" })).toBeNull();
  const toggle = screen.getByRole("button", { name: "Details" });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("button", { name: "Inner action" })).toBeVisible();
  fireEvent.click(toggle);
  expect(screen.queryByRole("button", { name: "Inner action" })).toBeNull();
});
