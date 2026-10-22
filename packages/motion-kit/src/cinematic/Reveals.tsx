"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { motion, useAnimationControls, type TargetAndTransition } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { colorTokens } from "../tokens/layout";
import { motionTokens } from "../tokens/motion-base";
import { mediaSource } from "../utils/media-source";
import type { MediaImageProps } from "../media/Images";
import { radiusTokens } from "../tokens/radius";
import { spacingTokens } from "../tokens/spacing";

export interface CinematicRevealProps {
  children: ReactNode;
  className?: string;
  /** Changes restart a visible reveal without remounting children. */
  replayKey?: string | number;
}
function useReveal(
  replayKey: string | number | undefined,
  closed: TargetAndTransition,
  open: TargetAndTransition,
) {
  const target = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduced = useMotionPreference();
  const inView = useElementInView(target, !reduced);
  const completed = useRef(false),
    lastKey = useRef(replayKey);
  useEffect(() => {
    if (lastKey.current !== replayKey) {
      lastKey.current = replayKey;
      completed.current = false;
    }
    controls.stop();
    if (
      reduced ||
      !inView ||
      completed.current ||
      target.current?.contains(document.activeElement)
    ) {
      controls.set(open);
    } else {
      completed.current = true;
      controls.set(closed);
      void controls.start(open, {
        duration: motionTokens.duration.cinematic,
        ease: motionTokens.ease.entrance,
      });
    }
    return () => controls.stop();
  }, [closed, controls, inView, open, reduced, replayKey]);
  const finish = () => {
    completed.current = true;
    controls.stop();
    controls.set(open);
  };
  return { target, controls, finish };
}
const masks = {
  wipe: { closed: { clipPath: "inset(0 100% 0 0)" }, open: { clipPath: "inset(0%)" } },
  mask: {
    closed: { clipPath: "inset(45% 10% round 50%)" },
    open: { clipPath: "inset(0% round 0%)" },
  },
  iris: {
    closed: { clipPath: "circle(0% at 50% 50%)" },
    open: { clipPath: "circle(150% at 50% 50%)" },
  },
} satisfies Record<string, { closed: TargetAndTransition; open: TargetAndTransition }>;
function Mask({
  children,
  className,
  replayKey,
  kind,
}: CinematicRevealProps & { kind: keyof typeof masks }) {
  const { target, controls, finish } = useReveal(replayKey, masks[kind].closed, masks[kind].open);
  return (
    <motion.div
      ref={target}
      className={className}
      initial={false}
      animate={controls}
      onFocusCapture={finish}
      style={{ minWidth: 0 }}
    >
      {children}
    </motion.div>
  );
}
export function MaskReveal(props: CinematicRevealProps) {
  return <Mask {...props} kind="mask" />;
}
export function WipeReveal(props: CinematicRevealProps) {
  return <Mask {...props} kind="wipe" />;
}
export function IrisReveal(props: CinematicRevealProps) {
  return <Mask {...props} kind="iris" />;
}
const curtainClosed = { scaleX: 1, scaleY: 1 };
const horizontalOpen = { scaleX: 0, scaleY: 1 },
  verticalOpen = { scaleX: 1, scaleY: 0 };
export interface CurtainsProps extends CinematicRevealProps {
  direction?: "horizontal" | "vertical";
}
/** Two decorative panels; content renders once and stays visible in SSR/reduced motion. */
export function Curtains({
  children,
  className,
  replayKey,
  direction = "horizontal",
}: CurtainsProps) {
  const horizontal = direction === "horizontal";
  const { target, controls, finish } = useReveal(
    replayKey,
    curtainClosed,
    horizontal ? horizontalOpen : verticalOpen,
  );
  return (
    <div
      ref={target}
      className={className}
      onFocusCapture={finish}
      style={{ position: "relative", isolation: "isolate", minWidth: 0 }}
    >
      {children}
      {[0, 1].map((side) => (
        <motion.div
          key={side}
          aria-hidden="true"
          inert
          initial={horizontal ? horizontalOpen : verticalOpen}
          animate={controls}
          style={{
            position: "absolute",
            pointerEvents: "none",
            inset: 0,
            background: colorTokens.background,
            width: horizontal ? "50%" : "100%",
            height: horizontal ? "100%" : "50%",
            left: horizontal && side ? "50%" : 0,
            top: !horizontal && side ? "50%" : 0,
            transformOrigin: horizontal
              ? side
                ? "right center"
                : "left center"
              : side
                ? "center bottom"
                : "center top",
          }}
        />
      ))}
    </div>
  );
}
export function SplitScreenReveal(props: CinematicRevealProps) {
  return <Curtains {...props} direction="vertical" />;
}
export function ImageMaskReveal({
  caption,
  className,
  replayKey,
  ...image
}: MediaImageProps & { replayKey?: string | number }) {
  if (
    !image.alt.trim() ||
    !Number.isFinite(image.width) ||
    !Number.isFinite(image.height) ||
    image.width <= 0 ||
    image.height <= 0
  )
    throw new Error("Images require alt text and positive dimensions");
  return (
    <figure className={className} style={{ margin: 0 }}>
      <MaskReveal {...(replayKey !== undefined ? { replayKey } : {})}>
        <img
          src={mediaSource(image.src)}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          style={{ display: "block", width: "100%", height: "auto", borderRadius: radiusTokens.lg }}
        />
      </MaskReveal>
      {caption && <figcaption style={{ marginTop: spacingTokens[3] }}>{caption}</figcaption>}
    </figure>
  );
}
