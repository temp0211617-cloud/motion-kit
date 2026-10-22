import { act, renderHook } from "@testing-library/react";
import type { PointerEvent } from "react";
import { expect, it, vi } from "vitest";
import { usePointerTilt } from "../src/hooks/usePointerTilt";

it("caches pointer geometry, invalidates on nested scroll/resize, and removes active listeners", () => {
  const node = document.createElement("div");
  const geometry = vi.spyOn(node, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: 200,
    height: 100,
  } as DOMRect);
  const { result, rerender, unmount } = renderHook(
    ({ enabled }) => usePointerTilt(false, enabled),
    { initialProps: { enabled: true } },
  );
  const event = {
    currentTarget: node,
    pointerType: "mouse",
    clientX: 100,
    clientY: 50,
  } as unknown as PointerEvent<HTMLElement>;
  act(() => {
    result.current.onPointerEnter(event);
    for (let i = 0; i < 30; i++) result.current.onPointerMove(event);
  });
  expect(geometry).toHaveBeenCalledTimes(1);
  act(() => window.dispatchEvent(new Event("scroll")));
  expect(result.current.bounds.current).toBeNull();
  act(() => result.current.onPointerMove(event));
  expect(geometry).toHaveBeenCalledTimes(2);
  act(() => window.dispatchEvent(new Event("resize")));
  act(() => result.current.onPointerMove(event));
  expect(geometry).toHaveBeenCalledTimes(3);
  rerender({ enabled: false });
  act(() => result.current.onPointerMove(event));
  expect(geometry).toHaveBeenCalledTimes(3);
  const remove = vi.spyOn(window, "removeEventListener");
  rerender({ enabled: true });
  act(() => result.current.onPointerEnter(event));
  unmount();
  expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function), true);
  expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
  remove.mockRestore();
});
