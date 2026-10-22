"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { animate, motion, useDragControls, useMotionValue, type PanInfo } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { layoutTokens } from "../tokens/layout";
import { motionTokens } from "../tokens/motion-base";
import { gestureTokens } from "./tokens";
import { spacingTokens } from "../tokens/spacing";

export interface DragSurfaceProps {
  children: ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
}
const interactive = "a,button,input,textarea,select,video,audio,[contenteditable=true]";
const controlStyle = { minHeight: layoutTokens.controlSize };
function Drag({
  children,
  label,
  className,
  disabled = false,
  elastic,
}: DragSurfaceProps & { elastic: boolean }) {
  if (!label.trim()) throw new Error("A drag surface requires a label");
  const reduced = useMotionPreference(),
    controls = useDragControls(),
    x = useMotionValue(0);
  const focused = useRef(false);
  const limit = motionTokens.distance.lg;
  const move = (next: number) => {
    x.stop();
    if (!disabled && !reduced)
      void animate(
        x,
        Math.max(-limit, Math.min(limit, next)),
        elastic ? motionTokens.spring.elastic : { duration: motionTokens.duration.fast },
      );
  };
  useEffect(() => {
    if (reduced || disabled) {
      controls.cancel();
      x.jump(0);
    }
    return () => {
      controls.cancel();
      x.stop();
    };
  }, [controls, disabled, reduced, x]);
  return (
    <section aria-label={label} className={className} style={{ minWidth: 0 }}>
      <div
        role="group"
        aria-label={`${label} surface`}
        tabIndex={0}
        style={{ overflow: "clip", padding: spacingTokens[2], minWidth: 0 }}
        onFocusCapture={(event) => {
          if (event.target !== event.currentTarget) {
            focused.current = true;
            controls.cancel();
            x.jump(0);
          }
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) focused.current = false;
        }}
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !["ArrowLeft", "ArrowRight", "Home"].includes(event.key)
          )
            return;
          event.preventDefault();
          move(
            event.key === "Home"
              ? 0
              : x.get() +
                  (event.key === "ArrowLeft"
                    ? -motionTokens.distance.sm
                    : motionTokens.distance.sm),
          );
        }}
      >
        <motion.div
          drag={!reduced && !disabled ? "x" : false}
          dragControls={controls}
          dragListener={false}
          dragConstraints={{ left: -limit, right: limit }}
          dragElastic={elastic ? gestureTokens.elasticity : 0}
          dragMomentum={false}
          style={{ x: reduced || disabled ? 0 : x, minWidth: 0, touchAction: "pan-y" }}
          onPointerDown={(event) => {
            if (
              disabled ||
              reduced ||
              focused.current ||
              !event.isPrimary ||
              (event.pointerType === "mouse" && event.button !== 0) ||
              (event.target as Element).closest(interactive)
            )
              return;
            controls.start(event);
          }}
          onPointerCancel={() => {
            controls.cancel();
            x.jump(0);
          }}
        >
          {children}
        </motion.div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens[2] }}>
        <button
          type="button"
          style={controlStyle}
          disabled={disabled || reduced}
          aria-label={`Move ${label} left`}
          onClick={() => move(x.get() - motionTokens.distance.sm)}
        >
          Left
        </button>
        <button
          type="button"
          style={controlStyle}
          disabled={disabled || reduced}
          aria-label={`Reset ${label}`}
          onClick={() => {
            controls.cancel();
            x.stop();
            x.set(0);
          }}
        >
          Reset
        </button>
        <button
          type="button"
          style={controlStyle}
          disabled={disabled || reduced}
          aria-label={`Move ${label} right`}
          onClick={() => move(x.get() + motionTokens.distance.sm)}
        >
          Right
        </button>
      </div>
    </section>
  );
}
export function DragSurface(props: DragSurfaceProps) {
  return <Drag {...props} elastic={false} />;
}
export function ElasticDrag(props: DragSurfaceProps) {
  return <Drag {...props} elastic />;
}

export interface SwipeActionProps extends DragSurfaceProps {
  actionLabel: string;
  onAction: () => void;
}
export function SwipeAction({
  children,
  label,
  className,
  disabled = false,
  actionLabel,
  onAction,
}: SwipeActionProps) {
  if (!label.trim() || !actionLabel.trim())
    throw new Error("SwipeAction requires surface and action labels");
  const reduced = useMotionPreference(),
    x = useMotionValue(0),
    allowed = useRef(false);
  const reset = () => {
    allowed.current = false;
    x.stop();
    x.jump(0);
  };
  useEffect(() => {
    if (reduced || disabled) {
      allowed.current = false;
      x.jump(0);
    }
    return () => {
      x.stop();
    };
  }, [disabled, reduced, x]);
  const start = (event: MouseEvent | TouchEvent | PointerEvent) => {
    allowed.current =
      !disabled && !reduced && !(event.target as Element | null)?.closest(interactive);
  };
  return (
    <section aria-label={label} className={className} style={{ minWidth: 0 }}>
      <div style={{ overflow: "clip", padding: spacingTokens[2] }} onFocusCapture={reset}>
        <motion.div
          style={{ x: reduced ? 0 : x, touchAction: "pan-y", minWidth: 0 }}
          onPanStart={start}
          onPan={(_event, info: PanInfo) => {
            if (allowed.current)
              x.set(
                Math.max(
                  -motionTokens.distance.xl,
                  Math.min(motionTokens.distance.xl, info.offset.x),
                ),
              );
          }}
          onPanEnd={(event, info: PanInfo) => {
            const activate =
              !disabled &&
              !reduced &&
              event.type !== "pointercancel" &&
              event.type !== "touchcancel" &&
              allowed.current &&
              Math.abs(info.offset.x) >= motionTokens.distance.lg;
            reset();
            if (activate) onAction();
          }}
          onPointerCancel={reset}
        >
          {children}
        </motion.div>
      </div>
      <button type="button" disabled={disabled} onClick={onAction} style={controlStyle}>
        {actionLabel}
      </button>
    </section>
  );
}
