"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useScroll, useVelocity, useMotionValue, useMotionValueEvent } from "motion/react";
import { LiveTicker, type LiveTickerProps } from "./LiveTicker";
import { useElementInView } from "../hooks/useElementInView";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { motionTokens, spacingTokens } from "../tokens";
export function DraggableTicker(props: Omit<LiveTickerProps, "draggable">) {
  return <LiveTicker {...props} draggable />;
}
export function VerticalTicker(props: Omit<LiveTickerProps, "axis">) {
  return <LiveTicker {...props} axis="vertical" />;
}
export function HoverPauseTicker(props: Omit<LiveTickerProps, "pauseOnHover">) {
  return <LiveTicker {...props} pauseOnHover />;
}
export function EdgeFadeTicker(props: Omit<LiveTickerProps, "edgeFade">) {
  return <LiveTicker {...props} edgeFade />;
}
export function DualTicker({
  first,
  second,
  label,
}: {
  first: ReactNode;
  second: ReactNode;
  label: string;
}) {
  return (
    <div>
      <LiveTicker label={`${label} upper`} direction="forward">
        {first}
      </LiveTicker>
      <LiveTicker label={`${label} lower`} direction="reverse">
        {second}
      </LiveTicker>
    </div>
  );
}
export function LogoTicker(props: LiveTickerProps) {
  return <LiveTicker {...props} semantic="list" gap={spacingTokens[6]} />;
}
export interface TickerImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}
function imageSource(source: string) {
  const trimmed = source.trim();
  if (
    !trimmed ||
    [...trimmed].some(
      (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  )
    throw new Error("ImageTicker requires safe image URLs");
  try {
    const url = new URL(trimmed, "https://motion-kit.invalid/");
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
  } catch {
    throw new Error("ImageTicker requires safe image URLs");
  }
  return trimmed;
}
export function ImageTicker({
  images,
  ...props
}: Omit<LiveTickerProps, "children"> & { images: readonly TickerImage[] }) {
  return (
    <LiveTicker {...props}>
      {images.map((image, index) => {
        if (
          !Number.isFinite(image.width) ||
          !Number.isFinite(image.height) ||
          image.width <= 0 ||
          image.height <= 0 ||
          !image.alt.trim()
        )
          throw new Error("ImageTicker requires positive dimensions and descriptive alt text");
        return (
          <img
            key={index}
            src={imageSource(image.src)}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
          />
        );
      })}
    </LiveTicker>
  );
}
export function NewsTicker({
  items,
  ...props
}: Omit<LiveTickerProps, "children"> & { items: readonly string[] }) {
  return (
    <LiveTicker {...props}>
      {items.map((item, index) => (
        <span key={index}>{item}</span>
      ))}
    </LiveTicker>
  );
}
function VelocityDriver({ speed }: { speed: ReturnType<typeof useMotionValue<number>> }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  useMotionValueEvent(velocity, "change", (value) =>
    speed.set(motionTokens.text.tickerSpeed + Math.min(160, Math.abs(value) / 20)),
  );
  useEffect(() => () => speed.set(motionTokens.text.tickerSpeed), [speed]);
  return null;
}
export function VelocityTicker(props: Omit<LiveTickerProps, "speed">) {
  const target = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const inView = useElementInView(target, !reduced);
  const speed = useMotionValue<number>(motionTokens.text.tickerSpeed);
  return (
    <div ref={target}>
      {inView && !reduced && <VelocityDriver speed={speed} />}
      <LiveTicker {...props} speed={speed} />
    </div>
  );
}
