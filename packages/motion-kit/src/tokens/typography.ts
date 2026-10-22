import { headingLargeSize } from "./heading";
export const typographyTokens = {
  font: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'ui-monospace, "Cascadia Code", "Segoe UI Mono", monospace',
  },
  size: {
    "display-xl": "clamp(3.5rem, 8vw, 8rem)",
    "display-lg": "clamp(3rem, 6vw, 6rem)",
    "display-md": "clamp(2.5rem, 5vw, 4.5rem)",
    "heading-xl": "clamp(2.25rem, 4vw, 3.75rem)",
    "heading-lg": headingLargeSize,
    "heading-md": "clamp(1.5rem, 2.4vw, 2.25rem)",
    "heading-sm": "clamp(1.25rem, 2vw, 1.75rem)",
    "body-lg": "1.125rem",
    "body-md": "1rem",
    "body-sm": "0.875rem",
    "label-lg": "0.9375rem",
    "label-md": "0.8125rem",
    "label-sm": "0.75rem",
    caption: "0.75rem",
    code: "0.875rem",
  },
  lineHeight: {
    display: 0.95,
    heading: 1.08,
    body: 1.6,
    compact: 1.25,
  },
} as const;
