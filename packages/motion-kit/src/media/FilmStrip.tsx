"use client";
import { controlSize } from "../tokens/layout-base";
import { colorTokens } from "../tokens/colors";
import { useId, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { FilmRail } from "./Rails";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { motionTokens } from "../tokens/motion-base";
import { spacingTokens } from "../tokens/spacing";
export interface FilmFrame {
  id: string;
  label: string;
  thumbnail: ReactNode;
  media: ReactNode;
}
export interface FilmStripProps {
  frames: readonly FilmFrame[];
  label: string;
  className?: string;
  initialIndex?: number;
  snap?: boolean;
  edgeFade?: boolean;
}
export function FilmStrip({
  frames,
  label,
  className,
  initialIndex = 0,
  snap = true,
  edgeFade = false,
}: FilmStripProps) {
  const ids = new Set<string>();
  if (!label.trim() || !frames.length || frames.length > 120)
    throw new Error("FilmStrip requires a label and 1–120 frames");
  for (const frame of frames) {
    if (!frame.id.trim() || ids.has(frame.id) || !frame.label.trim())
      throw new Error("FilmStrip frame IDs and labels must be unique and meaningful");
    ids.add(frame.id);
  }
  const [selected, setSelected] = useState(
    Number.isFinite(initialIndex)
      ? Math.max(0, Math.min(frames.length - 1, Math.floor(initialIndex)))
      : 0,
  );
  const active = Math.min(selected, frames.length - 1);
  const id = useId();
  const preview = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const choose = (index: number) => {
    const next = Math.max(0, Math.min(frames.length - 1, index));
    if (next === active) return;
    preview.current
      ?.querySelectorAll("video,audio")
      .forEach((node) => (node as HTMLMediaElement).pause());
    setSelected(next);
  };
  return (
    <section className={className} aria-label={label}>
      <div ref={preview} id={id} role="region" aria-label={`${label} selected frame`}>
        <motion.div
          key={frames[active]?.id}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0 : motionTokens.duration.default }}
        >
          {frames[active]?.media}
        </motion.div>
      </div>
      <FilmRail label={`${label} thumbnails`} snap={snap} edgeFade={edgeFade}>
        {frames.map((frame, index) => (
          <button
            key={frame.id}
            type="button"
            aria-label={`Select frame ${index + 1}: ${frame.label}`}
            aria-controls={id}
            aria-pressed={active === index}
            onClick={() => choose(index)}
            style={{
              width: "100%",
              minHeight: controlSize,
              border: `1px solid ${active === index ? colorTokens.accent : colorTokens.border}`,
              padding: spacingTokens[2],
              background: colorTokens.surface,
              color: colorTokens.text,
            }}
          >
            {frame.thumbnail}
            <span style={{ display: "block" }}>
              {String(index + 1).padStart(2, "0")} / {frame.label}
            </span>
          </button>
        ))}
      </FilmRail>
      <div
        aria-hidden="true"
        style={{ display: "flex", justifyContent: "space-between", marginTop: spacingTokens[4] }}
      >
        {frames.map((frame, index) => (
          <span
            key={frame.id}
            style={{ borderLeft: `1px solid ${colorTokens.border}`, paddingTop: spacingTokens[2] }}
          >
            {index % 5 === 0 ? index + 1 : "·"}
          </span>
        ))}
      </div>
      <label style={{ display: "grid", gap: spacingTokens[2], marginTop: spacingTokens[3] }}>
        Frame playhead
        <input
          type="range"
          aria-label={`${label} playhead`}
          aria-controls={id}
          min={0}
          max={frames.length - 1}
          step={1}
          value={active}
          aria-valuetext={`Frame ${active + 1}: ${frames[active]?.label}`}
          onChange={(event) => choose(event.currentTarget.valueAsNumber)}
          style={{
            width: "100%",
            minHeight: controlSize,
            accentColor: colorTokens.accent,
          }}
        />
      </label>
      <output aria-live="polite">
        Frame {active + 1} / {frames.length}: {frames[active]?.label}
      </output>
    </section>
  );
}
