"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from "motion/react";
export interface EditorialSection {
  id: string;
  label: string;
}
export interface SectionState {
  activeIndex: number;
  activeId: string;
  progress: MotionValue<number>;
}
export function validateSections(sections: readonly EditorialSection[], label: string) {
  if (!label.trim() || !sections.length || sections.length > 120)
    throw new Error("Use a label and 1–120 sections");
  const ids = new Set<string>();
  for (const section of sections) {
    if (
      !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(section.id) ||
      ids.has(section.id) ||
      !section.label.trim()
    )
      throw new Error("Use unique safe section IDs and nonempty labels");
    ids.add(section.id);
  }
}
export function useSectionTracking(
  sections: readonly EditorialSection[],
  label: string,
): SectionState {
  validateSections(sections, label);
  const key = sections.map((section) => section.id).join("|");
  const ids = useMemo(() => key.split("|"), [key]);
  const [activeIndex, setActiveIndex] = useState(0);
  const current = useRef(0),
    positions = useRef<{ index: number; top: number; bottom: number }[]>([]);
  const progress = useMotionValue(0);
  const { scrollY } = useScroll();
  const update = useCallback(
    (value: number) => {
      const entries = positions.current;
      const marker = value + window.innerHeight * 0.3;
      let next = entries[0]?.index ?? 0;
      for (const entry of entries) {
        if (entry.top <= marker) next = entry.index;
        else break;
      }
      if (next !== current.current) {
        current.current = next;
        setActiveIndex(next);
      }
      const start = entries[0]?.top ?? 0,
        end = entries.at(-1)?.bottom ?? start;
      progress.set(end > start ? Math.max(0, Math.min(1, (marker - start) / (end - start))) : 0);
    },
    [progress],
  );
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    const measure = () => {
      positions.current = ids
        .flatMap((id, index) => {
          const node = document.getElementById(id);
          if (!node) return [];
          const rect = node.getBoundingClientRect();
          return [{ index, top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY }];
        })
        .sort((a, b) => a.top - b.top);
      update(window.scrollY);
    };
    measure();
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(document.body);
    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer?.observe(node);
    });
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [ids, update]);
  const active = Math.min(activeIndex, sections.length - 1);
  return { activeIndex: active, activeId: sections[active]?.id ?? "", progress };
}
