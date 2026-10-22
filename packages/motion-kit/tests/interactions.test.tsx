import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { MotionButton, LoadingButton, IconMotionButton, ArrowLink } from "../src/interactions";
import { safeHref } from "../src/interactions/url";

describe("safe link URLs", () => {
  it.each([
    "javascript:alert(1)",
    "data:text/html,test",
    "vbscript:test",
    "file:///tmp/test",
    "blob:https://example.invalid/test",
    "https://user:example@example.invalid/",
    "",
    `java${String.fromCharCode(10)}script:alert(1)`,
  ])("rejects unsupported scheme %s", (href) => {
    expect(() => safeHref(href)).toThrow("safe URL");
  });
  it.each([
    "https://example.invalid/",
    "/docs",
    "#chapter",
    "?page=2",
    "mailto:test@example.invalid",
    "tel:+10000000000",
  ])("accepts navigable URL %s", (href) => {
    expect(safeHref(href)).toBe(href);
  });
});
describe("button semantics", () => {
  it.each(["_BLANK", "reading-window"])("isolates new browsing target %s", (target) => {
    render(
      <MotionProvider>
        <ArrowLink href="https://example.invalid/" target={target} rel="external">
          Read
        </ArrowLink>
      </MotionProvider>,
    );
    expect(screen.getByRole("link", { name: "Read" })).toHaveAttribute(
      "rel",
      "external noopener noreferrer",
    );
  });
  it("defaults to a non-submitting button", () => {
    const submit = vi.fn();
    const activate = vi.fn();
    render(
      <MotionProvider>
        <form onSubmit={submit}>
          <MotionButton onClick={activate}>Action</MotionButton>
        </form>
      </MotionProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Action" }));
    expect(activate).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
  });
  it("blocks a busy action and retains its accessible name", () => {
    const activate = vi.fn();
    render(
      <MotionProvider>
        <LoadingButton loading onClick={activate}>
          Save draft
        </LoadingButton>
      </MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Save draft" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(activate).not.toHaveBeenCalled();
  });
  it("requires a named icon action", () => {
    expect(() =>
      render(
        <MotionProvider>
          <IconMotionButton label="">+</IconMotionButton>
        </MotionProvider>,
      ),
    ).toThrow("non-empty label");
  });
  it("isolates a new-tab opener", () => {
    render(
      <MotionProvider>
        <ArrowLink href="https://example.invalid/" target="_blank">
          Read
        </ArrowLink>
      </MotionProvider>,
    );
    expect(screen.getByRole("link", { name: "Read" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
