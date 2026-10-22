"use client";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValueEvent, useSpring, useScroll } from "motion/react";
import { useSectionTracking, type EditorialSection, type SectionState } from "./tracking";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { spacingTokens } from "../tokens/spacing";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { motionTokens } from "../tokens/motion-base";
import { radiusTokens } from "../tokens/radius";
import { useWideLayout } from "../hooks/useWideLayout";
import { ordinal } from "./ordinal";
export interface EditorialNavigationProps {
  sections: readonly EditorialSection[];
  label: string;
  className?: string;
}
function Links({
  sections,
  active,
  label,
  vertical = false,
}: {
  sections: readonly EditorialSection[];
  active: number;
  label: string;
  vertical?: boolean;
}) {
  return (
    <nav aria-label={label}>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          flexWrap: "wrap",
          gap: spacingTokens[3],
        }}
      >
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === index ? "location" : undefined}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: layoutTokens.controlSize,
                paddingInline: spacingTokens[3],
                color: active === index ? colorTokens.accent : "inherit",
                textDecoration: active === index ? "underline" : "none",
                textUnderlineOffset: spacingTokens[1],
              }}
            >
              <span aria-hidden="true">{ordinal(index + 1)} /&nbsp;</span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function RulerScrollIndicator({
  sections,
  label,
  className,
  axis = "vertical",
  sticky = false,
}: EditorialNavigationProps & { axis?: "vertical" | "horizontal"; sticky?: boolean }) {
  const state = useSectionTracking(sections, label);
  const reduced = useMotionPreference();
  const wide = useWideLayout();
  const vertical = axis === "vertical" && wide;
  const smooth = useSpring(state.progress, motionTokens.spring.soft);
  const meter = useRef<HTMLDivElement>(null);
  useMotionValueEvent(state.progress, "change", (value) =>
    meter.current?.setAttribute("aria-valuenow", String(Math.round(value * 100))),
  );
  return (
    <div
      className={className}
      style={{
        position: sticky && wide ? "sticky" : "static",
        top: spacingTokens[6],
        minWidth: 0,
        display: vertical ? "flex" : "block",
        gap: spacingTokens[4],
      }}
    >
      <div
        ref={meter}
        role="progressbar"
        aria-label={`${label} reading progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        style={{
          position: "relative",
          height: vertical ? "24rem" : spacingTokens[3],
          width: vertical ? spacingTokens[3] : "100%",
          flexShrink: 0,
          background: colorTokens.border,
          borderRadius: radiusTokens.pill,
          overflow: "hidden",
          marginBottom: spacingTokens[4],
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: colorTokens.accent,
            scaleX: vertical ? 1 : reduced ? state.progress : smooth,
            scaleY: vertical ? (reduced ? state.progress : smooth) : 1,
            transformOrigin: "top left",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          {Array.from({ length: Math.min(120, sections.length * 5) }, (_, index) => (
            <span
              key={index}
              style={{
                height: vertical ? "auto" : index % 5 === 0 ? "100%" : "50%",
                width: vertical ? (index % 5 === 0 ? "100%" : "50%") : "auto",
                borderLeft: vertical ? "none" : `1px solid ${colorTokens.background}`,
                borderTop: vertical ? `1px solid ${colorTokens.background}` : "none",
              }}
            />
          ))}
        </span>
      </div>
      <Links sections={sections} active={state.activeIndex} label={label} vertical={vertical} />
    </div>
  );
}
export function HorizontalRuler(props: EditorialNavigationProps) {
  return <RulerScrollIndicator {...props} axis="horizontal" />;
}
export function StoryIndex({ sections, label, className }: EditorialNavigationProps) {
  const state = useSectionTracking(sections, label);
  return (
    <div className={className}>
      <Links sections={sections} label={label} active={state.activeIndex} vertical />
    </div>
  );
}
export function StickyChapterNav({ sections, label, className }: EditorialNavigationProps) {
  const wide = useWideLayout();
  return (
    <div
      style={{
        position: wide ? "sticky" : "static",
        top: spacingTokens[6],
        background: colorTokens.background,
      }}
    >
      <StoryIndex sections={sections} label={label} {...(className ? { className } : {})} />
    </div>
  );
}
export function SectionCounter({ sections, label, className }: EditorialNavigationProps) {
  const state = useSectionTracking(sections, label);
  return (
    <output
      className={className}
      aria-label={label}
      aria-live="off"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {ordinal(state.activeIndex + 1)} / {ordinal(sections.length)}
    </output>
  );
}
export function ChapterIndicator({ sections, label, className }: EditorialNavigationProps) {
  const state = useSectionTracking(sections, label);
  return (
    <p className={className}>
      <span aria-hidden="true" style={{ color: colorTokens.accent }}>
        ●{" "}
      </span>
      {label}: {sections[state.activeIndex]?.label}
    </p>
  );
}
export function SectionTracker({
  sections,
  label,
  children,
}: Omit<EditorialNavigationProps, "className"> & { children: (state: SectionState) => ReactNode }) {
  const state = useSectionTracking(sections, label);
  return <>{children(state)}</>;
}
export function ReadingProgressRail({ label, className }: { label: string; className?: string }) {
  const { scrollYProgress } = useScroll();
  const ref = useRef<HTMLDivElement>(null),
    output = useRef<HTMLOutputElement>(null);
  if (!label.trim()) throw new Error("Use a reading progress label");
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const percent = Math.round(value * 100);
    ref.current?.setAttribute("aria-valuenow", String(percent));
    if (output.current) output.current.textContent = `${percent}%`;
  });
  return (
    <div className={className}>
      <div
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        style={{ height: spacingTokens[1], background: colorTokens.border }}
      >
        <motion.div
          style={{
            height: "100%",
            background: colorTokens.accent,
            scaleX: scrollYProgress,
            transformOrigin: "left",
          }}
        />
      </div>
      <output ref={output} aria-live="off">
        0%
      </output>
    </div>
  );
}
