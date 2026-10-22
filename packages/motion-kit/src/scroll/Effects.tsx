"use client";
import { safeDOMProps } from "../utils/dom-props";
import { useState, type ReactNode, type HTMLAttributes } from "react";
import { motion, useTransform, useVelocity, useSpring } from "motion/react";
import { LazyController, SceneProvider, useSceneController } from "./engine";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { motionTokens } from "../tokens";
export interface ScrollProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "dangerouslySetInnerHTML" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
> {
  children?: ReactNode;
}
type Effect = "parallax" | "scale" | "rotate" | "opacity" | "mask" | "velocity";
function ScrollEffect({
  effect,
  children,
  style,
  onFocusCapture,
  onBlurCapture,
  ...props
}: ScrollProps & { effect: Effect }) {
  const { target, inView, progress } = useSceneController();
  const reduced = useMotionPreference();
  const [focused, setFocused] = useState(false);
  const flat = reduced || focused || !inView;
  const y = useTransform(progress, [0, 1], [motionTokens.distance.md, -motionTokens.distance.md]);
  const scale = useTransform(
    progress,
    [0, 1],
    [motionTokens.scale.press, motionTokens.scale.hover],
  );
  const rotate = useTransform(
    progress,
    [0, 1],
    [-motionTokens.surface.tilt / 2, motionTokens.surface.tilt / 2],
  );
  const opacity = useTransform(progress, [0, 0.5, 1], [0.5, 1, 0.5]);
  const clipPath = useTransform(
    progress,
    [0, 0.5, 1],
    ["inset(8% 0% 8% 0%)", "inset(0% 0% 0% 0%)", "inset(8% 0% 8% 0%)"],
  );
  const velocity = useVelocity(progress);
  const drift = useTransform(velocity, (value) =>
    Math.max(
      -motionTokens.distance.xs,
      Math.min(motionTokens.distance.xs, value * motionTokens.distance.xs),
    ),
  );
  const x = useSpring(drift, motionTokens.spring.soft);
  return (
    <div
      {...safeDOMProps(props)}
      ref={target}
      style={{ minWidth: 0, ...style }}
      onFocusCapture={(event) => {
        onFocusCapture?.(event);
        setFocused(true);
      }}
      onBlurCapture={(event) => {
        onBlurCapture?.(event);
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <LazyController target={target} progress={progress} enabled={inView && !flat} />
      <motion.div
        style={{
          y: effect === "parallax" && !flat ? y : 0,
          scale: effect === "scale" && !flat ? scale : 1,
          rotate: effect === "rotate" && !flat ? rotate : 0,
          opacity: effect === "opacity" && !flat ? opacity : 1,
          clipPath: effect === "mask" && !flat ? clipPath : "inset(0%)",
          x: effect === "velocity" && !flat ? x : 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
export function Parallax(props: ScrollProps) {
  return <ScrollEffect {...props} effect="parallax" />;
}
export function ScrollScale(props: ScrollProps) {
  return <ScrollEffect {...props} effect="scale" />;
}
export function ScrollRotate(props: ScrollProps) {
  return <ScrollEffect {...props} effect="rotate" />;
}
export function ScrollOpacity(props: ScrollProps) {
  return <ScrollEffect {...props} effect="opacity" />;
}
export function ScrollMaskReveal(props: ScrollProps) {
  return <ScrollEffect {...props} effect="mask" />;
}
export function ScrollVelocity(props: ScrollProps) {
  return <ScrollEffect {...props} effect="velocity" />;
}
export function ParallaxSection({ children, ...props }: ScrollProps) {
  return (
    <section>
      <Parallax {...props}>{children}</Parallax>
    </section>
  );
}
export function ScrollScene({ children, ...props }: ScrollProps) {
  const { target, inView, progress } = useSceneController();
  const reduced = useMotionPreference();
  return (
    <div {...safeDOMProps(props)} ref={target}>
      <LazyController target={target} progress={progress} enabled={inView && !reduced} />
      <SceneProvider progress={progress}>{children}</SceneProvider>
    </div>
  );
}
