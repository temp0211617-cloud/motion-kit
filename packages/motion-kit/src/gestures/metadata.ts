import type { ComponentMetadata } from "../types/component-metadata";
export const gestureMetadata = [
  "Pressable",
  "HoverScale",
  "HoverLift",
  "HoverMagnet",
  "CursorAttract",
  "TiltSurface",
  "FollowPointer",
  "DragSurface",
  "ElasticDrag",
  "SwipeAction",
  "LongPressMotion",
].map((name): ComponentMetadata => ({
  name,
  category: "interaction",
  tier: "essential",
  performance: name === "ElasticDrag" ? "medium" : "light",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
