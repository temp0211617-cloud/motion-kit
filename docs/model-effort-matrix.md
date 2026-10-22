# Model / Reasoning Effort Matrix

The phase runner should make the model configurable. Do not permanently couple the repository to one model identifier.

## low

Mechanical exports, formatting, metadata, repetitive docs, trivial variants.

## medium

Default implementation work, routine components, tests, docs pages, straightforward fixes.

## high

Architecture, shared primitives, scroll/ticker/carousel engines, complex responsiveness, hydration bugs, package/security-sensitive changes.

## xhigh

Final architecture/security/release audit, severe multi-system bugs, major cross-package refactors, difficult race/performance issues.

If the installed Codex environment cannot switch effort/model programmatically, continue with the active model and record the recommended effort in the checkpoint rather than blocking work.
