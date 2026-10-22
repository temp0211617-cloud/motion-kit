"use client";
import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { motion, useAnimationControls } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { lockScroll } from "./scroll-lock";
import { wrapDialogFocus } from "./focus";
import { spacingTokens } from "../tokens/spacing";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { radiusTokens } from "../tokens/radius";
import { motionTokens } from "../tokens/motion-base";
import { overlayTokens } from "../tokens/overlay";
export interface AnimatedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  closeOnBackdrop?: boolean;
}
function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  initialFocusRef,
  returnFocusRef,
  closeOnBackdrop = true,
  side,
}: AnimatedDialogProps & { side?: "left" | "right" }) {
  if (!title.trim()) throw new Error("Dialogs require a title");
  const ref = useRef<HTMLDialogElement>(null),
    release = useRef<(() => void) | null>(null),
    returnFocus = useRef<HTMLElement | null>(null),
    requested = useRef(open),
    backdropPress = useRef(false);
  const id = useId(),
    controls = useAnimationControls(),
    reduced = useMotionPreference();
  useEffect(() => {
    requested.current = open;
    const dialog = ref.current;
    if (!dialog) return;
    controls.stop();
    if (open) {
      if (!dialog.open) {
        returnFocus.current =
          returnFocusRef?.current ??
          (document.activeElement instanceof HTMLElement ? document.activeElement : null);
        dialog.showModal();
        release.current = lockScroll();
        if (initialFocusRef?.current && dialog.contains(initialFocusRef.current))
          initialFocusRef.current.focus();
        controls.set({
          opacity: 1,
          x: side ? (side === "right" ? motionTokens.distance.md : -motionTokens.distance.md) : 0,
          y: side ? 0 : motionTokens.distance.sm,
          scale: side ? 1 : motionTokens.scale.press,
        });
      }
      void controls.start(
        { opacity: 1, x: 0, y: 0, scale: 1 },
        { duration: reduced ? 0 : motionTokens.duration.default, ease: motionTokens.ease.entrance },
      );
    } else if (dialog.open) {
      void controls
        .start(
          {
            opacity: 0,
            x: side ? (side === "right" ? motionTokens.distance.md : -motionTokens.distance.md) : 0,
            y: side ? 0 : motionTokens.distance.sm,
            scale: side ? 1 : motionTokens.scale.press,
          },
          { duration: reduced ? 0 : motionTokens.duration.fast },
        )
        .then(() => {
          if (requested.current) return;
          dialog.close();
          release.current?.();
          release.current = null;
          if (returnFocus.current?.isConnected) returnFocus.current.focus();
        });
    }
  }, [controls, initialFocusRef, returnFocusRef, open, reduced, side]);
  useEffect(() => {
    const dialog = ref.current;
    return () => {
      requested.current = false;
      controls.stop();
      if (dialog?.open) dialog.close();
      release.current?.();
      release.current = null;
      if (returnFocus.current?.isConnected) returnFocus.current.focus();
    };
  }, [controls]);
  return (
    <dialog
      ref={ref}
      tabIndex={-1}
      className={className}
      aria-labelledby={`${id}-title`}
      {...(description ? { "aria-describedby": `${id}-description` } : {})}
      onClose={(event) => {
        event.stopPropagation();
        if (event.currentTarget.open) return;
        release.current?.();
        release.current = null;
        if (returnFocus.current?.isConnected) returnFocus.current.focus();
        onOpenChange(false);
      }}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpenChange(false);
      }}
      onKeyDown={(event) => {
        if ((event.target as Element).closest("dialog") === event.currentTarget) {
          if (event.key === "Escape") event.stopPropagation();
          wrapDialogFocus(event.currentTarget, event);
        }
      }}
      onFocusCapture={(event) => {
        if (
          requested.current &&
          (event.target as Element).closest("dialog") === event.currentTarget
        ) {
          controls.stop();
          controls.set({ opacity: 1, x: 0, y: 0, scale: 1 });
          const target = event.target as HTMLElement;
          target.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "instant" });
        }
      }}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (closeOnBackdrop && backdropPress.current && event.target === event.currentTarget)
          onOpenChange(false);
        backdropPress.current = false;
      }}
      style={{
        position: "fixed",
        inset: 0,
        margin: "auto",
        height: "fit-content",
        overflowY: "auto",
        overflowX: "hidden",
        overflowWrap: "anywhere",
        padding: 0,
        border: `1px solid ${colorTokens.border}`,
        color: colorTokens.text,
        background: colorTokens.surface,
        borderRadius: side ? 0 : radiusTokens.lg,
        maxWidth: `calc(100vw - ${overlayTokens.viewportGap})`,
        maxHeight: side ? "100dvh" : `calc(100dvh - ${overlayTokens.viewportGap})`,
        width: side ? `min(${overlayTokens.drawerWidth},90vw)` : layoutTokens.container.reading,
        ...(side
          ? {
              position: "fixed",
              top: 0,
              bottom: 0,
              left: side === "left" ? 0 : "auto",
              right: side === "right" ? 0 : "auto",
              margin: 0,
              height: "100dvh",
            }
          : {}),
      }}
    >
      <motion.div
        initial={false}
        animate={controls}
        style={{ padding: spacingTokens[6], minWidth: 0 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            gap: spacingTokens[4],
          }}
        >
          <h2 id={`${id}-title`} style={{ margin: 0, minWidth: 0, overflowWrap: "anywhere" }}>
            {title}
          </h2>
          <button
            type="button"
            aria-label={`Close ${title}`}
            onClick={() => onOpenChange(false)}
            style={{
              minWidth: layoutTokens.controlSize,
              minHeight: layoutTokens.controlSize,
              flexShrink: 0,
            }}
          >
            Close
          </button>
        </div>
        {description && <p id={`${id}-description`}>{description}</p>}
        {children}
      </motion.div>
    </dialog>
  );
}
export function AnimatedModal(props: AnimatedDialogProps) {
  return <Dialog {...props} />;
}
export function AnimatedDrawer(props: AnimatedDialogProps & { side?: "left" | "right" }) {
  return <Dialog {...props} side={props.side ?? "right"} />;
}
