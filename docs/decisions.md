# Architecture Decisions

## D-001 Primary animation engine

Use Motion for React as the core engine. Heavy engines are optional and non-core.

## D-002 Private reusable package

Design for private GitHub/package-registry reuse across projects.

## D-003 Docs experience

Build a custom internal docs/playground instead of depending solely on generic Storybook presentation.

## D-004 Quality over artificial count

Target 120–150 useful components, but do not create duplicates merely to hit a number.

## D-005 Central tokens

Typography, spacing, radius, shadows, z-index and motion behavior are tokenized.

## D-006 Separate provider entry

The package root contains server-safe tokens, presets, and metadata types. The provider has its own `./provider` export with its client directive preserved. React and Motion remain external peer dependencies in the build.

## D-007 Reproducible development toolchain

Pin direct dependencies and commit the pnpm lockfile. Node 24 matches the installed runtime and Vitest engine requirement. Use supported ESLint 10 with compatible TypeScript ESLint and React Hooks plugins. RTL/jsdom validate provider behavior; Playwright and axe validate the production docs app. Install with lifecycle scripts disabled. Tailwind's official PostCSS integration supplies docs styling. No new package runtime dependencies were added.

## D-008 esbuild security override

Pin transitive esbuild to 0.28.1 to address GHSA-g7r4-m6w7-qqqr (Windows development-server arbitrary file read). Retest tsup and Vitest against the patched binary. No advisory is suppressed. Review the override when parent packages adopt the patched version.

### Execution correction — 2026-10-15

The Firefox/WebKit matrix was added by the agent. AGENTS.md requires Playwright/accessibility/responsive checks but does not require Firefox specifically. Treating the local Firefox launch failure as a blocker to all independent development was unnecessarily restrictive. Continue performance/API/docs/package work using the verified Chromium baseline while retaining the full compatibility suite and unresolved browser evidence. This correction does not certify Firefox/WebKit support or remove security/accessibility assertions.
