"use client";
import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
const noSubscription = () => () => {};
export function useVisibilitySupport() {
  return useSyncExternalStore(
    noSubscription,
    () => typeof IntersectionObserver !== "undefined",
    () => false,
  );
}
/** Optional visibility enhancement: missing observers leave content static and readable. */
export function useElementInView<T extends Element>(target: RefObject<T | null>, enabled = true) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = target.current;
    if (!enabled || !node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries.find((item) => item.target === node);
      if (entry) setVisible(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, enabled]);
  return enabled && visible;
}
