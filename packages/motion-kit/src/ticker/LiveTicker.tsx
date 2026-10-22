"use client";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView, useVisibilitySupport } from "../hooks/useElementInView";
import { spacingTokens, layoutTokens, motionTokens } from "../tokens";
import { boundedOffset, normalizeLoop, safeSpeed } from "./math";
export interface LiveTickerProps {
  children: ReactNode;
  label: string;
  className?: string;
  speed?: number | MotionValue<number>;
  axis?: "horizontal" | "vertical";
  direction?: "forward" | "reverse";
  autoplay?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  edgeFade?: boolean;
  loop?: boolean;
  snapStep?: number;
  gap?: number | string;
  offset?: MotionValue<number>;
  semantic?: "group" | "list";
}
export function LiveTicker({
  children,
  label,
  className,
  speed = motionTokens.text.tickerSpeed,
  axis = "horizontal",
  direction = "forward",
  autoplay = false,
  pauseOnHover = true,
  draggable = false,
  edgeFade = false,
  loop = true,
  snapStep = 0,
  gap = spacingTokens[6],
  offset,
  semantic = "group",
}: LiveTickerProps) {
  if (!label.trim()) throw new Error("LiveTicker requires a label");
  const reduced = useMotionPreference();
  const root = useRef<HTMLDivElement>(null),
    first = useRef<HTMLDivElement>(null);
  const cancelled = useRef(false);
  const inView = useElementInView(root, !reduced);
  const ownedOffset = useMotionValue(0);
  const raw = offset ?? ownedOffset;
  const length = useMotionValue(0),
    viewport = useMotionValue(0);
  const position = useTransform(() =>
    loop
      ? normalizeLoop(raw.get(), length.get())
      : boundedOffset(raw.get(), length.get(), viewport.get()),
  );
  const [playing, setPlaying] = useState(autoplay),
    [hovered, setHovered] = useState(false),
    [dragging, setDragging] = useState(false);
  const [metrics, setMetrics] = useState({ copies: 1, capped: false });
  const items = Children.toArray(children);
  const supported = useVisibilitySupport();
  const staticLayout = reduced || !supported || metrics.capped || items.length > 64;
  const active = playing && !staticLayout && !hovered && !dragging && inView && items.length > 0;
  const measure = useCallback(() => {
    if (!first.current || !root.current) return;
    const box = first.current.getBoundingClientRect();
    const size = axis === "horizontal" ? box.width : box.height;
    const available = axis === "horizontal" ? root.current.clientWidth : root.current.clientHeight;
    const previous = length.get();
    const phase = previous > 0 ? normalizeLoop(raw.get(), previous) / previous : 0;
    if (size !== previous || available !== viewport.get()) {
      raw.stop();
      length.set(size);
      viewport.set(available);
      raw.set(
        loop
          ? previous > 0
            ? phase * size
            : raw.get()
          : previous === 0 && direction === "reverse"
            ? -Math.max(0, size - available)
            : boundedOffset(raw.get(), size, available),
      );
    }
    const needed = size > 0 ? Math.max(2, Math.ceil(available / size) + 2) : 1;
    const copies = loop ? Math.min(32, needed) : 1,
      capped = loop && needed > 32;
    setMetrics((previous) =>
      previous.copies === copies && previous.capped === capped ? previous : { copies, capped },
    );
  }, [axis, direction, length, loop, raw, viewport]);
  useEffect(() => {
    if (!inView || reduced || metrics.capped) return;
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    if (first.current) observer.observe(first.current);
    return () => observer.disconnect();
  }, [inView, measure, metrics.capped, reduced]);
  useEffect(() => {
    root.current
      ?.querySelectorAll('[data-ticker-copy]:not([data-ticker-copy="0"]) [id]')
      .forEach((node) => node.removeAttribute("id"));
  }, [children, metrics.copies]);
  useEffect(() => {
    if (staticLayout || !inView) raw.stop();
    if (!active) return;
    let frame = 0,
      last = 0;
    const step = (time: number) => {
      const delta = last ? Math.max(0, time - last) : 0;
      last = time;
      const velocity = safeSpeed(typeof speed === "number" ? speed : speed.get());
      if (length.get() > 0) {
        const next =
          (loop ? normalizeLoop(raw.get(), length.get()) : raw.get()) +
          ((direction === "forward" ? -1 : 1) * velocity * delta) / 1000;
        raw.set(loop ? next : boundedOffset(next, length.get(), viewport.get()));
        if (!loop && next !== raw.get()) {
          setPlaying(false);
          return;
        }
      }
      frame = requestAnimationFrame(step);
    };
    const resume = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden) frame = requestAnimationFrame(step);
    };
    document.addEventListener("visibilitychange", resume);
    resume();
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [active, direction, inView, length, loop, raw, speed, staticLayout, viewport]);
  useEffect(() => () => raw.stop(), [raw]);
  const move = (value: number) => {
    raw.stop();
    raw.set(loop ? value : boundedOffset(value, length.get(), viewport.get()));
  };
  const finishDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragging(false);
    if (staticLayout || cancelled.current) return;
    const velocity = Math.max(
      -1000,
      Math.min(1000, axis === "horizontal" ? info.velocity.x : info.velocity.y),
    );
    const target = raw.get() + velocity * 0.2;
    const destination = loop ? target : boundedOffset(target, length.get(), viewport.get());
    void animate(raw, destination, {
      duration: motionTokens.duration.relaxed,
      ease: motionTokens.ease.exit,
      onComplete: () => {
        if (Number.isFinite(snapStep) && snapStep > 0)
          void animate(
            raw,
            loop
              ? Math.round(raw.get() / snapStep) * snapStep
              : boundedOffset(
                  Math.round(raw.get() / snapStep) * snapStep,
                  length.get(),
                  viewport.get(),
                ),
            motionTokens.spring.snappy,
          );
      },
    });
  };
  return (
    <div className={className} style={{ minWidth: 0 }}>
      <div
        ref={root}
        role="region"
        aria-label={label}
        tabIndex={draggable && !staticLayout ? 0 : undefined}
        style={{
          overflow: staticLayout ? "visible" : "clip",
          height: axis === "vertical" && !staticLayout ? layoutTokens.gridMin : "auto",
          minWidth: 0,
          maskImage:
            edgeFade && !staticLayout
              ? `linear-gradient(${axis === "horizontal" ? "to right" : "to bottom"}, transparent, black 8%, black 92%, transparent)`
              : "none",
        }}
        onPointerEnter={(event) => {
          if (pauseOnHover && event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={(event) => {
          if (event.target !== event.currentTarget) {
            setPlaying(false);
            move(0);
          }
        }}
        onPointerCancel={() => {
          cancelled.current = true;
          raw.stop();
          setDragging(false);
        }}
        onKeyDown={(event) => {
          if (!draggable || staticLayout || event.target !== event.currentTarget) return;
          const backward = axis === "horizontal" ? "ArrowLeft" : "ArrowUp",
            forward = axis === "horizontal" ? "ArrowRight" : "ArrowDown";
          if (![backward, forward, "Home", "End"].includes(event.key)) return;
          if (length.get() === 0) measure();
          event.preventDefault();
          setPlaying(false);
          move(
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? -Math.max(0, length.get() - viewport.get())
                : raw.get() +
                  (event.key === backward ? 1 : -1) *
                    (snapStep > 0 ? snapStep : motionTokens.distance.lg),
          );
        }}
      >
        <motion.div
          data-ticker-track=""
          style={{
            x: axis === "horizontal" && !staticLayout ? position : 0,
            y: axis === "vertical" && !staticLayout ? position : 0,
            display: "flex",
            flexDirection: axis === "horizontal" || staticLayout ? "row" : "column",
            flexWrap: staticLayout ? "wrap" : "nowrap",
            width: axis === "horizontal" && !staticLayout ? "max-content" : "auto",
            touchAction:
              draggable && !staticLayout ? (axis === "horizontal" ? "pan-y" : "pan-x") : "auto",
            cursor: draggable && !staticLayout ? "grab" : "auto",
            userSelect: draggable ? "none" : "auto",
          }}
          {...(draggable && !staticLayout
            ? {
                onPanStart: () => {
                  if (length.get() === 0) measure();
                  cancelled.current = false;
                  raw.stop();
                  setPlaying(false);
                  setDragging(true);
                },
                onPan: (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) =>
                  move(raw.get() + (axis === "horizontal" ? info.delta.x : info.delta.y)),
                onPanEnd: finishDrag,
              }
            : {})}
        >
          {Array.from({ length: staticLayout ? 1 : metrics.copies }, (_, copy) => (
            <div
              key={copy}
              ref={copy === 0 ? first : undefined}
              role={semantic === "list" ? "list" : undefined}
              aria-hidden={copy > 0 ? true : undefined}
              inert={copy > 0 ? true : undefined}
              data-ticker-copy={copy}
              style={{
                display: "flex",
                flexDirection: axis === "horizontal" || staticLayout ? "row" : "column",
                flexWrap: staticLayout ? "wrap" : "nowrap",
                flexShrink: 0,
                maxWidth: staticLayout ? "100%" : "none",
                gap,
                paddingRight: axis === "horizontal" && !staticLayout ? gap : 0,
                paddingBottom: axis === "vertical" && !staticLayout ? gap : 0,
              }}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  role={semantic === "list" ? "listitem" : undefined}
                  style={{ flexShrink: staticLayout ? 1 : 0, minWidth: 0 }}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      <button
        type="button"
        disabled={staticLayout || !items.length}
        aria-pressed={playing && !staticLayout}
        style={{
          minHeight: layoutTokens.controlSize,
          paddingInline: spacingTokens[3],
          marginTop: spacingTokens[3],
        }}
        onClick={() => {
          raw.stop();
          setHovered(false);
          setPlaying(!playing);
        }}
      >
        {staticLayout ? `${label}: static layout` : `${playing ? "Pause" : "Play"} ${label}`}
      </button>
      {draggable && !staticLayout && (
        <p style={{ marginBlock: spacingTokens[2] }}>
          Drag or focus the rail and use arrow keys. Home returns to the start.
        </p>
      )}
    </div>
  );
}
