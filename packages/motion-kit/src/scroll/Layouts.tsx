"use client";
import { safeDOMProps } from "../utils/dom-props";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useWideLayout } from "./engine";
import { spacingTokens, layoutTokens } from "../tokens";
import type { ScrollProps } from "./Effects";
import { ScrollSectionProgress } from "./Progress";
export function HorizontalScroll({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const reduced = useMotionPreference();
  if (!label.trim()) throw new Error("HorizontalScroll requires a label");
  return (
    <div
      className={className}
      role="region"
      aria-label={label}
      tabIndex={0}
      style={{
        display: reduced ? "grid" : "flex",
        gridTemplateColumns: "minmax(0,1fr)",
        flexDirection: reduced ? "column" : "row",
        gap: spacingTokens[6],
        overflowX: reduced ? "visible" : "auto",
        maxWidth: "100%",
        scrollSnapType: reduced ? "none" : "x proximity",
        padding: spacingTokens[2],
      }}
    >
      {children}
    </div>
  );
}
export function PinnedSection({ children, style, ...props }: ScrollProps) {
  const wide = useWideLayout();
  const reduced = useMotionPreference();
  const pinned = wide && !reduced;
  return (
    <section style={{ minHeight: pinned ? "160vh" : "auto" }}>
      <div
        {...safeDOMProps(props)}
        style={{ position: pinned ? "sticky" : "static", top: spacingTokens[6], ...style }}
      >
        {children}
      </div>
    </section>
  );
}
export interface StoryChapter {
  id: string;
  title: string;
  body: ReactNode;
  media?: ReactNode;
}
export interface StoryProps {
  chapters: readonly StoryChapter[];
  label: string;
  className?: string;
}
function validateChapters(chapters: readonly StoryChapter[], label: string) {
  if (!label.trim() || !chapters.length) throw new Error("A story requires a label and chapters");
  const ids = new Set<string>();
  for (const chapter of chapters) {
    if (
      !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(chapter.id) ||
      ids.has(chapter.id) ||
      !chapter.title.trim()
    )
      throw new Error("Story chapter IDs must be unique safe identifiers with non-empty titles");
    ids.add(chapter.id);
  }
}
function ChapterList({ chapters, label, className, sticky }: StoryProps & { sticky: boolean }) {
  validateChapters(chapters, label);
  const prefix = useId();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(chapters[0]?.id);
  const reduced = useMotionPreference();
  const wide = useWideLayout();
  const pin = sticky && wide && !reduced;
  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.getAttribute("data-chapter") ?? undefined);
      },
      { rootMargin: "-20% 0px -40% 0px" },
    );
    node.querySelectorAll("[data-chapter]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);
  return (
    <div className={className} ref={root}>
      <nav
        aria-label={label}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: spacingTokens[4],
          marginBlock: spacingTokens[6],
        }}
      >
        {chapters.map((chapter) => (
          <a
            key={chapter.id}
            href={`#${prefix}-${chapter.id}`}
            aria-current={active === chapter.id ? "step" : undefined}
            style={{
              minHeight: layoutTokens.controlSize,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {chapter.title}
          </a>
        ))}
      </nav>
      {chapters.map((chapter) => (
        <section
          key={chapter.id}
          id={`${prefix}-${chapter.id}`}
          data-chapter={chapter.id}
          tabIndex={-1}
          aria-labelledby={`${prefix}-${chapter.id}-title`}
          style={{
            display: "grid",
            gridTemplateColumns:
              pin && chapter.media ? "minmax(0,1fr) minmax(0,1fr)" : "minmax(0,1fr)",
            gap: spacingTokens[8],
            paddingBlock: spacingTokens[8],
            scrollMarginTop: spacingTokens[6],
          }}
        >
          {chapter.media && (
            <div
              style={{
                position: pin ? "sticky" : "static",
                top: spacingTokens[6],
                alignSelf: "start",
                minWidth: 0,
              }}
            >
              {chapter.media}
            </div>
          )}
          <div style={{ minWidth: 0, minHeight: pin ? "80vh" : "auto" }}>
            <h3 id={`${prefix}-${chapter.id}-title`}>{chapter.title}</h3>
            {chapter.body}
          </div>
        </section>
      ))}
    </div>
  );
}
export function StickyStory(props: StoryProps) {
  return (
    <ScrollSectionProgress label={`${props.label} reading progress`}>
      <ChapterList {...props} sticky />
    </ScrollSectionProgress>
  );
}
export function ChapterScroll(props: StoryProps) {
  return <ChapterList {...props} sticky={false} />;
}
export function StickyMediaStory({
  media,
  children,
  className,
}: {
  media: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const wide = useWideLayout();
  const reduced = useMotionPreference();
  const pin = wide && !reduced;
  return (
    <section
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: pin ? "minmax(0,1fr) minmax(0,1fr)" : "minmax(0,1fr)",
        gap: spacingTokens[8],
      }}
    >
      <div
        style={{
          position: pin ? "sticky" : "static",
          top: spacingTokens[6],
          alignSelf: "start",
          minWidth: 0,
        }}
      >
        {media}
      </div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </section>
  );
}
