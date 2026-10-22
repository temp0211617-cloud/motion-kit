import type { ComponentMetadata } from "../types/component-metadata";
export const editorialMetadata = [
  "RulerScrollIndicator",
  "HorizontalRuler",
  "SectionCounter",
  "SectionTracker",
  "EditorialSlider",
  "NumberedMediaRail",
  "EditorialTimeline",
  "ChapterIndicator",
  "StoryIndex",
  "MeasureScale",
  "StickyChapterNav",
  "ReadingProgressRail",
].map((name): ComponentMetadata => ({
  name,
  category: "editorial",
  tier: ["RulerScrollIndicator", "EditorialSlider"].includes(name) ? "premium" : "essential",
  performance: name === "EditorialSlider" ? "medium" : "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
