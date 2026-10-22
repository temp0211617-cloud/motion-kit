"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useMotionKit } from "../providers/MotionProvider";
import { colorTokens } from "../tokens/layout";
import { motionTokens } from "../tokens/motion";
import { readerOnly, type TextRevealProps } from "./TextReveal";

export type DecorativeTextProps = Pick<TextRevealProps, "children" | "className">;
export function GradientText({ children, className }: DecorativeTextProps) {
  return (
    <span
      className={className}
      style={{ color: colorTokens.accent, position: "relative", display: "inline-block" }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          userSelect: "none",
          pointerEvents: "none",
          color: "transparent",
          backgroundImage: `linear-gradient(90deg, ${colorTokens.accent}, ${colorTokens.text})`,
          backgroundClip: "text",
        }}
      >
        {children}
      </span>
      {children}
    </span>
  );
}
export function ShimmerText({ children, className }: DecorativeTextProps) {
  const reduced = useMotionPreference();
  return (
    <motion.span
      className={className}
      initial={false}
      animate={{ opacity: reduced ? 1 : [1, 0.6, 1] }}
      transition={{ duration: reduced ? 0 : motionTokens.text.shimmerDuration }}
    >
      {children}
    </motion.span>
  );
}
function ChangingText({
  children,
  className,
  flip = false,
}: DecorativeTextProps & { flip?: boolean }) {
  const reduced = useMotionPreference();
  const { preset } = useMotionKit();
  return (
    <span className={className}>
      <span style={readerOnly}>{children}</span>
      <span
        aria-hidden="true"
        style={{ display: "inline-block", overflow: "clip", verticalAlign: "bottom" }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={children}
            style={{ display: "inline-block" }}
            initial={
              reduced ? false : flip ? { rotateX: 90, opacity: 0 } : { y: "100%", opacity: 0 }
            }
            animate={{ rotateX: 0, y: 0, opacity: 1 }}
            exit={flip ? { rotateX: -90, opacity: 0 } : { y: "-100%", opacity: 0 }}
            transition={{ duration: reduced ? 0 : preset.duration }}
          >
            {children}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
export function RollingText(props: DecorativeTextProps) {
  return <ChangingText {...props} />;
}
export function FlipText(props: DecorativeTextProps) {
  return <ChangingText {...props} flip />;
}
