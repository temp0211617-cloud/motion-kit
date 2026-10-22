import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { MotionProvider } from "../src/providers/MotionProvider";
import {
  Pressable,
  HoverScale,
  HoverLift,
  HoverMagnet,
  CursorAttract,
  TiltSurface,
  FollowPointer,
  DragSurface,
  ElasticDrag,
  SwipeAction,
  LongPressMotion,
} from "../src/gestures";

afterEach(() => vi.useRealTimers());
const surfaces = [HoverScale, HoverLift, HoverMagnet, CursorAttract, TiltSurface, FollowPointer];
it("server renders one readable child subtree and native alternatives", () => {
  const html = renderToString(
    <MotionProvider reducedMotion="always">
      {surfaces.map((Surface, index) => (
        <Surface key={index}>
          <p>Surface {index}</p>
        </Surface>
      ))}
      <DragSurface label="Drag">
        <input aria-label="Draft" defaultValue="Keep" />
      </DragSurface>
      <ElasticDrag label="Elastic">Content</ElasticDrag>
      <SwipeAction label="Swipe" actionLabel="Mark item" onAction={() => {}}>
        Item
      </SwipeAction>
      <LongPressMotion label="mark" onLongPress={() => {}} />
    </MotionProvider>,
  );
  const text = new DOMParser().parseFromString(html, "text/html").body.textContent;
  expect(text?.match(/Surface [0-5]/g)).toHaveLength(6);
  expect(html).toContain('value="Keep"');
  expect(html).toContain('aria-label="Move Drag right"');
  expect(html).toContain("Mark item");
  expect(html).toContain("Activate");
  expect(html).not.toContain("translateX");
});
it("Pressable keeps native non-submitting and disabled behavior", () => {
  const submit = vi.fn(),
    action = vi.fn();
  const { rerender } = render(
    <MotionProvider reducedMotion="always">
      <form onSubmit={submit}>
        <Pressable onClick={action}>Mark</Pressable>
      </form>
    </MotionProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Mark" }));
  expect(action).toHaveBeenCalledTimes(1);
  expect(submit).not.toHaveBeenCalled();
  rerender(
    <MotionProvider reducedMotion="always">
      <Pressable disabled onClick={action}>
        Mark
      </Pressable>
    </MotionProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Mark" }));
  expect(action).toHaveBeenCalledTimes(1);
});
it("long hold fires once, ignores key repeats, and has an ordinary activation alternative", () => {
  vi.useFakeTimers();
  const action = vi.fn();
  render(
    <MotionProvider reducedMotion="always">
      <LongPressMotion label="mark" onLongPress={action} />
    </MotionProvider>,
  );
  const hold = screen.getByRole("button", { name: "Hold mark" });
  fireEvent.keyDown(hold, { key: " " });
  act(() => vi.advanceTimersByTime(650));
  fireEvent.keyDown(hold, { key: " ", repeat: true });
  act(() => vi.advanceTimersByTime(1000));
  expect(action).toHaveBeenCalledTimes(1);
  fireEvent.keyUp(hold, { key: " " });
  fireEvent.click(screen.getByRole("button", { name: "Activate mark" }));
  expect(action).toHaveBeenCalledTimes(2);
});
it("cancels long holds on release, visibility loss, disable, callback change and unmount", () => {
  vi.useFakeTimers();
  const action = vi.fn(),
    replacement = vi.fn();
  const view = (disabled = false, callback = action) => (
    <MotionProvider reducedMotion="always">
      <LongPressMotion label="mark" disabled={disabled} onLongPress={callback} />
    </MotionProvider>
  );
  const { rerender, unmount } = render(view());
  const hold = () => screen.getByRole("button", { name: "Hold mark" });
  fireEvent.keyDown(hold(), { key: "Enter" });
  fireEvent.keyUp(hold(), { key: "Enter" });
  act(() => vi.advanceTimersByTime(700));
  expect(action).not.toHaveBeenCalled();
  fireEvent.keyDown(hold(), { key: "Enter" });
  Object.defineProperty(document, "hidden", { configurable: true, value: true });
  fireEvent(document, new Event("visibilitychange"));
  Reflect.deleteProperty(document, "hidden");
  act(() => vi.advanceTimersByTime(700));
  expect(action).not.toHaveBeenCalled();
  fireEvent.keyDown(hold(), { key: "Enter" });
  rerender(view(true));
  act(() => vi.advanceTimersByTime(700));
  expect(action).not.toHaveBeenCalled();
  rerender(view());
  fireEvent.keyDown(hold(), { key: "Enter" });
  rerender(view(false, replacement));
  act(() => vi.advanceTimersByTime(700));
  expect(action).not.toHaveBeenCalled();
  expect(replacement).not.toHaveBeenCalled();
  fireEvent.keyDown(hold(), { key: "Enter" });
  unmount();
  act(() => vi.advanceTimersByTime(700));
  expect(replacement).not.toHaveBeenCalled();
});
it("preserves focused drafts through disabled and reduced surface changes", () => {
  const view = (disabled: boolean, reduced: "always" | "never") => (
    <MotionProvider reducedMotion={reduced}>
      <HoverMagnet disabled={disabled}>
        <input aria-label="Draft" />
      </HoverMagnet>
    </MotionProvider>
  );
  const { rerender } = render(view(false, "never"));
  const draft = screen.getByRole("textbox", { name: "Draft" });
  fireEvent.change(draft, { target: { value: "Persistent" } });
  draft.focus();
  rerender(view(true, "always"));
  expect(draft).toHaveValue("Persistent");
  expect(draft).toHaveFocus();
  rerender(view(false, "never"));
  expect(draft).toHaveValue("Persistent");
});
it("swipe activation stays explicit and respects dynamic disabled state", () => {
  const action = vi.fn();
  const view = (disabled: boolean) => (
    <SwipeAction label="Item" actionLabel="Mark item" disabled={disabled} onAction={action}>
      Copy
    </SwipeAction>
  );
  const { rerender } = render(view(true));
  fireEvent.click(screen.getByRole("button", { name: "Mark item" }));
  expect(action).not.toHaveBeenCalled();
  rerender(view(false));
  fireEvent.click(screen.getByRole("button", { name: "Mark item" }));
  expect(action).toHaveBeenCalledTimes(1);
});
it("rejects unnamed actions and non-finite or unbounded hold delays", () => {
  expect(() => renderToString(<DragSurface label=" ">Copy</DragSurface>)).toThrow("label");
  expect(() =>
    renderToString(
      <SwipeAction label="Item" actionLabel="" onAction={() => {}}>
        Copy
      </SwipeAction>,
    ),
  ).toThrow("labels");
  for (const delayMs of [NaN, Infinity, 299, 2001])
    expect(() =>
      renderToString(<LongPressMotion label="mark" delayMs={delayMs} onLongPress={() => {}} />),
    ).toThrow("delay");
});
