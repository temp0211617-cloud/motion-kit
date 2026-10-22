"use client";
import { mediaLayoutTokens } from "../tokens/layout-base";
import { Children, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, type PanInfo } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { motionTokens } from "../tokens/motion-base";
import { useRailNavigation } from "./useRailNavigation";
import { RailControls, RailItems, railViewportStyle } from "./RailControls";
export interface RailProps {
  children: ReactNode;
  label: string;
  className?: string;
  initialIndex?: number;
}
type RailKind = "film" | "drag" | "momentum" | "infinite" | "snap";
export function Rail({
  children,
  label,
  className,
  initialIndex = 0,
  kind,
  snap = true,
  edgeFade = false,
}: RailProps & { kind: RailKind; snap?: boolean; edgeFade?: boolean }) {
  if (!label.trim()) throw new Error("A media rail requires a label");
  const items = Children.toArray(children);
  const reduced = useMotionPreference();
  const {
    keyDown,
    viewportRef,
    limitsRef,
    active,
    scrollable,
    navTargetRef,
    measure,
    go: nativeGo,
    observeScroll,
  } = useRailNavigation(items, initialIndex, reduced, kind === "infinite");
  const inView = useElementInView(viewportRef, !reduced),
    offset = useMotionValue(0);
  const [gesturing, setGesturing] = useState(false);
  const gestureAllowed = useRef(false),
    nativeSync = useRef(false),
    dragged = useRef(false),
    cancelled = useRef(false);
  const dragging = kind === "drag" || kind === "momentum" || kind === "film";
  const id = useId();
  const move = (value: number) => offset.set(Math.max(0, Math.min(limitsRef.current.max, value)));
  useMotionValueEvent(offset, "change", (value) => {
    if (viewportRef.current && !nativeSync.current) viewportRef.current.scrollLeft = value;
  });
  useEffect(() => {
    if (reduced || !inView) {
      offset.stop();
      const node = viewportRef.current;
      if (node && typeof node.scrollTo === "function")
        node.scrollTo({ left: node.scrollLeft, behavior: "auto" });
    }
    return () => offset.stop();
  }, [inView, offset, reduced, viewportRef]);
  const go = (index: number) => {
    offset.stop();
    setGesturing(false);
    nativeGo(index);
  };
  const finish = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (
      cancelled.current ||
      !gestureAllowed.current ||
      reduced ||
      ("pointerType" in _event && _event.pointerType !== "mouse")
    ) {
      setGesturing(false);
      return;
    }
    const velocity = Number.isFinite(info.velocity.x)
      ? Math.max(-1000, Math.min(1000, info.velocity.x))
      : 0;
    const current = viewportRef.current?.scrollLeft ?? 0;
    offset.set(current);
    const target = Math.max(
      0,
      Math.min(
        limitsRef.current.max,
        current -
          (kind === "momentum" || kind === "film"
            ? velocity * motionTokens.media.momentumFactor
            : 0),
      ),
    );
    void animate(offset, target, {
      duration:
        kind === "momentum" || kind === "film"
          ? motionTokens.duration.relaxed
          : motionTokens.duration.fast,
      ease: motionTokens.ease.exit,
      onComplete: () => setGesturing(false),
    });
  };
  return (
    <div className={className} style={{ minWidth: 0 }}>
      <motion.div
        id={id}
        ref={viewportRef}
        role="region"
        aria-label={label}
        aria-roledescription="carousel"
        tabIndex={items.length ? 0 : undefined}
        style={{
          ...railViewportStyle,
          cursor: dragging ? "grab" : "auto",
          userSelect: gesturing ? "none" : "auto",
          scrollSnapType:
            gesturing || reduced || !snap
              ? "none"
              : kind === "snap" || kind === "film"
                ? "x mandatory"
                : "x proximity",
          maskImage:
            edgeFade && !reduced
              ? "linear-gradient(to right,transparent,black 4%,black 96%,transparent)"
              : "none",
        }}
        onPointerDownCapture={() => {
          navTargetRef.current = null;
          dragged.current = false;
        }}
        onWheelCapture={() => {
          navTargetRef.current = null;
        }}
        onDragStartCapture={(event) => event.preventDefault()}
        onScroll={(event) => {
          const value = event.currentTarget.scrollLeft;
          if (!gesturing && Math.abs(offset.get() - value) > 0.5) {
            nativeSync.current = true;
            offset.set(value);
            nativeSync.current = false;
          }
          observeScroll(value);
        }}
        onKeyDown={(event) => keyDown(event, go)}
        onClickCapture={(event) => {
          if (dragged.current && event.detail > 0) {
            event.preventDefault();
            event.stopPropagation();
          }
          dragged.current = false;
        }}
        onPointerCancel={() => {
          cancelled.current = true;
          offset.stop();
          setGesturing(false);
        }}
        {...(dragging && !reduced
          ? {
              onPanStart: (event: MouseEvent | TouchEvent | PointerEvent) => {
                if ("pointerType" in event && event.pointerType !== "mouse") return;
                const target = event.target as Element | null;
                gestureAllowed.current =
                  kind === "film" ||
                  !(
                    typeof target?.closest === "function" &&
                    target.closest(
                      "input,textarea,select,button,a,video,audio,[contenteditable=true]",
                    )
                  );
                if (!gestureAllowed.current) return;
                cancelled.current = false;
                dragged.current = true;
                offset.stop();
                measure();
                offset.set(viewportRef.current?.scrollLeft ?? 0);
                setGesturing(true);
              },
              onPan: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                if ("pointerType" in event && event.pointerType !== "mouse") return;
                if (!gestureAllowed.current) return;
                move((viewportRef.current?.scrollLeft ?? 0) - info.delta.x);
              },
              onPanEnd: finish,
            }
          : {})}
      >
        <RailItems
          items={items}
          width={kind === "film" ? mediaLayoutTokens.filmItemWidth : "100%"}
        />
      </motion.div>
      <RailControls
        id={id}
        label={label}
        count={items.length}
        active={active}
        scrollable={scrollable}
        go={go}
        cycle={kind === "infinite"}
      />
    </div>
  );
}
