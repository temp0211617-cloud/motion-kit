"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useVelocity,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView, useVisibilitySupport } from "../hooks/useElementInView";
import { spacingTokens } from "../tokens/spacing";
import { layoutTokens } from "../tokens/layout";
import { readerOnly } from "./TextReveal";
import { motionTokens } from "../tokens/motion";

export interface TextTickerProps {
  children: string;
  className?: string;
  speed?: number | MotionValue<number>;
  autoplay?: boolean;
}
export function TextTicker({
  children,
  className,
  speed = motionTokens.text.tickerSpeed,
  autoplay = false,
}: TextTickerProps) {
  const [playing, setPlaying] = useState(autoplay);
  const [copies, setCopies] = useState(2);
  const [hovered, setHovered] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLSpanElement>(null);
  const width = useRef(0);
  const x = useMotionValue(0);
  const preferenceReduced = useMotionPreference();
  const supported = useVisibilitySupport();
  const reduced = preferenceReduced || !supported;
  const inView = useElementInView(root, !reduced);
  const active = playing && !hovered && !reduced && inView && children.length > 0;
  useEffect(() => {
    const measure = () => {
      if (!root.current || !first.current) return;
      const size = first.current.getBoundingClientRect().width;
      const container = root.current.clientWidth;
      width.current = size;
      if (size > 0) setCopies(Math.min(64, Math.max(2, Math.ceil(container / size) + 2)));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    if (first.current) observer.observe(first.current);
    return () => observer.disconnect();
  }, [children]);
  useEffect(() => {
    if (reduced) x.set(0);
    if (!active) return;
    let handle = 0;
    let last = 0;
    const step = (time: number) => {
      const delta = last ? Math.min(64, time - last) : 0;
      last = time;
      const velocity = typeof speed === "number" ? speed : speed.get();
      const safeSpeed = Number.isFinite(velocity)
        ? Math.min(240, Math.max(0, velocity))
        : motionTokens.text.tickerSpeed;
      if (width.current > 0) x.set((x.get() - (delta * safeSpeed) / 1000) % width.current);
      handle = requestAnimationFrame(step);
    };
    handle = requestAnimationFrame(step);
    return () => cancelAnimationFrame(handle);
  }, [active, reduced, speed, x]);
  return (
    <div
      className={className}
      ref={root}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false);
      }}
    >
      <span style={readerOnly}>{children}</span>
      <div aria-hidden="true" style={{ overflow: "clip" }}>
        <motion.div
          style={{
            x: reduced ? 0 : x,
            display: reduced ? "block" : "flex",
            width: reduced ? "auto" : "max-content",
          }}
        >
          {Array.from({ length: reduced ? 1 : copies }, (_, index) => (
            <span
              ref={index === 0 ? first : undefined}
              key={index}
              style={{
                display: "inline-block",
                whiteSpace: reduced ? "normal" : "nowrap",
                paddingRight: reduced ? 0 : spacingTokens[4],
              }}
            >
              {children}
            </span>
          ))}
        </motion.div>
      </div>
      <button
        style={{ minHeight: layoutTokens.controlSize, paddingInline: spacingTokens[3] }}
        type="button"
        disabled={reduced || !children}
        aria-pressed={playing && !reduced}
        onClick={() => {
          setHovered(false);
          setPlaying((value) => !value);
        }}
      >
        {reduced
          ? preferenceReduced
            ? "Reduced motion enabled"
            : "Static text ticker"
          : playing
            ? "Pause text ticker"
            : "Play text ticker"}
      </button>
    </div>
  );
}
export function ScrollVelocityText(props: Omit<TextTickerProps, "speed">) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const speed = useTransform(
    velocity,
    (value) => motionTokens.text.tickerSpeed + Math.min(160, Math.abs(value) / 20),
  );
  return <TextTicker {...props} speed={speed} />;
}
