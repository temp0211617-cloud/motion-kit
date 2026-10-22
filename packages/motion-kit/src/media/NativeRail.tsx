"use client";
import { mediaLayoutTokens } from "../tokens/layout-base";
import { Children, useId } from "react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import type { RailProps } from "./Rail";
import { useRailNavigation } from "./useRailNavigation";
import { RailControls, RailItems, railViewportStyle } from "./RailControls";

/** Native scrolling needs no gesture controller or animation-frame subscription. */
export function NativeRail({ children, label, className, initialIndex = 0 }: RailProps) {
  if (!label.trim()) throw new Error("A media rail requires a label");
  const items = Children.toArray(children),
    reduced = useMotionPreference(),
    id = useId();
  const { keyDown, viewportRef, active, scrollable, navTargetRef, go, observeScroll } =
    useRailNavigation(items, initialIndex, reduced);
  return (
    <div className={className} style={{ minWidth: 0 }}>
      <div
        id={id}
        ref={viewportRef}
        role="region"
        aria-label={label}
        aria-roledescription="media rail"
        tabIndex={items.length ? 0 : undefined}
        style={{
          ...railViewportStyle,
          scrollSnapType: reduced ? "none" : "x proximity",
        }}
        onPointerDownCapture={() => {
          navTargetRef.current = null;
        }}
        onWheelCapture={() => {
          navTargetRef.current = null;
        }}
        onDragStartCapture={(event) => event.preventDefault()}
        onScroll={(event) => observeScroll(event.currentTarget.scrollLeft)}
        onKeyDown={keyDown}
      >
        <RailItems items={items} width={mediaLayoutTokens.railItemWidth} />
      </div>
      <RailControls
        id={id}
        label={label}
        count={items.length}
        active={active}
        scrollable={scrollable}
        go={go}
      />
    </div>
  );
}
