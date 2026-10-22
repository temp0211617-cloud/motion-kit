import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import {
  Parallax,
  StickyStory,
  ChapterScroll,
  HorizontalScroll,
  useScrollScene,
} from "../src/scroll";
it("renders complete story media and chapters once on the server", () => {
  const html = renderToString(
    <MotionProvider>
      <StickyStory
        label="Chapters"
        chapters={[
          {
            id: "first",
            title: "First",
            body: <p>Readable prose</p>,
            media: <p>Media description</p>,
          },
        ]}
      />
    </MotionProvider>,
  );
  expect(html.match(/Readable prose/g)).toHaveLength(1);
  expect(html.match(/Media description/g)).toHaveLength(1);
  expect(html).toContain("position:static");
  expect(html).not.toContain("opacity:0");
});
it("rejects ambiguous and unsafe chapter identifiers", () => {
  expect(() =>
    render(
      <ChapterScroll
        label="Chapters"
        chapters={[
          { id: "same", title: "One", body: "Body" },
          { id: "same", title: "Two", body: "Body" },
        ]}
      />,
    ),
  ).toThrow("unique safe");
  expect(() =>
    render(
      <ChapterScroll label="Chapters" chapters={[{ id: "#unsafe", title: "One", body: "Body" }]} />,
    ),
  ).toThrow("unique safe");
});
it("keeps focused semantic actions readable with forced reduction", () => {
  render(
    <MotionProvider reducedMotion="always">
      <Parallax>
        <a href="#read">Read</a>
      </Parallax>
      <HorizontalScroll label="Rail">
        <button>Action</button>
      </HorizontalScroll>
    </MotionProvider>,
  );
  expect(screen.getByRole("link", { name: "Read" })).toBeVisible();
  expect(screen.getByRole("region", { name: "Rail" })).toHaveStyle({ flexDirection: "column" });
});
it("requires a scene context for custom scroll consumers", () => {
  function Consumer() {
    useScrollScene();
    return null;
  }
  expect(() => render(<Consumer />)).toThrow("requires ScrollScene");
});
