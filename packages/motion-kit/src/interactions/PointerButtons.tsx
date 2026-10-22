"use client";

import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useSpring } from "motion/react";
import { MotionButton, type MotionButtonProps } from "./Buttons";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { motionTokens } from "../tokens/motion-base";
import { radiusTokens } from "../tokens/radius";
import { colorTokens } from "../tokens/layout";

export function MagneticButton({ children, disabled, style, ...props }: MotionButtonProps) {
  const reduced = useMotionPreference();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, motionTokens.spring.smooth);
  const smoothY = useSpring(y, motionTokens.spring.smooth);
  const rect = useRef<DOMRect | null>(null);
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <span
      style={{ display: "inline-block", maxWidth: "100%", minWidth: 0 }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse")
          rect.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(event) => {
        const box = rect.current;
        if (reduced || disabled || event.pointerType !== "mouse" || !box) return;
        x.set(
          Math.max(
            -motionTokens.distance.xs,
            Math.min(motionTokens.distance.xs, (event.clientX - box.left - box.width / 2) / 6),
          ),
        );
        y.set(
          Math.max(
            -motionTokens.distance.xs,
            Math.min(motionTokens.distance.xs, (event.clientY - box.top - box.height / 2) / 6),
          ),
        );
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlurCapture={reset}
    >
      <MotionButton
        {...props}
        disabled={disabled}
        style={{
          ...style,
          x: reduced || disabled ? 0 : smoothX,
          y: reduced || disabled ? 0 : smoothY,
        }}
      >
        {children}
      </MotionButton>
    </span>
  );
}
export function SpotlightButton({
  children,
  onPointerMove,
  onPointerLeave,
  style,
  ...props
}: MotionButtonProps) {
  const reduced = useMotionPreference();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const rect = useRef<DOMRect | null>(null);
  const gradient = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${colorTokens.text}66, transparent 60%)`;
  return (
    <MotionButton
      {...props}
      style={{ ...style, overflow: "clip" }}
      onPointerEnter={(event) => {
        rect.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(event) => {
        const box = rect.current;
        if (!reduced && !props.disabled && event.pointerType === "mouse" && box) {
          x.set(event.clientX - box.left);
          y.set(event.clientY - box.top);
          opacity.set(1);
        }
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        opacity.set(0);
        onPointerLeave?.(event);
      }}
    >
      <motion.span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: radiusTokens.md,
          background: gradient,
          opacity: reduced || props.disabled ? 0 : opacity,
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </MotionButton>
  );
}
