# Design System Standard

## Visual direction

Premium, restrained, editorial, modern. Cinematic only where the component purpose supports it.
Avoid template-like clutter, gratuitous glow, random gradients, inconsistent radii/shadows, and motion everywhere.

## Typography

Use semantic tokens:

- display-xl/lg/md
- heading-xl/lg/md/sm
- body-lg/md/sm
- label-lg/md/sm
- caption
- code

Use fluid `clamp()` where useful. Body line-height generally 1.5–1.7. Headings tighter. Avoid overly thin body weights.

## Fonts

Prefer one UI sans, optional display face, one monospace. Use optimized loading and fallbacks. Avoid layout shift.

## Alignment

Maintain consistent containers, gutters, baselines, card padding, icon alignment, and vertical rhythm. Misalignment is a failing QA condition.

## Responsive widths to inspect

320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920.

## Tokens

Spacing, radii, shadows, z-index, typography and motion must be centralized.
