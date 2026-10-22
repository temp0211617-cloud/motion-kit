"use client";
import { useEffect, useRef } from "react";
import { MotionButton, type MotionButtonProps } from "../interactions/Buttons";
import { gestureTokens } from "./tokens";
import { spacingTokens } from "../tokens/spacing";
export type PressableProps = MotionButtonProps;
export function Pressable(props: PressableProps) {
  return <MotionButton {...props} />;
}
export interface LongPressMotionProps {
  label: string;
  onLongPress: () => void;
  delayMs?: number;
  disabled?: boolean;
  className?: string;
}
export function LongPressMotion({
  label,
  onLongPress,
  delayMs = gestureTokens.holdMs,
  disabled = false,
  className,
}: LongPressMotionProps) {
  if (
    !label.trim() ||
    !Number.isFinite(delayMs) ||
    delayMs < gestureTokens.minHoldMs ||
    delayMs > gestureTokens.maxHoldMs
  )
    throw new Error("LongPressMotion requires a label and delay of 300–2000ms");
  const timer = useRef<number | null>(null),
    held = useRef(false);
  const cancel = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    held.current = false;
  };
  useEffect(() => {
    const cancelHold = () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = null;
      held.current = false;
    };
    if (disabled) cancelHold();
    const hide = () => {
      if (document.hidden) cancelHold();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      cancelHold();
      document.removeEventListener("visibilitychange", hide);
    };
  }, [disabled, delayMs, onLongPress]);
  const start = () => {
    if (disabled || held.current) return;
    held.current = true;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      onLongPress();
    }, delayMs);
  };
  return (
    <div className={className} style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens[3] }}>
      <MotionButton
        disabled={disabled}
        onPointerDown={(event) => {
          if (event.isPrimary && event.button === 0) start();
        }}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
        onBlur={cancel}
        onKeyDown={(event) => {
          if ((event.key === " " || event.key === "Enter") && !event.repeat) {
            event.preventDefault();
            start();
          }
        }}
        onKeyUp={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            cancel();
          }
        }}
        onClick={(event) => event.preventDefault()}
      >
        Hold {label}
      </MotionButton>
      <MotionButton
        disabled={disabled}
        onClick={() => {
          cancel();
          onLongPress();
        }}
      >
        Activate {label}
      </MotionButton>
    </div>
  );
}
