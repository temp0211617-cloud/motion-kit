# Post-candidate browser verification

Historical verification for0.9.0-rc.1. The current0.9.0-rc.2 release and completed phase map are recorded in release-candidate.md and release-plan.md. The original archive remains available; its frozen receipt is `.codex/releases/0.9.0-rc.1-receipt.json`. Unavailable browser checks were explicitly deferred by the user on2026-10-16; this report is retained as evidence, not a request to repeat host repairs.

Date: 2026-10-16. Scope: additional WebKit verification and docs-demo hydration correctness for private candidate 0.9.0-rc.1. The candidate's original complete baseline was 258 Chromium browser checks and 97 unit tests. The packaged library runtime and archive integrity are unchanged.

## Findings and corrections

The initial WebKit diagnostic run passed 253 of 256 checks. The two previously reproduced native-video screenshot hangs were excluded by the command for this diagnostic run only. All three browser projects and both capture cases remain enabled in the full validation command and CI configuration.

Three test assumptions failed in the initial run:

- Spotlight coordinates used an exact CSS string comparison. WebKit delivered a rounded pointer coordinate relative to fractional layout bounds: the expected 30px position became 29.703125px. The test now parses both coordinates and requires each to be within less than 1px of its target, before and after geometry invalidation. Missing gradients still fail; live reduction still hides the decoration.
- Curtains replay was sampled through repeated browser protocol calls after activation. The failure trace visibly contained a replay frame while the later transform samples reported the completed state. The test now starts browser-side animation-frame observation before native activation. It still requires a real nonzero panel scale, immediate focus completion, persistent draft content and a static reduced-motion replay. The live-reduction test settles the initial reveal before observing a new replay.
- The ticker loop test stopped after 260 callbacks, assuming a particular frame rate. It now observes a visible rail until an actual wrap, with a deadline derived from measured copy width and the requested 240px/s speed plus a 2s allowance. Both actual wrap and viewport coverage remain required. The test does not change the ticker clock, speed or runtime implementation.

The four affected tests (two Curtains cases, spotlight and loop boundary) passed three repetitions in both Chromium and WebKit: 24/24. Docs typecheck, lint and authored-source security checks also passed after these test changes.

The next full diagnostic run passed 255/256, revealing another setup race in the ticker check. A repeated instrumented run reproduced it: over 5.297s the position moved from -27.48px to -242.32px, about 40.6px/s, matching the demo's default 40px/s rather than the requested 240px/s. The test had filled a server-rendered controlled input before hydration. It now waits for the client Play control to become enabled before filling speed. Ten repetitions per browser then passed 20/20. Failure diagnostics retain measured width, elapsed time, position range, sample count, visibility and bounds; no retry or weakened wrap assertion was added.

That race also exposed an actual docs UX gap: an early visitor could edit the speed field before it was functional. Ticker speed and reduction inputs now stay disabled until hydration completes. A shared docs hook preserves MediaDemo's existing readiness behavior and provides the same conservative SSR snapshot for TickerDemo. A new browser regression holds local client JavaScript requests, verifies the disabled SSR controls, releases scripts and verifies editing and reduction work after hydration. It changes no package API, dependency or animation implementation.

A further full run passed the corrected ticker check but recorded one mobile WebKit link tap that did not activate after editing a focused field (255/256). The trace had no hash navigation; a package-runtime cause was not established. Diagnostic repetitions passed 20/20. The final touch test explicitly verifies the entered draft and focus before its single native tap, then requires both hash navigation and the reference heading in view. That final test passed another 20/20 repetitions across Chromium and WebKit. It does not retry taps or scroll to the destination through script. The isolated failure remains recorded as a reliability observation rather than a claimed runtime fix.

## Verification evidence

The final six-worker diagnostic run passed 255/256, again failing the single native mobile link tap. The stronger URL assertion confirms this is activation, rather than merely a destination viewport assertion. The isolated diagnostic and final-test repetitions passed 20/20 each. A one-worker run of the same 256 checks then passed 256/256 in 10.1 minutes, including native touch activation. This comparison shows concurrency sensitivity on this host; it does not establish a package-runtime cause or resolve the six-worker result. No browser assertion was disabled or retried for that comparison.

The full serial pass used the build before the docs hydration guard. The new production build then passed:

- Full `pnpm validate:chromium`: build, typecheck, lint, 97 unit tests, 259 Chromium browser checks, package/catalog/security/performance checks, dependency audit (zero known vulnerabilities) and formatting.
- Delayed-script regression: 6/6 repetitions across Chromium and WebKit.
- All affected WebKit media/ticker/hydration checks: 39/39 with one worker, excluding only the same two native-video capture cases. This incrementally verifies the docs UI changes after the full 256-check serial baseline.

All twelve required widths and normal/reduced motion remain covered by the full Chromium gate. Updated ticker captures at 320px and 1440px were visually inspected. All nine settled reduced-motion Chromium runtime profiles recorded zero bounds reads, new observers, frame callbacks and long tasks; these are short whole-page samples, not FPS or isolated CPU measurements. Package graph/consumer budgets are unchanged. The archive SHA256 still matches its existing receipt.

Reproduce the scoped full WebKit baseline with `pnpm --filter @personal/motion-kit-docs test:e2e --project=webkit --workers=1 --grep-invert "media fits (320|1440)px"`. This diagnostic command does not replace `pnpm validate`, which retains all browser projects and capture checks.

Final logs: `.codex/webkit-serial-verification.log` (256-check serial baseline), `.codex/hydration-build.log`, `.codex/hydration-regression.log` (6 repeated checks), `.codex/post-rc-validation.log` (full Chromium gate), `.codex/post-rc-webkit.log` (39 affected WebKit checks). Failure traces, representative mobile/desktop captures and runtime profile JSON files from both engines are retained under `.codex/compatibility/2026-10-16`.

Investigation history: `.codex/webkit-continuation.log`, `.codex/compatibility-targeted.log`, `.codex/webkit-verification.log`, `.codex/ticker-loop-diagnostic.log`, `.codex/ticker-loop-verification.log`, `.codex/webkit-final-verification.log`, `.codex/cinematic-touch-diagnostic.log`, `.codex/cinematic-touch-verification.log` and `.codex/webkit-checkpoint.log` preserve the failures and repeated comparisons described above.

## Remaining environment limits

Firefox fails before opening a page on this Windows host with the previously investigated mozglue side-by-side activation error. WebKit hangs when capturing a same-origin native video, including the recorded plain HTML reproduction without React, Motion or application CSS. The existing media capture cases at 320px and 1440px remain required by full validation.

The Firefox launch failure, native-video capture hang and concurrent native-touch inconsistency prevent a successful full three-engine gate on this host. They do not invalidate the private Chromium baseline or the additional individual checks recorded here. A working validation environment is still required before advertising complete Firefox/WebKit compatibility. No external runner was dispatched, repository uploaded, release published or building/experimental metadata promoted.
