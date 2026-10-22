"use client";
import { useState, type ReactNode } from "react";
import { motion, useTransform } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { usePointerTilt } from "../hooks/usePointerTilt";
import { motionTokens } from "../tokens/motion-base";
import { spacingTokens } from "../tokens/spacing";

export interface InteractionSurfaceProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}
type Effect = "scale" | "lift" | "magnet" | "attract" | "tilt" | "follow";
function Surface({
  children,
  className,
  disabled = false,
  effect,
}: InteractionSurfaceProps & { effect: Effect }) {
  const reduced = useMotionPreference();
  const [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false);
  const pointer = !["scale", "lift"].includes(effect);
  const enabled = !reduced && !disabled && !focused;
  const tilt = usePointerTilt(reduced, pointer && enabled);
  const range =
    effect === "follow"
      ? motionTokens.distance.sm
      : effect === "attract"
        ? motionTokens.distance.xs / 2
        : motionTokens.distance.xs;
  const x = useTransform(tilt.rotateY, (value) => (value / motionTokens.surface.tilt) * range);
  const y = useTransform(tilt.rotateX, (value) => (-value / motionTokens.surface.tilt) * range);
  const translating = pointer && effect !== "tilt";
  return (
    <div
      className={className}
      style={{
        minWidth: 0,
        maxWidth: "100%",
        padding: spacingTokens[4],
        overflow: "clip",
        perspective: motionTokens.surface.perspective,
      }}
      onPointerEnter={(event) => {
        if (!enabled || event.pointerType !== "mouse") return;
        setHovered(true);
        tilt.onPointerEnter(event);
      }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={() => {
        setHovered(false);
        tilt.reset();
      }}
      onPointerCancel={() => {
        setHovered(false);
        tilt.reset();
      }}
      onFocusCapture={() => {
        setFocused(true);
        tilt.reset();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <motion.div
        initial={false}
        style={{
          minWidth: 0,
          overflowWrap: "anywhere",
          ...(translating ? { x: enabled ? x : 0, y: enabled ? y : 0 } : {}),
          ...(effect === "tilt"
            ? { rotateX: enabled ? tilt.rotateX : 0, rotateY: enabled ? tilt.rotateY : 0 }
            : {}),
        }}
        animate={
          effect === "scale"
            ? { scale: enabled && hovered ? motionTokens.scale.hover : 1 }
            : effect === "lift"
              ? { y: enabled && hovered ? -motionTokens.distance.xs : 0 }
              : {}
        }
        transition={{ duration: reduced || focused || disabled ? 0 : motionTokens.duration.fast }}
      >
        {children}
      </motion.div>
    </div>
  );
}
export function HoverScale(props: InteractionSurfaceProps) {
  return <Surface {...props} effect="scale" />;
}
export function HoverLift(props: InteractionSurfaceProps) {
  return <Surface {...props} effect="lift" />;
}
export function HoverMagnet(props: InteractionSurfaceProps) {
  return <Surface {...props} effect="magnet" />;
}
export function CursorAttract(props: InteractionSurfaceProps) {
  return <Surface {...props} effect="attract" />;
}
export function TiltSurface(props: InteractionSurfaceProps) {
  return <Surface {...props} effect="tilt" />;
}
export function FollowPointer(props: InteractionSurfaceProps) {
  return <Surface {...props} effect="follow" />;
}
