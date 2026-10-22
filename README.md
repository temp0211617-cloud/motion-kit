# Motion Kit

Private React motion library with 153 implemented components across 12 component categories, plus a Next.js documentation/playground app. TypeScript APIs, Motion for React, shared tokens, keyboard alternatives and live reduced-motion support are included. The package has no bundled runtime dependencies, hidden network calls or telemetry.

Current status:private candidate.141 component metadata entries remain building;12 experimental patterns stay experimental. Chromium is the verified baseline. Additional Firefox/WebKit compatibility is pending; see [known issues](docs/known-issues.md). No stable or universal browser-support claim is made.

## Develop

Use Node 24 and pnpm 11.25.0. Versions and lockfile are pinned. On Windows, use `pnpm.cmd` if PowerShell blocks the pnpm script.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm --filter @personal/motion-kit-docs exec playwright install chromium
pnpm dev
```

The docs app runs on port 3000. Browser tests start a production build on loopback port 3100. Set `NEXT_TELEMETRY_DISABLED=1` and `TURBO_TELEMETRY_DISABLED=1` for toolchain commands; in PowerShell:

```powershell
$env:NEXT_TELEMETRY_DISABLED = '1'
$env:TURBO_TELEMETRY_DISABLED = '1'
pnpm.cmd validate:chromium
```

`validate:chromium` runs build, typecheck, lint, units, package/catalog/tree-shaking/security checks, Chromium browser tests, dependency audit at low severity, and formatting. `pnpm validate` runs the full Chromium/Firefox/WebKit matrix; install all three with `pnpm --filter @personal/motion-kit-docs exec playwright install chromium firefox webkit`. Full-matrix checks remain enabled even while additional platform validation is pending. Firefox is not needed to develop or run the Chromium baseline.

## Use

Supported peer baselines: React/React DOM 19.3 and Motion 14.1, bounded to those majors. Use a workspace dependency when working in this monorepo; private tarball installation is described in [the package guide](packages/motion-kit/README.md). Public registry publication is disabled by `private:true`.

Apply optional shared CSS variables from a Next.js server layout:

```tsx
import type { ReactNode } from "react";
import { foundationVariables } from "@personal/motion-kit/tokens";
import { MotionProvider } from "@personal/motion-kit/provider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={foundationVariables}>
      <body>
        <MotionProvider preset="premium">{children}</MotionProvider>
      </body>
    </html>
  );
}
```

Keep event handlers in a client component:

```tsx
"use client";
import { useState } from "react";
import { FadeUp } from "@personal/motion-kit/core";
import { Pressable } from "@personal/motion-kit/gestures";

export function StudyAction() {
  const [marks, setMarks] = useState(0);
  return (
    <FadeUp>
      <Pressable onClick={() => setMarks((value) => value + 1)}>Mark study</Pressable>
      <output aria-live="polite">Marks: {marks}</output>
    </FadeUp>
  );
}
```

The library uses inline styles/shared tokens; Tailwind is only required by the docs app. Keep your application's visible focus styles. Import components from their category entry; the root export contains server-safe tokens, presets and types. Each category has a separate server-safe `/metadata` entry. Prop/item types are exported alongside their components.

| Category             | Count | Subpath after `@personal/motion-kit` | Docs route      |
| -------------------- | ----: | ------------------------------------ | --------------- |
| Core                 |    15 | `/core`                              | `/core`         |
| Text                 |    16 | `/text`                              | `/text`         |
| Buttons/links        |    12 | `/interactions`                      | `/buttons`      |
| Interaction surfaces |    11 | `/gestures`                          | `/gestures`     |
| Cards                |    12 | `/cards`                             | `/cards`        |
| Scroll               |    15 | `/scroll`                            | `/scroll`       |
| Tickers              |    11 | `/ticker`                            | `/ticker`       |
| Carousel/media       |    12 | `/media`                             | `/media`        |
| Editorial            |    12 | `/editorial`                         | `/editorial`    |
| Cinematic            |    15 | `/cinematic`                         | `/cinematic`    |
| Navigation/overlays  |    10 | `/navigation`                        | `/navigation`   |
| Experimental         |    12 | `/experimental`                      | `/experimental` |

The docs routes contain live demos, required/default props, usage examples, input limits and accessibility/performance notes for every catalog component. Foundations are at `/`; long-content audit fixtures are at `/audit`. The [catalog](docs/component-catalog.md) lists all 153 names, checked against built exports.

## Integration contracts

MotionProvider defaults to preset `premium` and reducedMotion `user`; presets are subtle/premium/cinematic/playful/editorial. `useMotionKit` requires the provider. `useMotionPreference` also works outside it, follows live system changes, and returns reduced motion during SSR or when media-query support is unavailable. Explicit application override `never` is available; prefer the default `user` for ordinary use.

Initial/default props initialize uncontrolled state. Controlled tabs use `value`/`onValueChange`; dialogs use `open`/`onOpenChange`. Preserve stable child keys and item IDs. Applications own durable data when content is removed or the selected media subtree is replaced. Read [the API guide](docs/api-guide.md) for focus, semantic wrappers, media, gesture alternatives and lifecycle behavior.

## Verification and status

The latest checkpoints record 99 unit tests and a 260-test Chromium baseline, including delayed-script hydration and native-video playback ownership coverage. All twelve required widths, normal/reduced motion, keyboard/touch behavior, axe and local-only requests are covered. These results describe the checked fixtures, not every possible application composition.

Package checks preserve server/client boundaries, declarations, 153 catalog exports, 20 kB local category budgets and 16 individually bundled consumers. Peer-inclusive bundle costs and signature-component browser profiles are in [the performance audit](docs/performance-audit.md). Security and browser limits are recorded in [security](docs/security-audit.md), [accessibility](docs/accessibility-audit.md), [the browser follow-up](docs/browser-compatibility.md) and [known issues](docs/known-issues.md).

Private candidate `0.9.0-rc.2` is available in `artifacts/`. Run `pnpm check:release` after a successful build to regenerate the archive and verify an isolated installed consumer, including the README examples. The SHA256 and package checks are recorded in `artifacts/release-receipt.json`; see [the candidate report](docs/release-candidate.md) and [phase completion/pending checks](docs/release-plan.md). Phases0–19 are complete for this private scope; unavailable browser/CI verification remains explicitly pending at the user's request. No deployment or public publication occurs as part of development validation. For phase execution, start with [START_HERE.md](START_HERE.md); current state is in `.codex/current-phase.md` and [checkpoints](docs/checkpoints.md).
