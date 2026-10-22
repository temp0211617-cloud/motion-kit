import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { FadeUp, ScrollReveal, Stagger, StaggerItem, Presence, PageTransition } from "../src/core";

class Observer {
  static instances: Observer[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  constructor(public callback: IntersectionObserverCallback) {
    Observer.instances.push(this);
  }
}
beforeEach(() => {
  Observer.instances = [];
  vi.stubGlobal("IntersectionObserver", Observer);
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
});
afterEach(() => vi.unstubAllGlobals());

describe("core motion", () => {
  it("keeps SSR content visible without JavaScript", () => {
    const html = renderToString(
      <MotionProvider>
        <FadeUp>
          <h2>Readable on the server</h2>
        </FadeUp>
        <ScrollReveal>Viewport content</ScrollReveal>
        <Stagger>
          <StaggerItem index={0}>Chapter</StaggerItem>
        </Stagger>
        <Presence show>Present</Presence>
      </MotionProvider>,
    );
    expect(html).toContain("Readable on the server");
    expect(html).toContain("Viewport content");
    expect(html).not.toContain("opacity:0");
  });
  it("skips observers and movement when reduced motion is forced", () => {
    render(
      <MotionProvider reducedMotion="always">
        <ScrollReveal data-testid="reveal">Content</ScrollReveal>
      </MotionProvider>,
    );
    expect(Observer.instances).toHaveLength(0);
    expect(screen.getByTestId("reveal")).toHaveStyle({ opacity: "1" });
  });
  it("reveals focused viewport content and cleans up its observer", () => {
    const { unmount } = render(
      <MotionProvider>
        <ScrollReveal data-testid="reveal">
          <button>Focusable child</button>
        </ScrollReveal>
      </MotionProvider>,
    );
    const observer = Observer.instances[0];
    expect(observer?.observe).toHaveBeenCalled();
    fireEvent.focus(screen.getByRole("button"));
    expect(screen.getByTestId("reveal")).toHaveStyle({ opacity: "1" });
    unmount();
    expect(observer?.disconnect).toHaveBeenCalled();
  });
  it("disconnects once a viewport entrance starts", () => {
    render(
      <MotionProvider>
        <ScrollReveal>Observed content</ScrollReveal>
      </MotionProvider>,
    );
    const observer = Observer.instances[0]!;
    act(() =>
      observer.callback(
        [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      ),
    );
    expect(observer.disconnect).toHaveBeenCalled();
  });
  it("requires a stagger timing context", () => {
    expect(() =>
      render(
        <MotionProvider>
          <StaggerItem index={0}>Item</StaggerItem>
        </MotionProvider>,
      ),
    ).toThrow("StaggerItem must be used within Stagger");
  });
  it("hides exit content from the accessibility tree and completes its exit", async () => {
    const complete = vi.fn();
    const { rerender } = render(
      <MotionProvider reducedMotion="always">
        <Presence show onExitComplete={complete}>
          <button>Present action</button>
        </Presence>
      </MotionProvider>,
    );
    rerender(
      <MotionProvider reducedMotion="always">
        <Presence show={false} onExitComplete={complete}>
          <button>Present action</button>
        </Presence>
      </MotionProvider>,
    );
    expect(screen.queryByRole("button", { name: "Present action" })).toBeNull();
    await waitFor(() => expect(complete).toHaveBeenCalledTimes(1));
  });
  it("switches keyed pages in reduced motion", async () => {
    const { rerender } = render(
      <MotionProvider reducedMotion="always">
        <PageTransition transitionKey="1">Page one</PageTransition>
      </MotionProvider>,
    );
    rerender(
      <MotionProvider reducedMotion="always">
        <PageTransition transitionKey="2">Page two</PageTransition>
      </MotionProvider>,
    );
    await waitFor(() => expect(screen.getByText("Page two")).toBeInTheDocument());
    expect(screen.queryByText("Page one")).toBeNull();
  });
});
