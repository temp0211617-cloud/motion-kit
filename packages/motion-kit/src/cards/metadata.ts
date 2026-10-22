import type { ComponentMetadata } from "../types/component-metadata";
export const cardMetadata = [
  "HoverCard",
  "TiltCard",
  "SpotlightCard",
  "GlowCard",
  "ThreeDCard",
  "ExpandableCard",
  "MorphingCard",
  "HoverRevealCard",
  "ParallaxCard",
  "StackCard",
  "FloatingCard",
  "PerspectiveCard",
].map((name): ComponentMetadata => ({
  name,
  category: "cards",
  tier: "essential",
  performance: ["SpotlightCard", "GlowCard", "ThreeDCard", "ParallaxCard"].includes(name)
    ? "medium"
    : "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
