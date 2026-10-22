# Performance audit — Phase 16

The performance audit uses production package output and real browser interactions. Chromium is the verified baseline; Firefox/WebKit limitations from the accessibility audit remain open. Those additional targets do not block independent development. Full compatibility checks remain enabled.

## Changes

Plain MediaRail and NumberedMediaRail use native scrolling without loading gesture controllers. Advanced rails retain drag/momentum behavior and share geometry, controls and keyed slide rendering. Selection changes no longer recreate ResizeObservers. Native child keys preserve form state, initial indices clamp, and native keyboard/touch navigation remains available.

Pointer tilt caches geometry during movement, invalidates it on resize/captured scroll and measures once on the next move. Listeners exist only during an active pointer visit and clean up on leave, cancellation, disable, reduction and unmount. Continuous coordinates use MotionValues.

## Consumer bundles

Run `pnpm check:performance` after build. `performance-bundles.json` records sixteen individually bundled public imports. The local column excludes React/Motion peers; the full/gzip columns include them. Full-peer bytes are not the library's incremental cost, and a single consumer's dependency graph differs from an entire category export graph.

Each sampled component has a 12 kB local consumer budget. ReadingProgressRail has an additional 3.5 kB budget and excludes carousel code. `check:package` retains the 20 kB recursive local category graph budget, client directives, server boundaries and declaration checks. No budget was raised or dependency added.

## Runtime profiles

`apps/docs/tests/performance.spec.ts` instruments bounds reads, ResizeObserver construction, requestAnimationFrame callbacks and browser long tasks for LiveTicker, DraggableTicker, RulerTicker, DragCarousel, EditorialSlider, RulerScrollIndicator, StickyStory, FilmStrip and Curtains. It exercises the actual docs controls, records a 450 ms active interval, switches to reduced motion, settles for 300 ms and records another 450 ms. JSON attachments are saved with test results. These are whole-page browser measurements, not React render counts or isolated component CPU costs. Timing depends on the machine; no hardware-specific frame-rate claim is made.

Regression assertions require zero idle reduced-motion bounds reads/new observers and no observer construction when navigating DragCarousel. Existing behavior tests cover true ticker speed, hidden-document frame cancellation, offscreen/reduced cleanup, state persistence, native touch, keyboard controls and finite animations. Source review confirms frame-level coordinates avoid React state; selection/status changes use coarse state updates.

Validation: private candidate0.9.0-rc.2 passes build, typecheck, lint, 99 unit tests, 260 Chromium browser tests, package/performance/security checks, low-severity dependency audit and formatting. All twelve widths and normal/reduced motion remain covered; 320/1440 media captures were inspected. Local category graphs: editorial 18,698 bytes (previously 19,996), media 19,852, provider 2,383, excluding external peers/maps. Media has limited headroom; retain the budget and review import granularity when extending it. Additional-browser compatibility remains pending; see browser-compatibility.md.

Recorded Phase 19 Chromium sample (450 ms active, whole-page measurements):

| Component            | Bounds reads | New ResizeObservers | rAF callbacks | Long tasks |
| -------------------- | -----------: | ------------------: | ------------: | ---------: |
| LiveTicker           |            0 |                   0 |            37 |          0 |
| DraggableTicker      |            0 |                   0 |            41 |          0 |
| RulerTicker          |            0 |                   0 |            41 |          0 |
| DragCarousel         |            0 |                   0 |            15 |          0 |
| EditorialSlider      |            0 |                   0 |            17 |          0 |
| RulerScrollIndicator |            0 |                   0 |            28 |          0 |
| StickyStory          |            0 |                   0 |             2 |          0 |
| FilmStrip            |            0 |                   0 |            17 |          0 |
| Curtains             |            0 |                   0 |            26 |          0 |

All four counters were zero in every settled reduced-motion sample. Multiple callbacks may run in one display frame; callback counts are not FPS. The short sample does not guarantee absence of long tasks under other workloads. Re-run profiles for application-specific content and devices.

Phase 19 adds RulerScrollIndicator as a ninth dedicated runtime profile to reconcile the master signature list with this audit; DragCarousel is retained. All sixteen production consumer imports have bundle checks. The final RulerScrollIndicator sample is included in the table above.
