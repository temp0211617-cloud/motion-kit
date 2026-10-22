import type { ComponentMetadata } from "../types/component-metadata";

export const textMetadata = [
  "SplitText",
  "WordReveal",
  "CharacterReveal",
  "LineReveal",
  "BlurText",
  "ScrambleText",
  "Typewriter",
  "GradientText",
  "ShimmerText",
  "RollingText",
  "FlipText",
  "MaskedTextReveal",
  "TextTicker",
  "ScrollVelocityText",
  "NumberTicker",
  "AnimatedNumber",
].map((name): ComponentMetadata => ({
  name,
  category: "text",
  tier: "essential",
  performance: ["BlurText", "TextTicker", "ScrollVelocityText"].includes(name) ? "medium" : "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
