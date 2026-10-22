"use client";

import { useContext, useSyncExternalStore } from "react";
import { MotionConfigContext } from "motion/react";
import { PreferenceContext } from "./preference-context";

const query = "(prefers-reduced-motion: reduce)";
function subscribe(notify: () => void) {
  const media = window.matchMedia?.(query);
  if (!media) return () => {};
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
function snapshot() {
  return window.matchMedia?.(query).matches ?? true;
}
const serverSnapshot = () => true;

/** SSR uses serverSnapshot; React only reads/subscribes to the browser store on the client. */
export function useMotionPreference(): boolean {
  const preference = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const { reducedMotion } = useContext(MotionConfigContext);
  const override = useContext(PreferenceContext);
  return (
    override === "always" || reducedMotion === "always" || (override !== "never" && preference)
  );
}
