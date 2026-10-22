"use client";

import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import { MotionConfig, type ReducedMotionConfig } from "motion/react";
import { motionPresets, type MotionPreset, type MotionPresetName } from "../presets/motion-presets";
import { PreferenceContext } from "../hooks/preference-context";

export interface MotionKitContextValue {
  presetName: MotionPresetName;
  preset: MotionPreset;
}

const MotionKitContext = createContext<MotionKitContextValue | null>(null);

export interface MotionProviderProps extends PropsWithChildren {
  preset?: MotionPresetName;
  reducedMotion?: ReducedMotionConfig;
}

export function MotionProvider({
  children,
  preset = "premium",
  reducedMotion = "user",
}: MotionProviderProps) {
  const value = useMemo(() => ({ presetName: preset, preset: motionPresets[preset] }), [preset]);

  return (
    <MotionKitContext.Provider value={value}>
      <PreferenceContext.Provider value={reducedMotion}>
        <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
      </PreferenceContext.Provider>
    </MotionKitContext.Provider>
  );
}

export function useMotionKit() {
  const value = useContext(MotionKitContext);
  if (!value) {
    throw new Error("useMotionKit must be used within MotionProvider");
  }
  return value;
}
