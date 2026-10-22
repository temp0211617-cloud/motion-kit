# Performance Standard

## Classification

Each component metadata entry: light / medium / heavy.

## Rules

- Prefer transform and opacity.
- Prefer MotionValues for frame-level values.
- Avoid React state updates each animation frame.
- Avoid repeated measure/write loops.
- Clean all observers/listeners/timers.
- Lazy-init heavy/offscreen effects.
- Reduce expensive blur/particles/shadows on constrained/mobile contexts.
- Verify tree shaking and client bundle impact.

## Signature components requiring dedicated profiling

- LiveTicker
- DraggableTicker
- RulerTicker
- DragCarousel
- RulerScrollIndicator
- EditorialSlider
- StickyStory
- FilmStrip
- Curtains
