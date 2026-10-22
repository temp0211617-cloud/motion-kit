# Security Audit — Phase 13

Date: 2026-10-14. Scope: authored runtime/source, docs/assets/fixtures, manifests, lock/install settings, package boundaries and browser behavior.

## Findings fixed

- Core Reveal/PageTransition inherited the raw-HTML prop. Their types now exclude it, and all15 caller-prop spreads into native elements reject raw HTML even for untyped JavaScript callers. Runtime and compile-time regression checks cover the contract.
- Link isolation only recognized lowercase `_blank`. Mixed-case and named new browsing contexts now receive noopener/noreferrer while preserving authored rel values.
- Link/media URL helpers now reject embedded credentials as well as unsupported/executable schemes and control characters. Errors omit the URL value.
- Broad unverified peer claims were narrowed to React/React DOM ^19.3.0 and Motion ^14.1.0, the minimum versions verified here. Install scripts are disabled by default; strict peer checks and exact dependency/lock versions remain enforced.
- Private package artifacts now use an explicit dist/README file allowlist. Root tooling scripts are linted with package/app source.

## Durable checks

`pnpm check:security` scans authored files for known credential formats without printing values; parses runtime modules for execution/network primitives, raw HTML sinks and unguarded caller DOM props; rejects active/external authored SVG content; verifies private/sideEffects/allowlisted files/bounded peers and absence of runtime dependency/install hooks. This is a focused policy check, alongside manual source review and dependency/browser checks.

`pnpm check:package` recursively verifies every metadata/token/preset server entry, client directives, typed exports and local graph budgets. `pnpm validate` runs these checks, production builds, strict types, root/package/app lint, unit/browser tests, a low-severity dependency audit and formatting.

## Review evidence

- No authored credentials or unsupported execution/network primitive found. Runtime effects use local hooks/observers/timers and application-supplied children/media; no package telemetry or imperative remote request code.
- Authored SVGs are simple static geometry. The local captioned video fixture generator writes exclusively and validates its own capture path before removing that one generated file.
- URL allowlists, escaped SSR content, inert exits/decorations, opener isolation and private/server boundaries were inspected and tested.
- Docs serve nosniff, frame denial, strict-origin referrer and disabled camera/microphone/geolocation headers; browser checks use loopback assets and verify local-only requests. Next/Turbo telemetry is disabled during validation.
- Dependency audit has no known vulnerabilities. No graphics engines or new runtime dependencies were added.

Final responsive/accessibility/performance/API/docs/distribution audits remain. Artifact packing and consumer tree shaking are checked in later phases; this report does not replace those gates.
