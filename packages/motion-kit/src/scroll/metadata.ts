import type { ComponentMetadata } from "../types/component-metadata";
export const scrollMetadata = [
  "ScrollProgress",
  "ScrollSectionProgress",
  "Parallax",
  "ParallaxSection",
  "StickyStory",
  "StickyMediaStory",
  "HorizontalScroll",
  "ScrollMaskReveal",
  "ScrollScale",
  "ScrollRotate",
  "ScrollOpacity",
  "ScrollVelocity",
  "PinnedSection",
  "ChapterScroll",
  "ScrollScene",
].map((name): ComponentMetadata => ({
  name,
  category: "scroll",
  tier: name === "StickyStory" ? "premium" : "essential",
  performance: ["ScrollMaskReveal", "StickyStory", "StickyMediaStory"].includes(name)
    ? "medium"
    : "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
