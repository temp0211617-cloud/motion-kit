"use client";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { usePointerTilt } from "../hooks/usePointerTilt";
import { motionTokens } from "../tokens/motion-base";
import { colorTokens } from "../tokens/layout";
import { radiusTokens } from "../tokens/radius";
import { mediaSource } from "../utils/media-source";
import { experimentalTokens } from "../tokens/experimental";
export interface ExperimentalProps {
  children: ReactNode;
  className?: string;
}
function useLocalPointer() {
  const reduced = useMotionPreference(),
    bounds = useRef<DOMRect | null>(null);
  const x = useMotionValue(0),
    y = useMotionValue(0),
    percentX = useMotionValue(50),
    percentY = useMotionValue(50),
    opacity = useMotionValue(0);
  const [active, setActive] = useState(false);
  // Opacity changes only at entry/exit/focus, never with continuous coordinates.
  useMotionValueEvent(opacity, "change", (value) => setActive(value > 0));
  useEffect(() => {
    if (reduced) {
      bounds.current = null;
      opacity.set(0);
      x.jump(0);
      y.jump(0);
    }
    return () => {
      opacity.stop();
      x.stop();
      y.stop();
    };
  }, [opacity, reduced, x, y]);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = bounds.current;
    if (
      reduced ||
      event.pointerType !== "mouse" ||
      !box ||
      box.width <= 0 ||
      box.height <= 0 ||
      event.currentTarget.contains(document.activeElement)
    )
      return;
    const localX = Math.max(0, Math.min(box.width, event.clientX - box.left)),
      localY = Math.max(0, Math.min(box.height, event.clientY - box.top));
    x.set(localX);
    y.set(localY);
    percentX.set((localX / box.width) * 100);
    percentY.set((localY / box.height) * 100);
    opacity.set(experimentalTokens.activeOpacity);
  };
  const hide = () => {
    bounds.current = null;
    opacity.set(0);
  };
  return {
    x,
    y,
    percentX,
    percentY,
    opacity,
    reduced,
    active,
    onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
      if (!reduced && event.pointerType === "mouse") {
        bounds.current = event.currentTarget.getBoundingClientRect();
        move(event);
      }
    },
    onPointerMove: move,
    hide,
  };
}
function Dot({
  x,
  y,
  opacity,
  index,
  source,
  physics,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  index: number;
  source?: string;
  physics?: boolean;
}) {
  const spring = physics ? motionTokens.spring.heavy : motionTokens.spring.soft;
  const followX = useSpring(x, {
      ...spring,
      mass: spring.mass + index * experimentalTokens.trailMassStep,
    }),
    followY = useSpring(y, {
      ...spring,
      mass: spring.mass + index * experimentalTokens.trailMassStep,
    });
  return source ? (
    <motion.img
      src={source}
      alt=""
      width={motionTokens.distance.xl}
      height={motionTokens.distance.lg}
      draggable={false}
      decoding="async"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: followX,
        y: followY,
        opacity,
        width: motionTokens.distance.xl,
        height: motionTokens.distance.lg,
        marginLeft: -motionTokens.distance.xl / 2,
        marginTop: -motionTokens.distance.lg / 2,
        objectFit: "cover",
        borderRadius: radiusTokens.sm,
      }}
    />
  ) : (
    <motion.span
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: followX,
        y: followY,
        opacity,
        width: motionTokens.distance.sm,
        height: motionTokens.distance.sm,
        marginLeft: -motionTokens.distance.xs,
        marginTop: -motionTokens.distance.xs,
        background: colorTokens.accent,
        borderRadius: radiusTokens.pill,
        scale: 1 - index / 10,
      }}
    />
  );
}
function PointerSurface({
  children,
  className,
  kind,
  source,
}: ExperimentalProps & {
  kind: "follower" | "trail" | "light" | "image" | "physics";
  source?: string;
}) {
  const {
    x,
    y,
    percentX,
    percentY,
    opacity,
    reduced,
    active,
    onPointerEnter,
    onPointerMove,
    hide,
  } = useLocalPointer();
  const background = useMotionTemplate`radial-gradient(circle at ${percentX}% ${percentY}%, ${colorTokens.accent}, transparent 65%)`;
  return (
    <div
      className={className}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={hide}
      onPointerCancel={hide}
      onFocusCapture={hide}
      style={{ position: "relative", isolation: "isolate", minWidth: 0 }}
    >
      <div
        aria-hidden="true"
        inert
        style={{
          position: "absolute",
          inset: 0,
          overflow: "clip",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {kind === "light" ? (
          <motion.div style={{ position: "absolute", inset: 0, background, opacity }} />
        ) : (
          !reduced &&
          active &&
          Array.from({ length: kind === "trail" ? 6 : kind === "image" ? 4 : 1 }, (_, index) => (
            <Dot
              key={index}
              x={x}
              y={y}
              opacity={opacity}
              index={index}
              physics={kind === "physics"}
              {...(source ? { source } : {})}
            />
          ))
        )}
      </div>
      {children}
    </div>
  );
}
export function CursorFollower(props: ExperimentalProps) {
  return <PointerSurface {...props} kind="follower" />;
}
export function CursorTrail(props: ExperimentalProps) {
  return <PointerSurface {...props} kind="trail" />;
}
export function CursorSpotlight(props: ExperimentalProps) {
  return <PointerSurface {...props} kind="light" />;
}
export function PhysicsFollower(props: ExperimentalProps) {
  return <PointerSurface {...props} kind="physics" />;
}
export function ImageTrail({ src, ...props }: ExperimentalProps & { src: string }) {
  return <PointerSurface {...props} kind="image" source={mediaSource(src)} />;
}
export function DistortionHover({ children, className }: ExperimentalProps) {
  const reduced = useMotionPreference(),
    [focused, setFocused] = useState(false),
    tilt = usePointerTilt(reduced, !focused);
  return (
    <div
      className={className}
      style={{ minWidth: 0 }}
      onPointerEnter={tilt.onPointerEnter}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.reset}
      onPointerCancel={tilt.reset}
      onFocusCapture={() => {
        setFocused(true);
        tilt.reset();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <motion.div
        style={{
          skewX: reduced || focused ? 0 : tilt.rotateY,
          skewY: reduced || focused ? 0 : tilt.rotateX,
          minWidth: 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
