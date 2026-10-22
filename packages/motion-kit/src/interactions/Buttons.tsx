"use client";
import { safeDOMProps } from "../utils/dom-props";

import { useState, useRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps, type MotionStyle } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useMotionKit } from "../providers/MotionProvider";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { radiusTokens } from "../tokens/radius";
import { spacingTokens } from "../tokens/spacing";
import { motionTokens } from "../tokens/motion-base";

export const buttonStyle: MotionStyle = {
  maxWidth: "100%",
  minWidth: 0,
  overflowWrap: "anywhere",
  minHeight: layoutTokens.controlSize,
  padding: `${spacingTokens[3]} ${spacingTokens[4]}`,
  borderRadius: radiusTokens.md,
  border: `1px solid ${colorTokens.border}`,
  background: colorTokens.accent,
  color: colorTokens.ink,
  font: "inherit",
  cursor: "pointer",
  position: "relative",
};
export interface MotionButtonProps extends Omit<
  HTMLMotionProps<"button">,
  | "initial"
  | "animate"
  | "exit"
  | "variants"
  | "whileHover"
  | "whileTap"
  | "transition"
  | "dangerouslySetInnerHTML"
  | "children"
> {
  children?: ReactNode;
  effect?: "scale" | "lift" | "elastic" | "glow" | "shift";
  shape?: "rounded" | "pill";
}
export function MotionButton({
  children,
  effect = "scale",
  shape,
  disabled,
  style,
  type = "button",
  ...props
}: MotionButtonProps) {
  const reduced = useMotionPreference();
  const { preset } = useMotionKit();
  const enabled = !reduced && !disabled;
  const hover =
    effect === "lift"
      ? { y: -motionTokens.distance.xs / 2 }
      : effect === "shift"
        ? { x: motionTokens.distance.xs / 2 }
        : effect === "glow"
          ? { boxShadow: `0 0 ${spacingTokens[6]} ${colorTokens.accent}44` }
          : { scale: preset.hoverScale };
  return (
    <motion.button
      {...safeDOMProps(props)}
      type={type}
      disabled={disabled}
      style={{
        ...buttonStyle,
        ...style,
        cursor: disabled ? "default" : (style?.cursor ?? "pointer"),
        opacity: disabled ? 0.6 : (style?.opacity ?? 1),
      }}
      initial={false}
      animate={{
        ...(shape ? { borderRadius: shape === "pill" ? radiusTokens.pill : radiusTokens.md } : {}),
        ...(!enabled ? { x: 0, y: 0, scale: 1, boxShadow: "none" } : {}),
      }}
      whileHover={enabled ? hover : {}}
      whileTap={enabled ? { scale: motionTokens.scale.press } : {}}
      transition={
        effect === "elastic" && enabled
          ? motionTokens.spring.elastic
          : { duration: reduced ? 0 : preset.duration }
      }
    >
      {children}
    </motion.button>
  );
}
type FixedButtonProps = Omit<MotionButtonProps, "effect">;
export function ElasticButton(props: FixedButtonProps) {
  return <MotionButton {...props} effect="elastic" />;
}
export function GlowButton(props: FixedButtonProps) {
  return <MotionButton {...props} effect="glow" />;
}
export function IconMotionButton({
  label,
  children,
  ...props
}: FixedButtonProps & { label: string }) {
  if (!label.trim()) throw new Error("IconMotionButton requires a non-empty label");
  return (
    <MotionButton {...props} aria-label={label}>
      <span aria-hidden="true">{children}</span>
    </MotionButton>
  );
}
export function MorphingButton({
  active = false,
  style,
  ...props
}: FixedButtonProps & { active?: boolean }) {
  return <MotionButton {...props} style={{ ...style }} shape={active ? "pill" : "rounded"} />;
}
export function LoadingButton({
  loading = false,
  children,
  disabled,
  ...props
}: FixedButtonProps & { loading?: boolean }) {
  return (
    <MotionButton {...props} disabled={loading || disabled} aria-busy={loading}>
      {children}
      {loading ? <span aria-hidden="true"> …</span> : null}
    </MotionButton>
  );
}
export function RippleButton({ children, onClick, style, ...props }: FixedButtonProps) {
  const reduced = useMotionPreference();
  const [ripple, setRipple] = useState<{ x: number; y: number; size: number; id: number } | null>(
    null,
  );
  const nextId = useRef(0);
  if (reduced && ripple) setRipple(null);
  return (
    <MotionButton
      {...props}
      style={{ ...style, overflow: "clip" }}
      onClick={(event) => {
        if (!reduced) {
          const rect = event.currentTarget.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          const id = ++nextId.current;
          setRipple({
            x: event.detail ? event.clientX - rect.left : rect.width / 2,
            y: event.detail ? event.clientY - rect.top : rect.height / 2,
            size,
            id,
          });
        }
        onClick?.(event);
      }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      {ripple && !reduced ? (
        <motion.span
          key={ripple.id}
          aria-hidden="true"
          style={{
            position: "absolute",
            pointerEvents: "none",
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: radiusTokens.pill,
            background: colorTokens.ink,
          }}
          initial={{ scale: 0, opacity: 0.2 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: motionTokens.duration.relaxed }}
          onAnimationComplete={() => setRipple((value) => (value?.id === ripple.id ? null : value))}
        />
      ) : null}
    </MotionButton>
  );
}
