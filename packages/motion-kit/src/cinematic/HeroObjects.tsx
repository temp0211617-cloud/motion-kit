"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useAnimationControls, useMotionTemplate, useTransform } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { usePointerTilt } from "../hooks/usePointerTilt";
import { motionTokens } from "../tokens/motion-base";
import { colorTokens } from "../tokens/layout";
import { spacingTokens } from "../tokens/spacing";
import type { CinematicSceneProps } from "./Scenes";
export function FloatingHeroObjects({
  children,
  objects,
  className,
}: Omit<CinematicSceneProps, "style"> & { objects: readonly ReactNode[] }) {
  if (objects.length > 8) throw new Error("Use at most eight decorative objects");
  const target = useRef<HTMLDivElement>(null),
    played = useRef(false);
  const reduced = useMotionPreference(),
    inView = useElementInView(target, !reduced);
  const controls = useAnimationControls();
  useEffect(() => {
    controls.stop();
    if (!reduced && inView && !played.current) {
      played.current = true;
      void controls.start(
        { y: [0, -motionTokens.distance.xs, 0], rotate: [0, motionTokens.surface.floatAngle, 0] },
        { duration: motionTokens.duration.cinematic * 2 },
      );
    } else controls.set({ y: 0, rotate: 0 });
    return () => controls.stop();
  }, [controls, inView, reduced]);
  return (
    <div
      ref={target}
      className={className}
      style={{ position: "relative", isolation: "isolate", minWidth: 0 }}
    >
      <div
        aria-hidden="true"
        inert
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          gap: spacingTokens[4],
          overflow: "clip",
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        {objects.map((object, index) => (
          <motion.div key={index} initial={false} animate={controls} style={{ minWidth: 0 }}>
            {object}
          </motion.div>
        ))}
      </div>
      {children}
    </div>
  );
}
export function SpotlightHero({ children, className }: Omit<CinematicSceneProps, "style">) {
  const reduced = useMotionPreference(),
    pointer = usePointerTilt(reduced);
  const x = useTransform(
    pointer.rotateY,
    [-motionTokens.surface.tilt, motionTokens.surface.tilt],
    [0, 100],
  );
  const y = useTransform(
    pointer.rotateX,
    [-motionTokens.surface.tilt, motionTokens.surface.tilt],
    [100, 0],
  );
  const background = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, ${colorTokens.accent} 12%, transparent), transparent 65%)`;
  return (
    <div
      className={className}
      onPointerEnter={pointer.onPointerEnter}
      onPointerMove={pointer.onPointerMove}
      onPointerLeave={pointer.reset}
      onPointerCancel={pointer.reset}
      style={{ position: "relative", isolation: "isolate", minWidth: 0 }}
    >
      <motion.div
        aria-hidden="true"
        inert
        style={{ position: "absolute", inset: 0, pointerEvents: "none", background, zIndex: -1 }}
      />
      {children}
    </div>
  );
}
