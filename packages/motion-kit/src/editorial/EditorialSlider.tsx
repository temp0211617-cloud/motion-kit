"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, AnimatePresence, motion, useIsPresent, type PanInfo } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { useWideLayout } from "../hooks/useWideLayout";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { spacingTokens } from "../tokens/spacing";
import { motionTokens } from "../tokens/motion-base";
import { headingLargeSize } from "../tokens/heading";
import { ordinal } from "./ordinal";
const controlStyle = { minHeight: layoutTokens.controlSize };
const pauseMedia = (node: Element | null) =>
  node?.querySelectorAll("video,audio").forEach((media) => (media as HTMLMediaElement).pause());
export interface EditorialSlide {
  id: string;
  title: string;
  media: ReactNode;
  children: ReactNode;
}
export interface EditorialSliderProps {
  slides: readonly EditorialSlide[];
  label: string;
  className?: string;
  autoplay?: boolean;
  interval?: number;
  wheel?: boolean;
}
function Panel({
  slide,
  index,
  total,
  direction,
  reduced,
  wide,
}: {
  slide: EditorialSlide;
  index: number;
  total: number;
  direction: number;
  reduced: boolean;
  wide: boolean;
}) {
  const present = useIsPresent();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced && ref.current)
      void animate(ref.current, { x: 0, clipPath: "inset(0%)" }, { duration: 0 });
  }, [reduced]);
  return (
    <motion.div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${slide.title}`}
      inert={present ? undefined : true}
      aria-hidden={present ? undefined : true}
      initial={
        reduced
          ? false
          : {
              x: direction * motionTokens.distance.md,
              clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
            }
      }
      animate={{ x: 0, clipPath: "inset(0%)" }}
      exit={{ x: reduced ? 0 : -direction * motionTokens.distance.md, opacity: 0 }}
      transition={{ duration: reduced ? 0 : motionTokens.duration.default }}
      onFocusCapture={(event) => {
        void animate(event.currentTarget, { x: 0, clipPath: "inset(0%)" }, { duration: 0 });
      }}
      style={{
        display: "grid",
        gridTemplateColumns: wide ? "minmax(0,3fr) minmax(0,2fr)" : "minmax(0,1fr)",
        gap: spacingTokens[8],
        minWidth: 0,
        overflowWrap: "anywhere",
      }}
    >
      <div style={{ minWidth: 0 }}>{slide.media}</div>
      <div style={{ minWidth: 0 }}>
        <p style={{ color: colorTokens.muted, fontVariantNumeric: "tabular-nums" }}>
          {ordinal(index + 1)} / {ordinal(total)}
        </p>
        <h3 style={{ fontSize: headingLargeSize }}>{slide.title}</h3>
        {slide.children}
      </div>
    </motion.div>
  );
}
export function EditorialSlider({
  slides,
  label,
  className,
  autoplay = false,
  interval = 5,
  wheel = false,
}: EditorialSliderProps) {
  if (
    !label.trim() ||
    !slides.length ||
    slides.length > 120 ||
    slides.some((slide) => !slide.id.trim() || !slide.title.trim()) ||
    new Set(slides.map((slide) => slide.id)).size !== slides.length
  )
    throw new Error("Use a label and 1–120 unique slides");
  const [index, setIndex] = useState(0),
    [direction, setDirection] = useState(1),
    [playing, setPlaying] = useState(autoplay),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false);
  const reduced = useMotionPreference(),
    wide = useWideLayout();
  const root = useRef<HTMLDivElement>(null);
  const inView = useElementInView(root, !reduced);
  const lastWheel = useRef(0);
  const active = Math.min(index, slides.length - 1);
  const delay = Number.isFinite(interval) ? Math.max(5, Math.min(60, interval)) : 5;
  const move = (next: number) => {
    pauseMedia(root.current);
    setPlaying(false);
    setDirection(next > active ? 1 : -1);
    setIndex(((next % slides.length) + slides.length) % slides.length);
  };
  useEffect(() => {
    if (!playing || reduced || hovered || focused || !inView || slides.length < 2) return;
    const timer = window.setTimeout(() => {
      pauseMedia(root.current);
      setDirection(1);
      setIndex((previous) => (previous + 1) % slides.length);
    }, delay * 1000);
    return () => window.clearTimeout(timer);
  }, [active, delay, focused, hovered, inView, playing, reduced, slides.length]);
  const swipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const target = event.target as Element | null;
    if (
      typeof target?.closest === "function" &&
      target.closest("button,a,input,select,textarea,video,audio,[contenteditable=true]")
    )
      return;
    if (
      Math.abs(info.offset.x) > motionTokens.distance.lg &&
      Math.abs(info.offset.x) > Math.abs(info.offset.y)
    )
      move(active + (info.offset.x < 0 ? 1 : -1));
  };
  return (
    <div
      className={className}
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
      tabIndex={0}
      style={{ minWidth: 0 }}
      onKeyDown={(event) => {
        if (
          event.target !== event.currentTarget ||
          !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
        )
          return;
        event.preventDefault();
        move(
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? slides.length - 1
              : active + (event.key === "ArrowLeft" ? -1 : 1),
        );
      }}
    >
      <motion.div
        ref={root}
        style={{ overflow: "clip", touchAction: "pan-y" }}
        onPanEnd={swipe}
        onDragStartCapture={(event) => {
          if ((event.target as Element).tagName === "IMG") event.preventDefault();
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        onWheel={(event) => {
          if (
            !wheel ||
            Math.abs(event.deltaX) < motionTokens.distance.lg ||
            Math.abs(event.deltaX) < Math.abs(event.deltaY) ||
            event.timeStamp - lastWheel.current < motionTokens.duration.relaxed * 1000
          )
            return;
          lastWheel.current = event.timeStamp;
          move(active + (event.deltaX > 0 ? 1 : -1));
        }}
      >
        <AnimatePresence initial={false} mode="wait">
          <Panel
            key={slides[active]?.id}
            slide={slides[active] as EditorialSlide}
            index={active}
            total={slides.length}
            direction={direction}
            reduced={reduced}
            wide={wide}
          />
        </AnimatePresence>
      </motion.div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: spacingTokens[4],
          marginTop: spacingTokens[6],
        }}
      >
        <button
          type="button"
          aria-label={`Previous ${label}`}
          disabled={slides.length < 2}
          onClick={() => move(active - 1)}
          style={controlStyle}
        >
          Previous
        </button>
        <output aria-live={playing ? "off" : "polite"}>
          {active + 1} / {slides.length}
        </output>
        <button
          type="button"
          aria-label={`Next ${label}`}
          disabled={slides.length < 2}
          onClick={() => move(active + 1)}
          style={controlStyle}
        >
          Next
        </button>
        <button
          type="button"
          disabled={reduced || slides.length < 2}
          aria-pressed={playing && !reduced}
          onClick={() => setPlaying(!playing)}
          style={controlStyle}
        >
          {reduced ? `${label}: static playback` : `${playing ? "Pause" : "Play"} ${label}`}
        </button>
      </div>
      <div
        aria-hidden="true"
        style={{
          height: spacingTokens[1],
          background: colorTokens.border,
          marginTop: spacingTokens[4],
        }}
      >
        <motion.div
          animate={{ scaleX: (active + 1) / slides.length }}
          transition={{ duration: reduced ? 0 : motionTokens.duration.fast }}
          style={{ height: "100%", background: colorTokens.accent, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}
