"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useMotionValue, useMotionValueEvent, useScroll, type MotionValue } from "motion/react";
import { useElementInView } from "../hooks/useElementInView";
import { useMotionPreference } from "../hooks/useMotionPreference";
export { useWideLayout } from "../hooks/useWideLayout";

function Controller({
  target,
  progress,
}: {
  target: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
}) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => progress.set(value));
  useEffect(() => {
    progress.set(scrollYProgress.get());
    return () => progress.set(0.5);
  }, [progress, scrollYProgress]);
  return null;
}
const SceneContext = createContext<MotionValue<number> | null>(null);
export function useScrollScene() {
  const progress = useContext(SceneContext);
  if (!progress) throw new Error("useScrollScene requires ScrollScene");
  return progress;
}
export function useSceneController() {
  const target = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const inView = useElementInView(target, !reduced);
  const progress = useMotionValue(0.5);
  return { target, inView, progress };
}
export function LazyController({
  target,
  progress,
  enabled,
}: {
  target: RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  enabled: boolean;
}) {
  return enabled ? <Controller target={target} progress={progress} /> : null;
}
export function SceneProvider({
  progress,
  children,
}: {
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  return <SceneContext.Provider value={progress}>{children}</SceneContext.Provider>;
}
