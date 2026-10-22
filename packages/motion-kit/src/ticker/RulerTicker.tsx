"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import { LiveTicker, type LiveTickerProps } from "./LiveTicker";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { colorTokens, motionTokens, spacingTokens, typographyTokens } from "../tokens";
import { normalizeLoop } from "./math";
export interface RulerTickerProps extends Omit<
  LiveTickerProps,
  "children" | "draggable" | "axis" | "gap" | "offset" | "snapStep"
> {
  count?: number;
  step?: number;
  snap?: boolean;
}
export function RulerTicker({ count = 48, step = 10, snap = true, ...props }: RulerTickerProps) {
  if (
    !Number.isInteger(count) ||
    count < 2 ||
    count > 120 ||
    !Number.isFinite(step) ||
    step <= 0 ||
    step > 1000
  )
    throw new Error("RulerTicker requires 2–120 ticks and a positive finite step up to 1000");
  const reduced = useMotionPreference();
  const unit = motionTokens.distance.lg;
  const offset = useMotionValue(0),
    width = useMotionValue(0);
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef(0);
  const [active, setActive] = useState(0);
  const update = (value: number) => {
    const position = props.loop === false ? value : normalizeLoop(value, count * unit);
    const index = Math.max(
      0,
      Math.min(count - 1, Math.round((-position + width.get() / 2) / unit) % count),
    );
    if (index !== previous.current) {
      previous.current = index;
      setActive(index);
    }
  };
  useMotionValueEvent(offset, "change", update);
  useMotionValueEvent(width, "change", () => update(offset.get()));
  useEffect(() => {
    const measure = () => width.set(root.current?.clientWidth ?? 0);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div ref={root} style={{ position: "relative", minWidth: 0 }}>
      <LiveTicker {...props} offset={offset} gap={0} draggable snapStep={snap ? unit : 0}>
        <div
          style={{
            display: "flex",
            flexWrap: reduced ? "wrap" : "nowrap",
            width: reduced ? "auto" : "max-content",
            maxWidth: reduced ? "100%" : "none",
          }}
        >
          {Array.from({ length: count }, (_, index) => (
            <span
              key={index}
              style={{
                width: unit,
                flexShrink: 0,
                paddingBlock: spacingTokens[3],
                textAlign: "center",
                fontSize: typographyTokens.size.caption,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  height: index % 5 === 0 ? spacingTokens[6] : spacingTokens[3],
                  borderLeft: `1px solid ${colorTokens.muted}`,
                  marginLeft: "50%",
                }}
              />
              {index % 5 === 0 ? index * step : <span aria-hidden="true">·</span>}
            </span>
          ))}
        </div>
      </LiveTicker>
      {!reduced && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: spacingTokens[1],
            height: spacingTokens[10],
            background: colorTokens.accent,
            pointerEvents: "none",
          }}
        />
      )}
      <output aria-live="off">{reduced ? "Static ruler" : `Center mark: ${active * step}`}</output>
    </div>
  );
}
