#!/usr/bin/env bash
set -euo pipefail

PHASE_FILE="${1:-.codex/current-phase.md}"
CODEX_MODEL="${CODEX_MODEL:-}"
CODEX_EFFORT="${CODEX_EFFORT:-medium}"

if ! command -v codex >/dev/null 2>&1; then
  echo "Codex CLI not found in PATH." >&2
  exit 1
fi

PROMPT=$(cat <<PROMPT_EOF
Read START_HERE.md and follow CODEX_CONFIRMATION_PROMPT.md.
Current phase source: ${PHASE_FILE}
Do not regenerate existing planning files. Execute the phase non-stop unless a true blocker exists.
PROMPT_EOF
)

ARGS=(exec --sandbox workspace-write --config "model_reasoning_effort=${CODEX_EFFORT}" -)
if [[ -n "${CODEX_MODEL}" ]]; then
  ARGS=(exec --model "${CODEX_MODEL}" --sandbox workspace-write --config "model_reasoning_effort=${CODEX_EFFORT}" -)
fi

printf '%s\n' "$PROMPT" | codex "${ARGS[@]}"
