import { spacingTokens } from "./spacing";
import { typographyTokens } from "./typography";
import { radiusTokens } from "./radius";
import { shadowTokens } from "./shadows";
import { zIndexTokens } from "./z-index";
import { colorTokens, layoutTokens } from "./layout";

/** Static React style variables; no DOM access or style injection. */
export const foundationVariables: Record<`--mk-${string}`, string | number> = {
  ...Object.fromEntries(
    Object.entries(spacingTokens).map(([key, value]) => [`--mk-space-${key}`, value]),
  ),
  ...Object.fromEntries(
    Object.entries(typographyTokens.size).map(([key, value]) => [`--mk-type-${key}`, value]),
  ),
  ...Object.fromEntries(
    Object.entries(typographyTokens.lineHeight).map(([key, value]) => [
      `--mk-leading-${key}`,
      value,
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(radiusTokens).map(([key, value]) => [`--mk-radius-${key}`, value]),
  ),
  ...Object.fromEntries(
    Object.entries(shadowTokens).map(([key, value]) => [`--mk-shadow-${key}`, value]),
  ),
  ...Object.fromEntries(
    Object.entries(zIndexTokens).map(([key, value]) => [`--mk-z-${key}`, value]),
  ),
  ...Object.fromEntries(
    Object.entries(colorTokens).map(([key, value]) => [`--mk-color-${key}`, value]),
  ),
  ...Object.fromEntries(
    Object.entries(layoutTokens.container).map(([key, value]) => [`--mk-container-${key}`, value]),
  ),
  "--mk-gutter": layoutTokens.gutter,
  "--mk-grid-min": layoutTokens.gridMin,
  "--mk-control-size": layoutTokens.controlSize,
  "--mk-font-sans": typographyTokens.font.sans,
  "--mk-font-mono": typographyTokens.font.mono,
};
