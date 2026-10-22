"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useMotionValueEvent, type MotionValue } from "motion/react";
import { colorTokens, radiusTokens, spacingTokens } from "../tokens";
function Meter({ value, label }: { value: MotionValue<number>; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const update = (progress: number) =>
    ref.current?.setAttribute(
      "aria-valuenow",
      String(Math.round(Math.max(0, Math.min(1, progress)) * 100)),
    );
  useMotionValueEvent(value, "change", update);
  useEffect(() => {
    update(value.get());
  }, [value]);
  if (!label.trim()) throw new Error("Scroll progress requires a label");
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      style={{
        height: spacingTokens[1],
        background: colorTokens.border,
        borderRadius: radiusTokens.pill,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          background: colorTokens.accent,
          scaleX: value,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}
export function ScrollProgress({ label = "Page reading progress" }: { label?: string }) {
  const { scrollYProgress } = useScroll();
  return <Meter value={scrollYProgress} label={label} />;
}
export function ScrollSectionProgress({ children, label }: { children: ReactNode; label: string }) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  return (
    <div ref={target}>
      <Meter value={scrollYProgress} label={label} />
      {children}
    </div>
  );
}
