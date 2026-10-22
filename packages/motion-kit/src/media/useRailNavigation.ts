"use client";
import {
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export function useRailNavigation(
  items: ReactNode[],
  initialIndex: number,
  reduced: boolean,
  cycle = false,
) {
  const identity = JSON.stringify(items.map((item) => (isValidElement(item) ? item.key : null)));
  const viewportRef = useRef<HTMLDivElement>(null),
    limitsRef = useRef({ max: 0, offsets: [] as number[] }),
    initialized = useRef(false),
    navTargetRef = useRef<number | null>(null);
  const [selected, setSelected] = useState(
      Number.isFinite(initialIndex)
        ? Math.max(0, Math.min(items.length - 1, Math.floor(initialIndex)))
        : 0,
    ),
    [scrollable, setScrollable] = useState(true);
  const active = Math.max(0, Math.min(items.length - 1, selected)),
    selectedRef = useRef(active);
  const measure = useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;
    const slots = [...node.children] as HTMLElement[],
      start = slots[0]?.offsetLeft ?? 0;
    limitsRef.current = {
      max: Math.max(0, node.scrollWidth - node.clientWidth),
      offsets: slots.map((slot) => slot.offsetLeft - start),
    };
    setScrollable(limitsRef.current.max > 1);
  }, []);
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    measure();
    if (!initialized.current) {
      node.scrollLeft = Math.min(
        limitsRef.current.max,
        limitsRef.current.offsets[selectedRef.current] ?? 0,
      );
      initialized.current = true;
    }
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(node);
    [...node.children].forEach((slot) => observer?.observe(slot));
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [identity, measure]);
  useEffect(() => {
    const node = viewportRef.current;
    if (reduced && node) node.scrollTo?.({ left: node.scrollLeft, behavior: "instant" });
  }, [reduced]);
  const go = (index: number) => {
    if (!items.length) return;
    measure();
    const next = cycle
        ? ((index % items.length) + items.length) % items.length
        : Math.max(0, Math.min(items.length - 1, index)),
      left = Math.min(limitsRef.current.max, limitsRef.current.offsets[next] ?? 0),
      node = viewportRef.current;
    navTargetRef.current = left;
    selectedRef.current = next;
    setSelected(next);
    if (node?.scrollTo) node.scrollTo({ left, behavior: reduced ? "instant" : "smooth" });
    else if (node) node.scrollLeft = left;
  };
  const observeScroll = (left: number) => {
    const { offsets, max } = limitsRef.current;
    if (navTargetRef.current !== null) {
      if (Math.abs(left - navTargetRef.current) < 1) navTargetRef.current = null;
      return;
    }
    const next =
      left >= max - 1 && max > 0
        ? offsets.length - 1
        : offsets.reduce(
            (nearest, value, index) =>
              Math.abs(value - left) < Math.abs((offsets[nearest] ?? 0) - left) ? index : nearest,
            0,
          );
    if (selectedRef.current !== next) {
      selectedRef.current = next;
      setSelected(next);
    }
  };
  const keyDown = (event: KeyboardEvent<HTMLElement>, navigate = go) => {
    if (
      event.target !== event.currentTarget ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
    )
      return;
    event.preventDefault();
    navigate(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : active + (event.key === "ArrowLeft" ? -1 : 1),
    );
  };
  return {
    keyDown,
    viewportRef,
    limitsRef,
    active,
    scrollable,
    navTargetRef,
    measure,
    go,
    observeScroll,
  };
}
