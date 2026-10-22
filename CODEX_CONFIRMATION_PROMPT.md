# Codex Confirmation + Non-Stop Start Prompt

You are entering a pre-scaffolded private Motion UI library repository. The planning, guardrails, phase structure, design rules, security rules, component catalog, and checkpoint templates already exist to save tokens and reduce duplicated reasoning.

## Before changing code

Read:

- `AGENTS.md`
- `.codex/current-phase.md`
- `.codex/working-context.md`
- the latest checkpoint in `docs/checkpoints.md`
- any phase-specific file referenced by `.codex/current-phase.md`

Then output a **very short confirmation** containing only:

- Current phase
- Main deliverable
- Validation gates you will enforce
- Whether any true blocker exists

Do not restate the whole specification.

## Execution rule

If there is no true blocker, immediately continue implementation after the confirmation. Do not ask for routine approval between phases.

Use this loop for every phase:
PLAN → IMPLEMENT → BUILD → TYPECHECK → LINT → TEST → RESPONSIVE QA → ACCESSIBILITY QA → SECURITY QA → PERFORMANCE QA → FIX → RE-RUN → CHECKPOINT → COMPACT CONTEXT → CONTINUE

Do not mark a phase complete while a required gate is failing.

## Token discipline

- Do not re-read the entire repo on every phase.
- Do not regenerate docs that already exist.
- Reuse primitives/hooks before duplicating logic.
- Keep `.codex/working-context.md` compact.
- Prefer targeted tests while developing, then run the phase-level suite at checkpoint.

## Safety

Never expose secrets, weaken security controls to make tests pass, or silently ignore accessibility/security failures.
