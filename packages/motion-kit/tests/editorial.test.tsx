import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { EditorialSlider, MeasureScale, RulerScrollIndicator } from "../src/editorial";
it("renders editorial content visibly on the server", () => {
  const html = renderToString(
    <MotionProvider>
      <EditorialSlider
        label="Stories"
        slides={[
          { id: "one", title: "Clear & readable", media: <p>Media</p>, children: <p>Body copy</p> },
        ]}
      />
    </MotionProvider>,
  );
  expect(html).toContain("Clear &amp; readable");
  expect(html).toContain("Body copy");
  expect(html).not.toContain("inset(0 100%");
});
it("moves through named slides with native controls", async () => {
  render(
    <MotionProvider reducedMotion="always">
      <EditorialSlider
        label="Stories"
        slides={[
          { id: "one", title: "One", media: "Image one", children: "Copy one" },
          { id: "two", title: "Two", media: "Image two", children: "Copy two" },
        ]}
      />
    </MotionProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Next Stories" }));
  expect(await screen.findByRole("heading", { name: "Two" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Stories: static playback" })).toBeDisabled();
});
it("validates scale bounds and ambiguous navigation IDs", () => {
  expect(() => render(<MeasureScale label="Scale" count={121} />)).toThrow("ticks");
  expect(() =>
    render(
      <RulerScrollIndicator
        label="Nav"
        sections={[
          { id: "same", label: "One" },
          { id: "same", label: "Two" },
        ]}
      />,
    ),
  ).toThrow("unique");
});
