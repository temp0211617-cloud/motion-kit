import type { ComponentMetadata } from "../types/component-metadata";
export const cinematicMetadata = [
  "HeroParallax",
  "PerspectiveHero",
  "FloatingHeroObjects",
  "SpotlightHero",
  "MaskReveal",
  "ImageMaskReveal",
  "Curtains",
  "IrisReveal",
  "WipeReveal",
  "SplitScreenReveal",
  "LayeredParallax",
  "CinematicGallery",
  "ZoomScene",
  "DepthSection",
  "PerspectiveScroller",
].map((name): ComponentMetadata => ({
  name,
  category: "cinematic",
  tier: "premium",
  performance: [
    "Curtains",
    "MaskReveal",
    "ImageMaskReveal",
    "IrisReveal",
    "WipeReveal",
    "SplitScreenReveal",
  ].includes(name)
    ? "light"
    : "medium",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
