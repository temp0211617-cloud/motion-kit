import type { ComponentMetadata } from "../types/component-metadata";
export const tickerMetadata = [
  "LiveTicker",
  "DraggableTicker",
  "VerticalTicker",
  "DualTicker",
  "LogoTicker",
  "ImageTicker",
  "VelocityTicker",
  "HoverPauseTicker",
  "NewsTicker",
  "EdgeFadeTicker",
  "RulerTicker",
].map((name): ComponentMetadata => ({
  name,
  category: "ticker",
  tier: ["LiveTicker", "DraggableTicker", "RulerTicker"].includes(name) ? "premium" : "essential",
  performance: "medium",
  status: "building",
  mobileSafe: true,
  reducedMotion: true,
  keyboardAccessible: true,
}));
