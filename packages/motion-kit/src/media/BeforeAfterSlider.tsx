"use client";
import { mediaLayoutTokens, controlSize } from "../tokens/layout-base";
import { colorTokens } from "../tokens/colors";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { spacingTokens } from "../tokens/spacing";
export interface BeforeAfterSliderProps {
  before: ReactNode;
  after: ReactNode;
  label: string;
  beforeLabel: string;
  afterLabel: string;
  initial?: number;
  className?: string;
}
export function BeforeAfterSlider({
  before,
  after,
  label,
  beforeLabel,
  afterLabel,
  initial = 50,
  className,
}: BeforeAfterSliderProps) {
  if (![label, beforeLabel, afterLabel].every((value) => value.trim()))
    throw new Error("A comparison requires a name and descriptions for both states");
  const [start] = useState(() =>
    Number.isFinite(initial) ? Math.round(Math.max(0, Math.min(100, initial))) : 50,
  );
  const value = useMotionValue(start);
  const clipPath = useTransform(value, (percent) => `inset(0 ${100 - percent}% 0 0)`);
  const output = useRef<HTMLOutputElement>(null),
    input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const update = (percent: number) => {
      const description = `${Math.round(percent)}% ${afterLabel}`;
      if (output.current) output.current.textContent = description;
      input.current?.setAttribute("aria-valuetext", description);
    };
    update(value.get());
    return value.on("change", update);
  }, [afterLabel, value]);
  return (
    <figure className={className} style={{ margin: 0 }}>
      <div
        style={{
          position: "relative",
          aspectRatio: mediaLayoutTokens.comparisonAspect,
          overflow: "hidden",
        }}
        aria-hidden="true"
        inert
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{before}</div>
        <motion.div style={{ position: "absolute", inset: 0, clipPath, pointerEvents: "none" }}>
          {after}
        </motion.div>
      </div>
      <figcaption style={{ marginTop: spacingTokens[3] }}>
        {beforeLabel} / {afterLabel}
      </figcaption>
      <label style={{ display: "grid", gap: spacingTokens[2], marginTop: spacingTokens[3] }}>
        {label}
        <input
          ref={input}
          type="range"
          min={0}
          max={100}
          step={1}
          defaultValue={start}
          aria-label={label}
          aria-valuetext={`${start}% ${afterLabel}`}
          onInput={(event) => value.set(event.currentTarget.valueAsNumber)}
          style={{
            width: "100%",
            minHeight: controlSize,
            accentColor: colorTokens.accent,
          }}
        />
      </label>
      <output ref={output}>
        {start}% {afterLabel}
      </output>
    </figure>
  );
}
