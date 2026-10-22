"use client";

import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { motionTokens } from "@personal/motion-kit/tokens";
import { useStageVisibility } from "./useStageVisibility";
import { artworkNames } from "./artwork-data";
import { ArtworkImage } from "./ArtworkImage";

const modes = ["Helix", "Barrel", "Ring", "Sphere"] as const;
type Mode = (typeof modes)[number];
const wrap = (value: number) => ((value % 8) + 8) % 8;

function RotateWhileVisible({ angle }: { angle: MotionValue<number> }) {
  useAnimationFrame((_, delta) => angle.set(angle.get() - Math.min(delta, 32) * 0.006));
  return null;
}
function GallerySpace({
  radius,
  mode,
  selected,
  angle,
}: {
  radius: number;
  mode: Mode;
  selected: number;
  angle: MotionValue<number>;
}) {
  const rotateY = useSpring(angle, motionTokens.spring.smooth);
  return (
    <motion.div className="spatial-space" style={{ rotateY, rotateX: -5 }} aria-hidden="true">
      {artworkNames.map((name, index) => {
        const theta = (index * Math.PI) / 4;
        const latitude = (((index % 4) - 1.5) * Math.PI) / 7;
        const barrelTheta = ((index % 4) * Math.PI) / 2 + (index > 3 ? Math.PI / 4 : 0);
        const x =
          mode === "Sphere"
            ? Math.sin(theta) * Math.cos(latitude) * radius
            : Math.sin(mode === "Barrel" ? barrelTheta : theta) * radius;
        const z =
          mode === "Sphere"
            ? Math.cos(theta) * Math.cos(latitude) * radius
            : Math.cos(mode === "Barrel" ? barrelTheta : theta) * radius;
        const y =
          mode === "Helix"
            ? (index - 3.5) * 16
            : mode === "Barrel"
              ? index > 3
                ? 60
                : -60
              : mode === "Sphere"
                ? Math.sin(latitude) * radius * 0.85
                : 0;
        return (
          <motion.div
            key={name}
            className="spatial-card"
            initial={false}
            animate={{
              x,
              y,
              z,
              rotateY: ((mode === "Barrel" ? barrelTheta : theta) * 180) / Math.PI,
              rotateX: mode === "Sphere" ? (-latitude * 180) / Math.PI : 0,
            }}
            transition={motionTokens.spring.soft}
          >
            <ArtworkImage index={index} />
            <motion.span
              className="spatial-card-shade"
              initial={false}
              animate={{ opacity: index === selected ? 0 : 0.22 }}
              transition={{ duration: motionTokens.duration.default }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function SpatialGallery() {
  const [mode, setMode] = useState<Mode>("Helix"),
    [selected, setSelected] = useState(0),
    [playing, setPlaying] = useState(true),
    [radius, setRadius] = useState(150);
  const reduced = useMotionPreference();
  const { ref, visible, seen } = useStageVisibility();
  const angle = useMotionValue(0);
  const drag = useRef<{ pointerId: number; origin: number; angle: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setRadius(Math.min(245, entry.contentRect.width * 0.255));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
  const step = (direction: number) => {
    setPlaying(false);
    const next = Math.round(angle.get() / 45) * 45 - direction * 45;
    angle.set(next);
    setSelected(wrap(-next / 45));
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.button !== 0) return;
    drag.current = { pointerId: event.pointerId, origin: event.clientX, angle: angle.get() };
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlaying(false);
    setDragging(true);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (current?.pointerId === event.pointerId)
      angle.set(current.angle + (event.clientX - current.origin) * 0.4);
  };
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    const next = Math.round(angle.get() / 45) * 45;
    angle.set(next);
    setSelected(wrap(-next / 45));
  };
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
  };
  const active = playing && visible && !reduced && !dragging;
  return (
    <section className="signature-gallery" aria-labelledby="spatial-title">
      <div className="signature-heading">
        <div>
          <p className="eyebrow">SPATIAL STUDY / ORIGINAL ARTWORK</p>
          <h2 id="spatial-title">A different dimension.</h2>
        </div>
        <p>
          Drag to rotate. Change the shape.
          <br />
          Eight artworks, four ways to see them.
        </p>
      </div>
      <div
        ref={ref}
        className={`spatial-viewport ${reduced ? "spatial-reduced" : ""}`}
        role="region"
        aria-label="Spatial product gallery"
        tabIndex={0}
        onFocus={() => setPlaying(false)}
        onKeyDown={key}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={finish}
        onLostPointerCapture={() => {
          drag.current = null;
          setDragging(false);
        }}
        data-layout={mode}
        data-running={active}
        data-selected={selected}
      >
        <span className="spatial-watermark" aria-hidden="true">
          PLAY
          <br />
          IN SPACE.
        </span>
        {reduced || !seen ? (
          <div className="spatial-static" role="img" aria-label={artworkNames[selected]}>
            <ArtworkImage index={selected} />
          </div>
        ) : (
          <GallerySpace radius={radius} mode={mode} selected={selected} angle={angle} />
        )}
        {active && <RotateWhileVisible angle={angle} />}
        <span className="spatial-hint">
          {reduced ? "REDUCED MOTION / USE THE CONTROLS" : "DRAG ↔ / ARROW KEYS"}
        </span>
      </div>
      <div className="spatial-controls">
        <div className="spatial-modes" role="group" aria-label="Gallery arrangement">
          {modes.map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                setPlaying(false);
              }}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="spatial-transport">
          <button
            type="button"
            disabled={reduced}
            aria-pressed={playing && !reduced}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing && !reduced ? "Pause rotation" : "Play rotation"}
          </button>
          <button type="button" aria-label="Previous artwork" onClick={() => step(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next artwork" onClick={() => step(1)}>
            →
          </button>
        </div>
      </div>
      <p className="spatial-caption" role="status">
        {String(selected + 1).padStart(2, "0")} / 08 — {artworkNames[selected]}
      </p>
    </section>
  );
}
