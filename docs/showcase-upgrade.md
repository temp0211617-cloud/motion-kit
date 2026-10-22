# Showcase and navigation upgrade

User-requested extension after the original phases 0–19: improve the visible frontend, expose the full collection, add advanced examples, and keep every category reachable after navigation.

## Experience

- Shared navigation lives in the root layout, with all twelve categories, Overview, and Playground. The active route is marked with `aria-current="page"`. Category breadcrumbs are separate named navigation landmarks.
- The homepage includes an interactive shared-layout card composition, a twelve-collection visual catalog, component search, category filters, all 153 component names, and the existing preset/reduced-motion preview.
- `/playground` contains six new example compositions: shared layout, spring field, perspective deck, layout morph, SVG drawing, and a scroll-linked sculpture. These are examples, not six additional public package APIs. The package catalog remains 153.
- Every study has native button or range controls. Pointer following uses MotionValues and bounded geometry; touch users have direction buttons. Reduced motion removes layout projection, makes drawing/deck changes immediate, and unmounts spring-following animation. Only the selected study mounts.
- No external images, fonts, requests, dependencies, package APIs, or package budgets were added. Geometric artwork uses local CSS/SVG. Visual direction was informed by the interaction-first presentation at [Motion](https://motion.dev/); no source or branded artwork was copied.

## Validation

Logs are stored locally in `artifacts/showcase-*.log`. Production build uses Next.js Webpack after a Turbopack worker connection failure on this Windows environment; application security and validation assertions remain enabled. Browser coverage includes navigation persistence, catalog counts/filtering, all six controls, live reduction, axe, and all twelve required widths. Final outcome is recorded in `checkpoints.md`.

The private `0.9.0-rc.2` package archive is unchanged. This extension changes the docs frontend. Additional Firefox/WebKit compatibility remains a separately deferred item; no new compatibility or stable-release claim is implied. The new frontend is local until explicitly synchronized to GitHub.
