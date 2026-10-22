# Accessibility audit — Phase 15

Initial audit: 2026-10-15. Current status: PASS for the Chromium baseline, as recorded in the Phase 15 scope correction and Phase 19 checkpoint. Additional browser compatibility remains incomplete. The historical Firefox launch and WebKit native-media capture findings below do not block independent phases.

Findings fixed:

- System reduced motion now applies when a component is used without MotionProvider. Conservative server rendering and explicit provider overrides remain supported; live preference subscriptions clean up on unmount. Browsers without media queries remain static.
- Dialog Escape stays within the nearest dialog, including composition inside native disclosure menus. `initialFocusRef` selects an initial form control. `returnFocusRef` identifies an opener when activation does not focus it, as happens with Safari mouse clicks. Focused controls scroll into view immediately in enlarged-text and short-viewport forms.
- The docs skip-link has explicit keyboard focusability. Media captions use the shared text foreground on their dark panels, avoiding WebKit's black inherited caption rendering. Media interaction checks wait for hydration; layout checks wait for the authored foreground.
- Ticker distance uses elapsed time across delayed frames, preserving its requested pixel speed. Hidden documents cancel the frame loop; returning resets the clock and resumes without catching up hidden time. Offscreen, paused and reduced-motion cleanup remains intact.

Coverage includes native keyboard controls, disabled tabs, persistent form values, modal trapping/Escape/restoration/nesting/native form close/unmount cleanup, live reduction, touch fallbacks, escaped SSR, missing observer/media-query fallbacks and automated axe checks. Long forms are exercised with 200% text and a 640×400 viewport, in addition to the twelve required widths.

Browser matrix configuration includes Chromium, Firefox and WebKit. Firefox mobile viewport emulation is unsupported, so touch contexts retain touch input without requesting that viewport mode. Native touch-pan injection uses Chromium CDP; the other engines retain touch activation and keyboard movement checks. Video playback checks query actual codec support; no successful playback claim is inferred from browser name. Playwright documents [platform differences in media support](https://playwright.dev/docs/browsers).

Firefox environment evidence:

- Playwright 1.64.0 Firefox 157 (revision1555) fails before opening any page with `browserType.launch: spawn UNKNOWN`.
- Launching the executable directly reports an incorrect side-by-side configuration. Windows Application/SideBySide events identify the unresolved `mozglue` assembly.
- A forced clean reinstall, an older Firefox155/revision1543 installed through an isolated Playwright1.63 tool, dependency inspection and reversible manifest checks did not restore launch. Temporary manifests were removed. Repository dependency pins and security settings were preserved.
- This process is not elevated. An alternative validation machine/runner or a repaired host is required to verify Firefox coverage. The Firefox project remains enabled.

WebKit capture evidence:

- Media caption axe checks now pass at320/1440. The targeted native touch film-selection check passes after waiting for hydration. All228 Chromium checks pass, including media screenshots at320/1440; those captures were visually inspected.
- WebKit still times out capturing the media page. A diagnostic playback preparation did not resolve it and was removed; capture checks remain enabled.
- A plain HTML page served at the same local origin, containing only a native video with `preload="none"`, reproduces the screenshot timeout with and without a caption track. The document remains interactive. A plain control page captures successfully. The reproduction has no React, Motion or application CSS. Removing perspective, masks or media elements from the already affected application page did not restore capture.
- Minimal fixture: `<video controls muted preload="none" src="/media-preview.webm" poster="/ticker-frame.svg" width="300" height="180"></video>`. The probe navigates with `waitUntil: "domcontentloaded"`, then requests a screenshot. This isolates the current failure to the browser/host native-media path; comparison on another host is still required.

Validation at the initial checkpoint: build/types/lint,84 unit tests,228 Chromium browser checks, package/security checks, low-severity dependency audit and formatting passed. The last complete two-engine run then passed453 of456 checks before the final caption/readiness fixes; subsequent targeted checks verified those fixes, while the two WebKit screenshot cases remained blocked. No browser project or required check was removed. Later Chromium-scoped PASS results supersede that initial blocked phase status; see checkpoints15–19.

Run on a working browser host with `pnpm install --frozen-lockfile`, `pnpm --filter @personal/motion-kit-docs exec playwright install chromium firefox webkit`, and `pnpm validate`, with Next/Turbo telemetry disabled. All advertised browser projects must pass before claiming broader verified compatibility. Independent phases16–19 have already completed for the private Chromium candidate.

## Execution scope correction

Firefox was an additional agent-selected audit target, not an explicit requirement in AGENTS.md. Its environment failure does not block independent performance/API/docs work. Phase16 work continues using the verified Chromium baseline. The compatibility gaps remain open; the full matrix and security/accessibility checks are retained. No broad Firefox/WebKit support or stable release claim follows from the Chromium result alone.
