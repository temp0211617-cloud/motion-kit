"use client";
import { useSyncExternalStore } from "react";
import { breakpointTokens } from "../tokens/breakpoints";
const query = `(min-width: ${breakpointTokens.lg}px) and (min-height: 600px)`;
function subscribe(notify: () => void) {
  if (!window.matchMedia) return () => {};
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
export function useWideLayout() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(query).matches ?? false,
    () => false,
  );
}
