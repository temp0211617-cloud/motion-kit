"use client";

import { useEffect, useRef, useMemo } from "react";
import { animate, useMotionValue } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useMotionKit } from "../providers/MotionProvider";
import { readerOnly } from "./TextReveal";
import { splitText } from "./segmentation";
import { motionTokens } from "../tokens/motion";

export interface ProgressTextProps {
  children: string;
  className?: string;
  duration?: number;
}
function ProgressText({
  children,
  className,
  duration = motionTokens.text.typingDuration,
  scramble = false,
}: ProgressTextProps & { scramble?: boolean }) {
  const reduced = useMotionPreference();
  const element = useRef<HTMLSpanElement>(null);
  const progress = useMotionValue(0);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    if (reduced || children.length > 2048 || typeof Intl.Segmenter === "undefined") {
      node.textContent = children;
      return;
    }
    const chars = splitText(children, "characters");
    if (reduced || chars.length > 128) {
      node.textContent = children;
      return;
    }
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const update = (value: number) => {
      const count = Math.floor(value);
      node.textContent = scramble
        ? chars
            .map((char, index) =>
              index < count || /\s/u.test(char)
                ? char
                : alphabet[(index * 7 + Math.floor(value * 8)) % alphabet.length],
            )
            .join("")
        : chars.slice(0, count).join("");
    };
    progress.set(0);
    update(0);
    const unsubscribe = progress.on("change", update);
    const animation = animate(progress, chars.length, {
      duration: Number.isFinite(duration)
        ? Math.min(motionTokens.text.maximumTypingDuration, Math.max(0, duration))
        : motionTokens.text.typingDuration,
      ease: "linear",
    });
    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [children, duration, progress, reduced, scramble]);
  return (
    <span className={className}>
      <span style={readerOnly}>{children}</span>
      <span
        aria-hidden="true"
        style={{ display: "inline-grid", position: "relative", whiteSpace: "pre-wrap" }}
      >
        <span style={{ visibility: "hidden" }}>{children}</span>
        <span ref={element} style={{ position: "absolute", inset: 0 }}>
          {children}
        </span>
      </span>
    </span>
  );
}
export function Typewriter(props: ProgressTextProps) {
  return <ProgressText {...props} />;
}
export function ScrambleText(props: ProgressTextProps) {
  return <ProgressText {...props} scramble />;
}
export interface AnimatedNumberProps {
  value: number;
  from?: number;
  decimals?: number;
  locale?: string;
  className?: string;
}
export function AnimatedNumber({
  value,
  from,
  decimals = 0,
  locale = "en-US",
  className,
}: AnimatedNumberProps) {
  const reduced = useMotionPreference();
  const { preset } = useMotionKit();
  const target = Number.isFinite(value) ? value : 0;
  const previous = useRef(from !== undefined && Number.isFinite(from) ? from : target);
  const element = useRef<HTMLSpanElement>(null);
  const progress = useMotionValue(target);
  const format = useMemo(() => {
    const precision = Number.isFinite(decimals)
      ? Math.min(20, Math.max(0, Math.floor(decimals)))
      : 0;
    const options = { minimumFractionDigits: precision, maximumFractionDigits: precision };
    try {
      return new Intl.NumberFormat(locale, options);
    } catch {
      return new Intl.NumberFormat("en-US", options);
    }
  }, [decimals, locale]);
  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const update = (number: number) => {
      node.textContent = format.format(number);
    };
    if (reduced) {
      progress.set(target);
      update(target);
      previous.current = target;
      return;
    }
    progress.set(previous.current);
    update(previous.current);
    previous.current = target;
    const unsubscribe = progress.on("change", update);
    const animation = animate(progress, target, { duration: preset.duration });
    return () => {
      previous.current = progress.get();
      animation.stop();
      unsubscribe();
    };
  }, [format, preset.duration, progress, reduced, target]);
  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      <span style={readerOnly}>{format.format(target)}</span>
      <span aria-hidden="true" ref={element}>
        {format.format(target)}
      </span>
    </span>
  );
}
export function NumberTicker(props: AnimatedNumberProps) {
  return <AnimatedNumber from={0} {...props} />;
}
