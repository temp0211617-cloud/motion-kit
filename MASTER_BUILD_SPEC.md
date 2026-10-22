# Master Build Spec

This file is the compact authoritative build specification. It complements `AGENTS.md` and the documents under `docs/`.

## Goal

A private, reusable, production-grade React/Next.js motion component package with ~120–150 high-quality components, custom documentation playground, centralized motion/design tokens, strong accessibility/security/performance guarantees, and private versioned distribution.

## Global execution model

Use phases 0–19. Never implement the entire catalog in one context. At phase completion update checkpoint/context files and continue automatically.

## Phase map

0 Repository audit/initialization — high
1 Design & motion foundations — high
2 Core components — medium
3 Text system — medium/high
4 Buttons & micro-interactions — medium
5 Cards/surfaces — medium
6 Scroll engine — high
7 Ticker engine — high
8 Carousel/media — high
9 Editorial system — high
10 Cinematic — high
11 Navigation/overlays — high
12 Experimental — high
13 Security audit — xhigh
14 Responsive/visual audit — high
15 Accessibility audit — high
16 Performance audit — high/xhigh
17 API consistency review — high
18 Documentation completion — medium
19 Release candidate — xhigh

## Phase definition of done

Build + typecheck + lint + relevant tests + responsive + a11y + security + performance checks. Fix failures before moving on.

## Signature components

LiveTicker, DraggableTicker, RulerTicker, RulerScrollIndicator, EditorialSlider, StickyStory, FilmStrip, Curtains.

## Signature requirements summary

### LiveTicker

Seamless true-speed loop, horizontal/vertical, direction, edge fade, pause, drag/momentum, variable sizes, resize handling, reduced-motion and touch support.

### RulerScrollIndicator

Major/minor ticks, progress, active section, labels/numbers, vertical/horizontal, spring indicator, sticky option, clickable accessible chapters, responsive fallback.

### RulerTicker

Ticker + ruler ticks + center/active indicator + drag/velocity + optional snap/endless mode.

### EditorialSlider

Not a generic Swiper. Large media, editorial type, index/total, masked directional transitions, drag/touch/keyboard, progress, optional wheel/autoplay, hover-pause, reduced motion, mobile layout.

### StickyStory

Sticky media + scrolling chapters desktop; stacked mobile. Image/video/custom nodes; progress; reduced motion.

### FilmStrip

Thumbnail rail, timeline ticks, frame numbers, playhead, drag/momentum, optional snap, keyboard/touch, responsive sizing, edge fade.

### Curtains

Horizontal/vertical/split/blinds/iris-like transitions with modest DOM and reduced-motion fallback.

## Documentation page contract

Each stable component: live demo, description, use cases, when not to use, tier, performance, mobile, a11y, reduced motion, props, example, import, preset controls where useful.

## Stable release gate

No critical security issue, major accessibility failure, major responsive breakage, failing required tests, broken exports/tree-shaking, or undocumented public APIs.
