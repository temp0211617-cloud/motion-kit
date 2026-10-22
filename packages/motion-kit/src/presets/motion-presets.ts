import { motionTokens } from "../tokens/motion-base";

export type MotionPresetName = "subtle" | "premium" | "cinematic" | "playful" | "editorial";

export interface MotionPreset {
  duration: number;
  stagger: number;
  distance: number;
  hoverScale: number;
  spring: keyof typeof motionTokens.spring;
}

export const motionPresets: Record<MotionPresetName, MotionPreset> = {
  subtle: {
    duration: motionTokens.duration.fast,
    stagger: motionTokens.stagger.tight,
    distance: motionTokens.distance.sm,
    hoverScale: 1.01,
    spring: "smooth",
  },
  premium: {
    duration: motionTokens.duration.default,
    stagger: motionTokens.stagger.default,
    distance: motionTokens.distance.md,
    hoverScale: motionTokens.scale.hover,
    spring: "smooth",
  },
  cinematic: {
    duration: motionTokens.duration.relaxed,
    stagger: motionTokens.stagger.relaxed,
    distance: motionTokens.distance.lg,
    hoverScale: 1.015,
    spring: "soft",
  },
  playful: {
    duration: motionTokens.duration.default,
    stagger: motionTokens.stagger.default,
    distance: motionTokens.distance.md,
    hoverScale: 1.04,
    spring: "elastic",
  },
  editorial: {
    duration: 0.42,
    stagger: motionTokens.stagger.default,
    distance: motionTokens.distance.md,
    hoverScale: 1.01,
    spring: "heavy",
  },
};
