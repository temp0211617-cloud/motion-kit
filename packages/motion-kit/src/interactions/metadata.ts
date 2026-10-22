import type { ComponentMetadata } from "../types/component-metadata";
export const interactionMetadata = [
  "MotionButton",
  "MagneticButton",
  "ElasticButton",
  "GlowButton",
  "SpotlightButton",
  "RippleButton",
  "IconMotionButton",
  "ArrowLink",
  "UnderlineLink",
  "HoverShiftLink",
  "MorphingButton",
  "LoadingButton",
].map((name): ComponentMetadata => ({
  name,
  category: "buttons",
  tier: "essential",
  performance: ["GlowButton", "SpotlightButton"].includes(name) ? "medium" : "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
