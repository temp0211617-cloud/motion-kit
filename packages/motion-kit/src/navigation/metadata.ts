import type { ComponentMetadata } from "../types/component-metadata";
export const navigationMetadata = [
  "FloatingNavbar",
  "AnimatedNavbar",
  "MorphingMenu",
  "DockNavigation",
  "AnimatedTabs",
  "SlidingTabs",
  "AnimatedAccordion",
  "AnimatedDrawer",
  "AnimatedModal",
  "SharedLayoutTabs",
].map((name): ComponentMetadata => ({
  name,
  category: "navigation",
  tier: "essential",
  performance: "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
