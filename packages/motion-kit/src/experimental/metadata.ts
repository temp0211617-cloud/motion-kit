import type { ComponentMetadata } from "../types/component-metadata";
export const experimentalMetadata = [
  "CursorFollower",
  "CursorTrail",
  "CursorSpotlight",
  "ImageTrail",
  "AuroraBackground",
  "AnimatedGrid",
  "ParticleField",
  "NoiseField",
  "MeshGradient",
  "DistortionHover",
  "LiquidReveal",
  "PhysicsFollower",
].map((name): ComponentMetadata => ({
  name,
  category: "experimental",
  tier: "experimental",
  performance: ["NoiseField", "CursorTrail", "ImageTrail"].includes(name) ? "medium" : "light",
  status: "experimental",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
