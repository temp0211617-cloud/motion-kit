import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import { useMotionPreference } from "../src/hooks/useMotionPreference";

let preference = false;
const listeners = new Set<() => void>();
beforeEach(() => {
  preference = false;
  listeners.clear();
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return preference;
    },
    addEventListener: (_type: string, callback: () => void) => listeners.add(callback),
    removeEventListener: (_type: string, callback: () => void) => listeners.delete(callback),
  }));
});
function Consumer() {
  return <output>{useMotionPreference() ? "reduced" : "animated"}</output>;
}

describe("motion preference", () => {
  it("stays reduced when the browser lacks media queries", () => {
    vi.stubGlobal("matchMedia", undefined);
    render(<Consumer />);
    expect(screen.getByText("reduced")).toBeInTheDocument();
  });
  it("respects OS reduction without a provider and stays conservative on the server", () => {
    expect(renderToString(<Consumer />)).toContain("reduced");
    const { unmount } = render(<Consumer />);
    expect(screen.getByText("animated")).toBeInTheDocument();
    act(() => {
      preference = true;
      listeners.forEach((notify) => notify());
    });
    expect(screen.getByText("reduced")).toBeInTheDocument();
    unmount();
    expect(listeners.size).toBe(0);
  });
  it("uses a conservative SSR fallback", () => {
    expect(
      renderToString(
        <MotionProvider>
          <Consumer />
        </MotionProvider>,
      ),
    ).toContain("reduced");
  });
  it("follows a changed OS preference when rerendered", () => {
    const { unmount } = render(
      <MotionProvider>
        <Consumer />
      </MotionProvider>,
    );
    expect(screen.getByText("animated")).toBeInTheDocument();
    act(() => {
      preference = true;
      listeners.forEach((notify) => notify());
    });
    expect(screen.getByText("reduced")).toBeInTheDocument();
    unmount();
    expect(listeners.size).toBe(0);
  });
  it("respects explicit always and never overrides", () => {
    const { rerender } = render(
      <MotionProvider reducedMotion="always">
        <Consumer />
      </MotionProvider>,
    );
    expect(screen.getByText("reduced")).toBeInTheDocument();
    preference = true;
    rerender(
      <MotionProvider reducedMotion="never">
        <Consumer />
      </MotionProvider>,
    );
    expect(screen.getByText("animated")).toBeInTheDocument();
  });
});
