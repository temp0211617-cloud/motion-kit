import { mediaLayoutTokens, controlSize, gridMin } from "./layout-base";
export { colorTokens } from "./colors";

export const layoutTokens = {
  media: mediaLayoutTokens,
  container: { reading: "48rem", content: "70rem", wide: "90rem" },
  gutter: "clamp(1rem, 4vw, 2rem)",
  gridMin,
  controlSize,
} as const;
