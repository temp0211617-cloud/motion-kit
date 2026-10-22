import type { ComponentMetadata } from "../types/component-metadata";

export const coreMetadata = [
  "FadeIn",
  "FadeUp",
  "FadeDown",
  "FadeLeft",
  "FadeRight",
  "ScaleIn",
  "ScaleFade",
  "SlideIn",
  "Reveal",
  "ScrollReveal",
  "Stagger",
  "StaggerItem",
  "MotionGroup",
  "Presence",
  "PageTransition",
].map((name): ComponentMetadata => ({
  name,
  category: "core",
  tier: "essential",
  performance: "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
  description:
    "Composable core motion primitive with provider presets and a reduced-motion fallback.",
}));
