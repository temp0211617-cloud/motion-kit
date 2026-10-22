export type ComponentTier = "essential" | "premium" | "experimental";
export type PerformanceClass = "light" | "medium" | "heavy";
export type ComponentStatus = "planned" | "building" | "stable" | "experimental";

export interface ComponentMetadata {
  name: string;
  category: string;
  tier: ComponentTier;
  performance: PerformanceClass;
  status: ComponentStatus;
  mobileSafe: boolean;
  reducedMotion: boolean;
  keyboardAccessible: boolean;
  description?: string;
}
