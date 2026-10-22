import type { ComponentMetadata } from "../types/component-metadata";
export const mediaMetadata = [
  "DragCarousel",
  "MomentumCarousel",
  "InfiniteCarousel",
  "SnapCarousel",
  "FilmStrip",
  "MediaRail",
  "HoverMediaPreview",
  "ImageReveal",
  "ImageTilt",
  "BeforeAfterSlider",
  "VideoHoverPreview",
  "AnimatedGallery",
].map((name): ComponentMetadata => ({
  name,
  category: "media",
  tier: name === "FilmStrip" ? "premium" : "essential",
  performance: "medium",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
