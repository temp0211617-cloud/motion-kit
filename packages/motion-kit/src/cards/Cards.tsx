"use client";
import { safeDOMProps } from "../utils/dom-props";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useMotionValueEvent,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { usePointerTilt } from "../hooks/usePointerTilt";
import { colorTokens, spacingTokens, radiusTokens, motionTokens } from "../tokens";

export interface CardProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "style" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "dangerouslySetInnerHTML"
> {
  children?: ReactNode;
  style?: { [K in keyof CSSProperties]?: Exclude<CSSProperties[K], undefined> };
}
const surface: MotionStyle = {
  minWidth: 0,
  padding: spacingTokens[6],
  borderRadius: radiusTokens.lg,
  border: `1px solid ${colorTokens.border}`,
  background: colorTokens.surface,
  color: colorTokens.text,
  position: "relative",
  overflowWrap: "anywhere",
};
type Effect = "lift" | "tilt" | "spotlight" | "glow" | "depth" | "float" | "perspective";
function Surface({ children, style, effect, ...props }: CardProps & { effect: Effect }) {
  const reduced = useMotionPreference();
  const tilted = ["tilt", "depth", "perspective"].includes(effect);
  const tilt = usePointerTilt(reduced, tilted || effect === "spotlight");
  const { bounds, rotateX, rotateY } = tilt;
  const [engaged, setEngaged] = useState(false);
  const lightX = useMotionValue(0),
    lightY = useMotionValue(0);
  const light = useMotionTemplate`radial-gradient(circle at ${lightX}px ${lightY}px, ${colorTokens.accent}22, transparent 65%)`;
  const reset = () => {
    tilt.reset();
    setEngaged(false);
  };
  const active = engaged && !reduced;
  return (
    <div style={{ perspective: motionTokens.surface.perspective, minWidth: 0 }}>
      <motion.article
        {...safeDOMProps(props)}
        initial={false}
        style={{
          ...surface,
          ...style,
          rotateX: tilted && !reduced ? rotateX : 0,
          rotateY: tilted && !reduced ? rotateY : 0,
          transformStyle: effect === "depth" ? "preserve-3d" : "flat",
        }}
        animate={{
          y: active && effect === "lift" ? -motionTokens.distance.xs : 0,
          rotateZ: active && effect === "float" ? motionTokens.surface.floatAngle : 0,
          scale: active && effect === "perspective" ? motionTokens.scale.hover : 1,
          boxShadow:
            active && effect === "glow"
              ? `0 0 ${spacingTokens[8]} ${colorTokens.accent}33`
              : "0 0 0 transparent",
        }}
        transition={{ duration: reduced ? 0 : motionTokens.duration.default }}
        onPointerEnter={(event) => {
          props.onPointerEnter?.(event);
          if (event.pointerType !== "mouse" || reduced) return;
          tilt.onPointerEnter(event);
          setEngaged(true);
        }}
        onPointerMove={(event) => {
          props.onPointerMove?.(event);
          tilt.onPointerMove(event);
          const box = bounds.current;
          if (!box || reduced || event.pointerType !== "mouse") return;
          lightX.set(event.clientX - box.left);
          lightY.set(event.clientY - box.top);
        }}
        onPointerLeave={(event) => {
          props.onPointerLeave?.(event);
          reset();
        }}
        onPointerCancel={(event) => {
          props.onPointerCancel?.(event);
          reset();
        }}
        onFocusCapture={(event) => {
          props.onFocusCapture?.(event);
          setEngaged(true);
        }}
        onBlurCapture={(event) => {
          props.onBlurCapture?.(event);
          if (!event.currentTarget.contains(event.relatedTarget)) reset();
        }}
      >
        {effect === "spotlight" && (
          <motion.span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              pointerEvents: "none",
              background: light,
            }}
            animate={{ opacity: active ? 1 : 0 }}
          />
        )}
        <div
          style={{
            position: "relative",
            transform:
              effect === "depth" && active ? `translateZ(${motionTokens.distance.md}px)` : "none",
          }}
        >
          {children}
        </div>
      </motion.article>
    </div>
  );
}
export function HoverCard(props: CardProps) {
  return <Surface {...props} effect="lift" />;
}
export function TiltCard(props: CardProps) {
  return <Surface {...props} effect="tilt" />;
}
export function SpotlightCard(props: CardProps) {
  return <Surface {...props} effect="spotlight" />;
}
export function GlowCard(props: CardProps) {
  return <Surface {...props} effect="glow" />;
}
export function ThreeDCard(props: CardProps) {
  return <Surface {...props} effect="depth" />;
}
export function FloatingCard(props: CardProps) {
  return <Surface {...props} effect="float" />;
}
export function PerspectiveCard(props: CardProps) {
  return <Surface {...props} effect="perspective" />;
}

