"use client";
import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { motionTokens } from "../tokens/motion-base";
export function usePointerTilt(reduced: boolean, enabled = true) {
  const bounds = useRef<DOMRect | null>(null);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(y, motionTokens.spring.smooth),
    rotateY = useSpring(x, motionTokens.spring.smooth);
  const cleanup = useRef<() => void>(() => {});
  const reset = useCallback(() => {
    cleanup.current();
    bounds.current = null;
    x.set(0);
    y.set(0);
  }, [x, y]);
  useEffect(() => {
    if (reduced || !enabled) {
      reset();
      rotateX.jump(0);
      rotateY.jump(0);
    }
    return reset;
  }, [enabled, reduced, reset, rotateX, rotateY]);
  return {
    bounds,
    rotateX,
    rotateY,
    reset,
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (reduced || !enabled || event.pointerType !== "mouse") return;
      reset();
      bounds.current = event.currentTarget.getBoundingClientRect();
      const invalidate = () => {
        bounds.current = null;
      };
      window.addEventListener("resize", invalidate);
      window.addEventListener("scroll", invalidate, true);
      cleanup.current = () => {
        window.removeEventListener("resize", invalidate);
        window.removeEventListener("scroll", invalidate, true);
      };
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (reduced || !enabled || event.pointerType !== "mouse") return;
      const box = bounds.current ?? event.currentTarget.getBoundingClientRect();
      bounds.current = box;
      if (box.width <= 0 || box.height <= 0) return;
      x.set(
        Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1)) *
          motionTokens.surface.tilt,
      );
      y.set(
        -Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1)) *
          motionTokens.surface.tilt,
      );
    },
  };
}
