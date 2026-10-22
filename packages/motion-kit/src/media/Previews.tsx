"use client";
import { mediaLayoutTokens, controlSize } from "../tokens/layout-base";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { mediaSource } from "../utils/media-source";
import { spacingTokens } from "../tokens/spacing";
import { motionTokens } from "../tokens/motion-base";
export function HoverMediaPreview({
  children,
  preview,
  label,
  className,
}: {
  children: ReactNode;
  preview: ReactNode;
  label: string;
  className?: string;
}) {
  if (!label.trim()) throw new Error("HoverMediaPreview requires a label");
  const [open, setOpen] = useState(false);
  const manual = useRef(false);
  const button = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const id = useId();
  return (
    <div
      className={className}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={() => {
        if (!manual.current && !content.current?.contains(document.activeElement)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          if (content.current?.contains(document.activeElement)) button.current?.focus();
          manual.current = false;
          setOpen(false);
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          manual.current = !open;
          setOpen(!open);
        }}
        style={{ minHeight: controlSize }}
      >
        {children}
      </button>
      <div id={id} ref={content} hidden={!open} style={{ marginTop: spacingTokens[4] }}>
        {open ? preview : null}
      </div>
    </div>
  );
}
export interface VideoHoverPreviewProps {
  src: string;
  poster: string;
  captionSrc: string;
  label: string;
  captionLanguage?: string;
  hoverPlay?: boolean;
  className?: string;
}
export function VideoHoverPreview({
  src,
  poster,
  captionSrc,
  label,
  captionLanguage = "en",
  hoverPlay = false,
  className,
}: VideoHoverPreviewProps) {
  if (!label.trim() || !/^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/.test(captionLanguage))
    throw new Error("Video preview requires a label and valid caption language");
  const video = useRef<HTMLVideoElement>(null),
    timer = useRef<number | null>(null),
    owned = useRef(false),
    generation = useRef(0);
  const reduced = useMotionPreference();
  const [blocked, setBlocked] = useState(false);
  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  const stop = useCallback(() => {
    generation.current++;
    clearTimer();
    if (owned.current) video.current?.pause();
    owned.current = false;
  }, [clearTimer]);
  useEffect(() => {
    if (reduced || !hoverPlay) stop();
    return stop;
  }, [hoverPlay, reduced, src, stop]);
  useEffect(() => {
    const node = video.current;
    return () => {
      stop();
      node?.pause();
    };
  }, [src, stop]);
  return (
    <div className={className}>
      <video
        ref={video}
        src={mediaSource(src)}
        poster={mediaSource(poster)}
        aria-label={label}
        controls
        muted
        playsInline
        preload="none"
        style={{
          width: "100%",
          maxWidth: "100%",
          aspectRatio: mediaLayoutTokens.comparisonAspect,
        }}
        onPointerEnter={(event) => {
          if (
            !hoverPlay ||
            reduced ||
            event.pointerType !== "mouse" ||
            !video.current ||
            !video.current.paused
          )
            return;
          owned.current = true;
          const attempt = ++generation.current;
          setBlocked(false);
          void video.current.play().catch(() => {
            if (attempt === generation.current && video.current) setBlocked(true);
          });
          clearTimer();
          timer.current = window.setTimeout(stop, motionTokens.media.previewLimit * 1000);
        }}
        onPointerLeave={stop}
        onPointerDownCapture={() => {
          owned.current = false;
          generation.current++;
          clearTimer();
        }}
        onKeyDownCapture={() => {
          owned.current = false;
          generation.current++;
          clearTimer();
        }}
      >
        <track
          kind="captions"
          src={mediaSource(captionSrc)}
          srcLang={captionLanguage}
          label="Captions"
          default
        />
      </video>
      {blocked && <p role="status">Use the player controls to start playback.</p>}
    </div>
  );
}
