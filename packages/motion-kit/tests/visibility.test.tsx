import { useRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useElementInView } from "../src/hooks/useElementInView";
afterEach(() => vi.unstubAllGlobals());
function Consumer({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useElementInView(ref, enabled);
  return <div ref={ref}>{visible ? "visible" : "static"}</div>;
}
it("keeps a static fallback when observers are missing", () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  render(<Consumer />);
  expect(screen.getByText("static")).toBeVisible();
});
it("disconnects visibility observation on disable and unmount", () => {
  let report: IntersectionObserverCallback | undefined;
  let target: Element | undefined;
  const disconnect = vi.fn();
  class Observer {
    constructor(callback: IntersectionObserverCallback) {
      report = callback;
    }
    observe(node: Element) {
      target = node;
    }
    disconnect = disconnect;
  }
  vi.stubGlobal("IntersectionObserver", Observer);
  const { rerender, unmount } = render(<Consumer />);
  act(() =>
    report?.(
      [{ target, isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );
  expect(screen.getByText("visible")).toBeVisible();
  rerender(<Consumer enabled={false} />);
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(screen.getByText("static")).toBeVisible();
  rerender(<Consumer />);
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(2);
});
