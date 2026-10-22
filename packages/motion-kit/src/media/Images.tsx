"use client";
import { gridMin } from "../tokens/layout-base";
import { Children, useEffect, useId, useRef, type ReactNode } from "react";
import {
  motion,
  LayoutGroup,
  AnimatePresence,
  useIsPresent,
  useAnimationControls,
} from "motion/react";
import { mediaSource } from "../utils/media-source";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { usePointerTilt } from "../hooks/usePointerTilt";
import { radiusTokens } from "../tokens/radius";
import { spacingTokens } from "../tokens/spacing";
import { motionTokens } from "../tokens/motion-base";
export interface MediaImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: ReactNode;
  className?: string;
}
function Image({
  src,
  alt,
  width,
  height,
  controls,
}: MediaImageProps & { controls?: ReturnType<typeof useAnimationControls> }) {
  if (
    !alt.trim() ||
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  )
    throw new Error("Images require descriptive alt text and positive dimensions");
  return (
    <motion.img
      initial={false}
      {...(controls ? { animate: controls } : {})}
      src={mediaSource(src)}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{
        display: "block",
        width: "100%",
        maxWidth: "100%",
        height: "auto",
        borderRadius: radiusTokens.lg,
      }}
    />
  );
}
export function ImageReveal({ caption, className, ...props }: MediaImageProps) {
  const ref = useRef<HTMLElement>(null),
    played = useRef(false);
  const reduced = useMotionPreference();
  const inView = useElementInView(ref, !reduced);
  const controls = useAnimationControls();
  useEffect(() => {
    controls.stop();
    if (reduced || !inView || played.current) controls.set({ opacity: 1, scale: 1 });
    else {
      played.current = true;
      controls.set({ opacity: motionTokens.media.enterOpacity, scale: motionTokens.scale.press });
      void controls.start({ opacity: 1, scale: 1 }, { duration: motionTokens.duration.default });
    }
    return () => controls.stop();
  }, [controls, inView, reduced]);
  return (
    <figure ref={ref} className={className} style={{ margin: 0 }}>
      <Image {...props} controls={controls} />
      {caption && <figcaption style={{ marginTop: spacingTokens[3] }}>{caption}</figcaption>}
    </figure>
  );
}
export function ImageTilt({ caption, className, ...props }: MediaImageProps) {
  const reduced = useMotionPreference();
  const tilt = usePointerTilt(reduced);
  return (
    <figure
      className={className}
      style={{ margin: 0, perspective: motionTokens.surface.perspective }}
    >
      <motion.div
        onPointerEnter={tilt.onPointerEnter}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.reset}
        onPointerCancel={tilt.reset}
        style={{ rotateX: reduced ? 0 : tilt.rotateX, rotateY: reduced ? 0 : tilt.rotateY }}
      >
        <Image {...props} />
      </motion.div>
      {caption && <figcaption style={{ marginTop: spacingTokens[3] }}>{caption}</figcaption>}
    </figure>
  );
}
function GalleryItem({ children, reduced }: { children: ReactNode; reduced: boolean }) {
  const present = useIsPresent();
  return (
    <motion.div
      inert={present ? undefined : true}
      aria-hidden={present ? undefined : true}
      layout={!reduced}
      initial={
        reduced
          ? false
          : { opacity: motionTokens.media.enterOpacity, scale: motionTokens.scale.press }
      }
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : motionTokens.duration.default }}
      style={{ minWidth: 0 }}
    >
      {children}
    </motion.div>
  );
}
export function AnimatedGallery({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useMotionPreference();
  const id = useId();
  const items = Children.toArray(children);
  const target = useRef<HTMLDivElement>(null);
  const inView = useElementInView(target, !reduced && items.length <= 64);
  return (
    <LayoutGroup id={id}>
      <div
        ref={target}
        className={className}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${gridMin}),1fr))`,
          gap: spacingTokens[6],
        }}
      >
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <GalleryItem
              key={
                typeof item === "object" && item !== null && "key" in item
                  ? String(item.key)
                  : index
              }
              reduced={reduced || !inView || items.length > 64}
            >
              {item}
            </GalleryItem>
          ))}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
