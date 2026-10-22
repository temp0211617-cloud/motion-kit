import type { InteractionSurfaceProps, PressableProps, SwipeActionProps } from "../src/gestures";
const surface: InteractionSurfaceProps = {
  children: "Copy",
  // @ts-expect-error Surface children cannot be replaced with raw HTML.
  dangerouslySetInnerHTML: { __html: "Unsupported" },
};
const pressable: PressableProps = {
  // @ts-expect-error Native pressable rejects raw HTML.
  dangerouslySetInnerHTML: { __html: "Unsupported" },
};
// @ts-expect-error Swipe actions require a named native activation alternative.
const swipe: SwipeActionProps = { label: "Item", children: "Copy", onAction: () => {} };
void surface;
void pressable;
void swipe;
