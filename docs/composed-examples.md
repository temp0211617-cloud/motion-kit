# Composed interaction examples

The `/examples` route adds four live docs compositions to the existing 153-component package. It is not a new package export count or a claim of Motion+ feature parity. AI integrations and a visual Studio are outside this extension, following the user's explicit UI/examples-first choice.

- Cursor trail: pointer-driven MotionValues and spring-following artwork stack, with native artwork navigation and static touch/reduced-motion presentation.
- Live ticker: two opposite-direction `LiveTicker` rails, original local artwork, independent pause controls, drag and keyboard browsing, visibility suspension and reduced-motion wrapping.
- Page transitions: a three-screen analytics dashboard with keyed entrance/exit, a shared navigation indicator, persistent control focus and accessible metric announcements.
- Gallery grid: bounded drag, tilted contact sheet, eight original artworks, native direction/reset controls, and click-to-inspect modal with Escape, focus restoration and scroll locking. Reduced motion removes tilt/drag and retains all artwork buttons.

The 16-link persistent navigation includes Examples on every route. Expandable explanations accompany all four compositions. The original locally generated gallery atlas is reused; no remote image requests, new artwork generation, dependency, package API or budget change. Artwork provenance remains in `signature-showcase.md`.

Scene colours and dimensions are intentionally specific to each art-directed composition; typography, spacing, surfaces, control sizes and radii use the shared foundation where applicable. Continuous pointer and drag positions use MotionValues rather than React state.

Verification evidence is recorded in `artifacts/examples-validation.log` and `artifacts/examples-final.log`. Browser coverage includes all twelve required widths, normal/reduced motion axe scans, native controls, modal focus/Escape, mouse movement, drag suppression and mobile touch. Earlier Firefox/WebKit host limitations remain deferred. Changes are local and have not been synchronized to GitHub.
