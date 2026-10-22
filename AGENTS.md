# AGENTS.md — Motion Kit Engineering Contract

## Mission

Build and maintain a private, production-grade React/Next.js motion design system containing roughly 120–150 reusable, polished components over controlled phases.

## Priority order

1. Security
2. Accessibility
3. Correctness
4. Maintainability
5. Performance
6. UX
7. Visual quality
8. Novelty

## Core stack

- React + TypeScript strict mode
- Next.js docs app
- Motion for React as primary animation engine
- Tailwind CSS for docs/demo styling
- pnpm workspaces
- Vitest + React Testing Library
- Playwright
- ESLint + Prettier

Avoid unnecessary dependencies. GSAP/Three/WebGL must not become core dependencies.

## Non-stop execution

Continue phase-by-phase without asking for routine confirmation. Stop only for true blockers requiring user input or authorization.

## Required phase loop

PLAN → IMPLEMENT → BUILD → TYPECHECK → LINT → TEST → RESPONSIVE → A11Y → SECURITY → PERFORMANCE → FIX → RE-RUN → CHECKPOINT → CONTEXT COMPACTION → CONTINUE

## Security invariants

- No secrets in source, logs, docs examples, fixtures, or commits.
- No `eval` or arbitrary code execution.
- Avoid `dangerouslySetInnerHTML`; sanitize and document if unavoidable.
- No hidden network calls or telemetry in the package.
- Validate external URLs where applicable; prevent `javascript:` URLs.
- Keep client/server boundaries explicit; avoid unnecessary `use client`.
- Minimize dependencies and review new packages before adding.
- Never weaken security checks simply to pass CI.

## Accessibility invariants

- Keyboard support for interactive components.
- Visible focus states.
- Touch-safe fallbacks.
- `prefers-reduced-motion` support.
- Semantic HTML first; ARIA only when needed.
- Dialogs/drawers: focus trap, Escape close, restoration, scroll-lock correctness.

## Responsive invariants

Validate representative widths: 320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920.
No accidental horizontal overflow. Desktop-only pointer effects must degrade cleanly on touch.

## Visual invariants

Use shared typography, spacing, radius, shadow, container, z-index, and motion tokens. No random one-off values unless justified. Alignment is a release criterion, not polish-only work.

## Motion invariants

- Prefer transform/opacity.
- Prefer MotionValues over React state for continuous motion.
- Avoid layout thrashing.
- Heavy/offscreen effects initialize lazily.
- Motion must be interruptible where appropriate.

## Public API invariants

- Prefer composable `children` APIs.
- Keep props minimal and coherent.
- Export typed APIs.
- Preserve tree shaking.
- Avoid giant barrel imports that pull all client code.

## Context protocol

At session start read only:

1. `AGENTS.md`
2. `.codex/current-phase.md`
3. `.codex/working-context.md`
4. latest `docs/checkpoints.md` entry
   Then read deeper docs only when needed.

## Checkpoint protocol

Update `docs/checkpoints.md`, `.codex/current-phase.md`, `.codex/next-phase.md`, and `.codex/working-context.md` at each phase boundary.
