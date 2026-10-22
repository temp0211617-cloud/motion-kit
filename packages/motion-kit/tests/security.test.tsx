import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { Reveal, PageTransition, type RevealProps, type PageTransitionProps } from "../src/core";
import { MotionButton, type MotionButtonProps } from "../src/interactions";
it("rejects raw HTML from untyped caller DOM props", () => {
  const unsafe = { dangerouslySetInnerHTML: { __html: "<strong>Untrusted markup</strong>" } };
  expect(() =>
    render(
      <MotionProvider>
        <Reveal {...(unsafe as RevealProps)} />
      </MotionProvider>,
    ),
  ).toThrow("Raw HTML");
  expect(() =>
    render(
      <MotionProvider>
        <PageTransition
          {...({ ...unsafe, transitionKey: "one" } as unknown as PageTransitionProps)}
        />
      </MotionProvider>,
    ),
  ).toThrow("Raw HTML");
  expect(() =>
    render(
      <MotionProvider>
        <MotionButton {...(unsafe as MotionButtonProps)} />
      </MotionProvider>,
    ),
  ).toThrow("Raw HTML");
});
