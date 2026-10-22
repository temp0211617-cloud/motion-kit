"use client";
import { safeDOMProps } from "../utils/dom-props";

import { useEffect, useRef, type FocusEvent } from "react";
import {
  motion,
  useAnimationControls,
  type HTMLMotionProps,
  type TargetAndTransition,
} from "motion/react";
import { useMotionKit } from "../providers/MotionProvider";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { motionTokens } from "../tokens/motion-base";

export type RevealVariant = "fade" | "up" | "down" | "left" | "right" | "scale" | "scale-fade";
export interface RevealProps extends Omit<
  HTMLMotionProps<"div">,
  | "ref"
  | "initial"
  | "animate"
  | "exit"
  | "transition"
  | "variants"
  | "whileInView"
  | "viewport"
  | "dangerouslySetInnerHTML"
> {
  variant?: RevealVariant;
  trigger?: "mount" | "view";
  once?: boolean;
  amount?: number;
  delay?: number;
}

export const visibleTarget: TargetAndTransition = { opacity: 1, x: 0, y: 0, scale: 1 };
export function entranceTarget(variant: RevealVariant, distance: number): TargetAndTransition {
  switch (variant) {
    case "up":
      return { ...visibleTarget, opacity: 0, y: distance };
    case "down":
      return { ...visibleTarget, opacity: 0, y: -distance };
    case "left":
      return { ...visibleTarget, opacity: 0, x: distance };
    case "right":
      return { ...visibleTarget, opacity: 0, x: -distance };
    case "scale":
      return { ...visibleTarget, scale: motionTokens.scale.press };
    case "scale-fade":
      return { ...visibleTarget, opacity: 0, scale: motionTokens.scale.press };
    default:
      return { ...visibleTarget, opacity: 0 };
  }
}

/** SSR content stays visible. Motion is a client enhancement with observer cleanup. */
export function Reveal({
  children,
  variant = "up",
  trigger = "mount",
  once = true,
  amount = 0.2,
  delay = 0,
  onFocusCapture,
  ...props
}: RevealProps) {
  const { preset } = useMotionKit();
  const reduced = useMotionPreference();
  const controls = useAnimationControls();
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const entered = useRef(false);
  const duration = reduced ? 0 : preset.duration;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    controls.stop();
    const show = () => {
      entered.current = true;
      void controls.start(visibleTarget, {
        duration,
        delay: Number.isFinite(delay) ? Math.max(0, delay) : 0,
        ease: motionTokens.ease.entrance,
      });
    };
    if (reduced || (once && entered.current)) {
      controls.set(visibleTarget);
      return;
    }
    if (trigger === "view" && typeof IntersectionObserver === "undefined") {
      controls.set(visibleTarget);
      return;
    }
    controls.set(entranceTarget(variant, preset.distance));
    if (trigger === "mount") {
      show();
      return () => controls.stop();
    }
    const threshold = Number.isFinite(amount) ? Math.min(1, Math.max(0, amount)) : 0.2;
    const observer = new IntersectionObserver(
      (entries) => {
        if (element.contains(document.activeElement)) {
          controls.stop();
          controls.set(visibleTarget);
          return;
        }
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= threshold)) {
          show();
          if (once) observer.disconnect();
        } else if (!once) {
          controls.stop();
          controls.set(entranceTarget(variant, preset.distance));
        }
      },
      { threshold },
    );
    observerRef.current = observer;
    observer.observe(element);
    return () => {
      observer.disconnect();
      observerRef.current = null;
      controls.stop();
    };
  }, [amount, controls, delay, duration, once, preset.distance, reduced, trigger, variant]);

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    entered.current = true;
    controls.stop();
    controls.set(visibleTarget);
    if (once) observerRef.current?.disconnect();
    onFocusCapture?.(event);
  };
  return (
    <motion.div
      {...safeDOMProps(props)}
      ref={ref}
      initial={false}
      animate={controls}
      onFocusCapture={handleFocus}
    >
      {children}
    </motion.div>
  );
}

type FixedRevealProps = Omit<RevealProps, "variant">;
export function FadeIn(props: FixedRevealProps) {
  return <Reveal {...props} variant="fade" />;
}
export function FadeUp(props: FixedRevealProps) {
  return <Reveal {...props} variant="up" />;
}
export function FadeDown(props: FixedRevealProps) {
  return <Reveal {...props} variant="down" />;
}
export function FadeLeft(props: FixedRevealProps) {
  return <Reveal {...props} variant="left" />;
}
export function FadeRight(props: FixedRevealProps) {
  return <Reveal {...props} variant="right" />;
}
export function ScaleIn(props: FixedRevealProps) {
  return <Reveal {...props} variant="scale" />;
}
export function ScaleFade(props: FixedRevealProps) {
  return <Reveal {...props} variant="scale-fade" />;
}
export function SlideIn(
  props: FixedRevealProps & { direction?: "up" | "down" | "left" | "right" },
) {
  const { direction = "up", ...rest } = props;
  return <Reveal {...rest} variant={direction} />;
}
export function ScrollReveal(props: Omit<RevealProps, "trigger">) {
  return <Reveal {...props} trigger="view" />;
}
