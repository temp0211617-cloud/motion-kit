# Integration and API guide

Use category imports and their exported prop/item types. The root entry exports tokens/presets/types; it does not import client component categories. All category metadata entries are server safe. The docs app provides the full per-component reference at the route mapped in the root README.

## Client boundary and preferences

In Next.js, keep event handlers in client components and place MotionProvider around those subtrees. A server layout may render the client provider around server-rendered children. Optional `foundationVariables` can be applied from a server component; package components use their shared inline tokens without requiring Tailwind.

Provider defaults: premium/user. Presets: subtle, premium, cinematic, playful, editorial. `useMotionKit` throws outside a provider. `useMotionPreference` works independently, returns true during SSR/missing query support, subscribes to live OS changes and cleans up. `always` forces static output; `never` is an explicit application override. Reduced motion completes entrances, stops continuous effects and uses natural stacked layouts where appropriate.

## State and composition

Use `children` for application content and stable keys/IDs for collections. Layout, focus and preference changes preserve mounted children. Normal React removal/replacement still unmounts content. FilmStrip replaces selected media when frame selection changes; persist drafts/playback ownership above that boundary when needed.

| API kind                                  | Contract                                                      |
| ----------------------------------------- | ------------------------------------------------------------- |
| `initialIndex`, `initial`, `defaultValue` | Initialize uncontrolled state; later changes do not reset it  |
| Tabs `value`/`onValueChange`              | Application controls selection; callbacks request a new value |
| Dialog `open`/`onOpenChange`              | Application controls visibility and completes close requests  |
| Cinematic/experimental `replayKey`        | Restarts motion while preserving the existing child subtree   |
| `disabled` on a native action             | Blocks activation and feedback                                |
| `disabled` on a decorative surface        | Stops the effect; child controls keep their own semantics     |

Core entrances use block wrappers. Preserve valid HTML around lists, tables, headings and phrasing-only elements; do not insert a div around a table row. Cards provide semantic surfaces, not a replacement for a button/link. Native buttons retain keyboard activation and default to non-submitting type. Raw HTML is excluded at type and runtime boundaries; render React children instead.

Tabs use named items with unique IDs, native buttons, roving keyboard focus and persistent hidden panels. Dynamic reorder/disabled changes preserve keyed drafts and accessible relationships. If the selected item becomes unavailable, an enabled item becomes the visible fallback. Do not switch a mounted control between controlled and uncontrolled modes.

## Focus and overlays

Dialogs/drawers use native dialog support, Escape, Tab trapping, shared scroll locks and opener restoration. Keep the component mounted through controlled animated close. Supply `initialFocusRef` for the desired initial field and `returnFocusRef` when the trigger is not focused on pointer activation or focus restoration needs an explicit target. If that target is removed, application code owns the next meaningful focus destination. Route announcements also belong to the application.

Reading content remains available during SSR and reduced motion. Exiting overlays/content become inert while closing. Keep native visible focus styles when applying your own CSS; scrollable long forms must retain reachable controls.

## Collections and media

Use meaningful labels, unique IDs and safe sources. URLs reject executable schemes, control characters and embedded credentials; new browsing contexts isolate their opener. Image APIs require descriptive alt text and positive dimensions. Custom React media nodes remain application-owned:author captions/transcripts/alternatives and control loading/playback as appropriate.

Rails support native scrolling, Previous/Next and arrows/Home/End. Plain MediaRail and NumberedMediaRail avoid gesture controllers. Carousels add mouse drag/momentum where relevant; touch scrolls natively. InfiniteCarousel wraps navigation without duplicating meaningful slides. FilmStrip's selected frame/playhead is independent of thumbnail viewport position. Comparison layers are inert visuals; place meaningful descriptions/actions outside them. Native video decoding/capture support varies by engine/platform.

VideoHoverPreview owns only the preview it starts from a paused player. Already-playing native/application playback survives hover entry, pointer leave, preview timeout and live reduced-motion changes. Native pointer/keyboard interaction also hands control back to the user. Changing the source or unmounting pauses the removed player.

Ticker speed is measured in pixels per second. Tickers start paused and provide explicit controls; visual copies are inert and bounded. Hidden/offscreen/reduced states stop continuous movement. Custom content size and media loading affect geometry; keep important content usable in the static fallback.

## Optional interactions

Hover/pointer surfaces use local mouse coordinates and keep the native cursor. Keyboard focus flattens content; touch/reduced motion retain static reading/actions. DragSurface and ElasticDrag provide native Left/Right/Reset buttons and arrow/Home controls. They ignore drags initiated on child controls and reset displacement on child focus. Their movement is decorative; do not encode essential data only in its position.

SwipeAction provides an ordinary action button in every mode. Background swipes are optional, preserve vertical touch scrolling and never activate on cancellation. LongPressMotion supports primary-pointer and Space/Enter holds, fires once per hold and offers an ordinary Activate button. Releasing/leaving/cancelling/blurring, document hiding, disabling, changing delay/callback or unmounting cancels the pending hold. Delay 300–2000ms, default 600ms. Applications own confirmation/undo and asynchronous action state.

## Performance and support

Use narrow category imports, avoid unnecessary simultaneous blur/shadow/layer effects, and profile real consumer content. Static metadata records light/medium/heavy cost classes; those are guidance rather than hardware guarantees. Shared tokens constrain displacement, timing, spacing and surfaces. No GSAP/Three/WebGL dependency is required.

Current verification covers Chromium, twelve widths 320–1920, normal/reduced motion, keyboard/touch, enlarged forms and automated axe checks. Firefox launch and WebKit native-media capture issues on the current host remain recorded in accessibility-audit.md. They do not block independent development; full-matrix checks remain enabled and broad stable support is not claimed. See security-audit.md, performance-audit.md and api-audit.md for measured scope and limits.