export function MorphingCard({
  active = false,
  children,
  style,
  ...props
}: CardProps & { active?: boolean }) {
  const reduced = useMotionPreference();
  return (
    <motion.article
      {...safeDOMProps(props)}
      initial={false}
      style={{ ...surface, ...style }}
      animate={{ borderRadius: active ? radiusTokens.xl : radiusTokens.md }}
      transition={{ duration: reduced ? 0 : motionTokens.duration.default }}
    >
      {children}
    </motion.article>
  );
}
export interface ExpandableCardProps extends Omit<
  HTMLAttributes<HTMLDetailsElement>,
  "style" | "dangerouslySetInnerHTML"
> {
  summary: string;
  defaultOpen?: boolean;
}
export function ExpandableCard({
  summary,
  defaultOpen = false,
  children,
  ...props
}: ExpandableCardProps) {
  if (!summary.trim()) throw new Error("ExpandableCard requires a summary");
  return (
    <details
      {...safeDOMProps(props)}
      open={defaultOpen || undefined}
      style={surface as CSSProperties}
    >
      <summary style={{ minHeight: "2.75rem", cursor: "pointer" }}>{summary}</summary>
      <div>{children}</div>
    </details>
  );
}
export function HoverRevealCard({
  summary,
  children,
  style,
  ...props
}: CardProps & { summary: string }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const id = useId();
  if (!summary.trim()) throw new Error("HoverRevealCard requires a summary");
  return (
    <article
      {...safeDOMProps(props)}
      style={{ ...surface, ...style } as CSSProperties}
      onPointerEnter={(event) => {
        props.onPointerEnter?.(event);
        if (event.pointerType === "mouse") setPreview(true);
      }}
      onPointerLeave={(event) => {
        props.onPointerLeave?.(event);
        setPreview(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        style={{ minHeight: "2.75rem" }}
      >
        {summary}
      </button>
      <p aria-hidden="true" style={{ color: colorTokens.muted }}>
        {preview && !open ? "Open to explore" : "Details available"}
      </p>
      <div id={id} hidden={!open}>
        {children}
      </div>
    </article>
  );
}
export function StackCard({ children, style, ...props }: CardProps) {
  return (
    <article
      {...safeDOMProps(props)}
      style={
        { ...surface, ...style, margin: spacingTokens[2], isolation: "isolate" } as CSSProperties
      }
    >
      {[1, 2].map((layer) => (
        <span
          key={layer}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            border: `1px solid ${colorTokens.border}`,
            borderRadius: "inherit",
            transform: `translateY(${layer * motionTokens.distance.xs}px) scale(${1 - layer * 0.02})`,
            pointerEvents: "none",
            zIndex: -layer,
          }}
        />
      ))}
      {children}
    </article>
  );
}

function ScrollSurface({
  target,
  y,
}: {
  target: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
}) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    y.set(motionTokens.distance.sm * (1 - 2 * value)),
  );
  useEffect(() => () => y.set(0), [y]);
  return null;
}
export function ParallaxCard({ children, style, ...props }: CardProps) {
  const target = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const inView = useElementInView(target, !reduced);
  const y = useMotionValue(0);
  return (
    <div ref={target}>
      <article {...safeDOMProps(props)} style={{ ...surface, ...style } as CSSProperties}>
        {inView && !reduced && <ScrollSurface target={target} y={y} />}
        <motion.div style={{ y: reduced ? 0 : y }}>{children}</motion.div>
      </article>
    </div>
  );
}
