"use client";
import { useEffect, useId, useRef } from "react";
import { motion, useAnimationControls } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { colorTokens } from "../tokens/layout";
import { motionTokens } from "../tokens/motion-base";
import { radiusTokens } from "../tokens/radius";
import { experimentalTokens } from "../tokens/experimental";
import type { ExperimentalProps } from "./PointerEffects";
export interface FieldProps extends ExperimentalProps {
  /** A changed key replays a finite accent. */ replayKey?: string | number;
}
type FieldKind = "aurora" | "grid" | "particles" | "noise" | "mesh";
function Field({
  children,
  className,
  replayKey,
  kind,
  count = 24,
}: FieldProps & { kind: FieldKind; count?: number }) {
  if (!Number.isInteger(count) || count < 1 || count > 48) throw new Error("Use 1–48 particles");
  const ref = useRef<HTMLDivElement>(null),
    played = useRef(false),
    previous = useRef(replayKey);
  const reduced = useMotionPreference(),
    inView = useElementInView(ref, !reduced),
    controls = useAnimationControls(),
    id = useId();
  useEffect(() => {
    if (previous.current !== replayKey) {
      previous.current = replayKey;
      played.current = false;
    }
    controls.stop();
    if (!reduced && inView && !played.current) {
      played.current = true;
      void controls.start(
        {
          opacity: [
            experimentalTokens.idleOpacity,
            experimentalTokens.activeOpacity,
            experimentalTokens.idleOpacity,
          ],
          y: [0, -motionTokens.distance.xs, 0],
        },
        { duration: motionTokens.duration.cinematic * 2 },
      );
    } else controls.set({ opacity: experimentalTokens.idleOpacity, y: 0 });
    return () => controls.stop();
  }, [controls, inView, reduced, replayKey]);
  const gradient =
    kind === "aurora"
      ? `linear-gradient(120deg,transparent,${colorTokens.accent},transparent)`
      : `radial-gradient(ellipse at 20% 20%,${colorTokens.accent},transparent 60%),radial-gradient(ellipse at 80% 80%,${colorTokens.muted},transparent 60%)`;
  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", isolation: "isolate", minWidth: 0 }}
    >
      <div
        aria-hidden="true"
        inert
        style={{
          position: "absolute",
          inset: 0,
          overflow: "clip",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <motion.div
          initial={false}
          animate={controls}
          style={{
            position: "absolute",
            inset: 0,
            opacity: experimentalTokens.idleOpacity,
            background: ["aurora", "mesh"].includes(kind)
              ? gradient
              : kind === "noise" && !inView
                ? `repeating-linear-gradient(45deg,${colorTokens.muted} 0 1px,transparent 1px 4px)`
                : "transparent",
          }}
        >
          {kind === "grid" && (
            <svg width="100%" height="100%" viewBox="0 0 320 240" preserveAspectRatio="none">
              <g stroke={colorTokens.accent} strokeWidth={1}>
                {Array.from({ length: 9 }, (_, index) => (
                  <path key={index} d={`M${index * 40} 0V240 M0 ${index * 30}H320`} />
                ))}
              </g>
            </svg>
          )}
          {kind === "particles" &&
            Array.from({ length: count }, (_, index) => (
              <span
                key={index}
                style={{
                  position: "absolute",
                  left: `${(index * 37 + 13) % 100}%`,
                  top: `${(index * 61 + 7) % 100}%`,
                  width: motionTokens.distance.xs / 2,
                  height: motionTokens.distance.xs / 2,
                  background: colorTokens.accent,
                  borderRadius: radiusTokens.pill,
                }}
              />
            ))}
          {kind === "noise" && inView && (
            <svg width="100%" height="100%">
              <defs>
                <filter id={`${id}-noise`}>
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency={experimentalTokens.noiseFrequency}
                    numOctaves={1}
                    seed={7}
                    stitchTiles="stitch"
                  />
                </filter>
              </defs>
              <rect width="100%" height="100%" filter={`url(#${id}-noise)`} />
            </svg>
          )}
        </motion.div>
      </div>
      {children}
    </div>
  );
}
export function AuroraBackground(props: FieldProps) {
  return <Field {...props} kind="aurora" />;
}
export function AnimatedGrid(props: FieldProps) {
  return <Field {...props} kind="grid" />;
}
export function ParticleField(props: FieldProps & { count?: number }) {
  return <Field {...props} kind="particles" />;
}
export function NoiseField(props: FieldProps) {
  return <Field {...props} kind="noise" />;
}
export function MeshGradient(props: FieldProps) {
  return <Field {...props} kind="mesh" />;
}
export function LiquidReveal({ children, className, replayKey }: FieldProps) {
  const ref = useRef<HTMLDivElement>(null),
    played = useRef(false),
    previous = useRef(replayKey);
  const controls = useAnimationControls(),
    reduced = useMotionPreference(),
    inView = useElementInView(ref, !reduced);
  useEffect(() => {
    if (previous.current !== replayKey) {
      previous.current = replayKey;
      played.current = false;
    }
    controls.stop();
    if (!reduced && inView && !played.current && !ref.current?.contains(document.activeElement)) {
      played.current = true;
      controls.set({ clipPath: "inset(8% round 45% 15% 40% 20%)" });
      void controls.start(
        { clipPath: "inset(0% round 0% 0% 0% 0%)" },
        { duration: motionTokens.duration.cinematic },
      );
    } else controls.set({ clipPath: "inset(0% round 0% 0% 0% 0%)" });
    return () => controls.stop();
  }, [controls, inView, reduced, replayKey]);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={controls}
      onFocusCapture={() => {
        played.current = true;
        controls.stop();
        controls.set({ clipPath: "inset(0% round 0% 0% 0% 0%)" });
      }}
      style={{ minWidth: 0 }}
    >
      {children}
    </motion.div>
  );
}
