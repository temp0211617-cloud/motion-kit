# Private release candidate — 0.9.0-rc.2

Date:2026-10-16. All153 components across12 categories and the agreed phases0–19 are complete for the private Chromium-scoped candidate. Metadata remains141building/12experimental; package private:true/UNLICENSED. See release-plan.md for the phase completion matrix and explicitly deferred verification.

## Resulting behavior

VideoHoverPreview now starts its optional hover preview only from a paused player. Previously, hovering over already-playing native/application video could claim ownership and pause that playback on pointer leave or preview timeout. Existing playback now remains under user control through hover/leave/live reduction; normal owned previews still stop correctly. Source changes/unmount retain cleanup. No public API or dependency change.

Two unit regressions cover existing-playback preservation and normal preview cleanup. A native-video browser regression covers already-playing video, pointer leave and live reduction. The failing regression was observed before the fix. The original rc.1 archive is retained; its receipt is frozen at .codex/releases/0.9.0-rc.1-receipt.json. Browser-compatibility.md records that earlier candidate's additional-engine investigation.

## Verification

- Full pnpm validate:chromium PASS: production build, typecheck, lint,99 unit tests,260 Chromium browser checks,153-name catalog/exports, package/client-server boundaries, performance/security checks, dependency audit (zero known vulnerabilities) and formatting.
- All12 required widths320–1920, normal/reduced motion, keyboard/touch, axe, forms/dialogs, state persistence and native media fixtures pass. Existing delayed-JavaScript hydration protection remains verified.
- Nine settled reduced-motion runtime profiles recorded zero bounds reads/new observers/frame callbacks/long tasks. These short whole-page samples are not FPS or isolated component CPU measures. Sixteen consumer budgets remain intact; local category graphs:media19,852/editorial18,698/gestures14,213 bytes, all below20k excluding peers/maps. Installed Pressable consumer:3,670 local bytes.
- pnpm check:release PASS against the actual tarball: archive allowlist/declarations, root/package README TSX examples, negative types, offline isolated strict-peer installation with scripts disabled, React server conditions, client SSR and installed-consumer tree shaking. Fixture:.codex/consumers/rc-X3PsbT.

Artifact:artifacts/personal-motion-kit-0.9.0-rc.2.tgz;138files,146,676bytes. SHA256:088826c4e7c02532d8c4bbf619865580be9bab8c94ace5aebf25c2de520c2835. Receipt:artifacts/release-receipt.json. Both rc.1 preservation and rc.2 integrity were independently checked.

Logs:.codex/phase19-rc2-validation.log and .codex/phase19-rc2-release.log. Current runtime profile evidence:.codex/releases/0.9.0-rc.2-runtime-profiles.json.

## Pending at the user's request

Firefox Windows mozglue launch, WebKit native-video captures at320/1440, concurrent WebKit mobile touch activation and the full CI three-engine run remain pending. No further host-repair attempts were made for this closure. All browser projects and capture assertions remain enabled; this release makes no broader stable/browser-support claim. The prior rc.1 serial/targeted WebKit evidence does not certify rc.2's complete matrix.

The read-only CI workflow is configured with pinned actions, disabled persisted credentials/install scripts and all engines, but has not executed from this workspace. No repository was uploaded, workflow dispatched or public release published. Stable promotion/publication is separate from completing the agreed private candidate.
