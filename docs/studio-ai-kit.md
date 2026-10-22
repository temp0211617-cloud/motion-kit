# Studio and AI Kit

## Visual Studio

Open `/studio` for a bounded, six-layer motion editor. Edit text, shape, palette, start/end transform and opacity keyframes, duration, delay and easing. Select layers using the list or canvas. The timeline supports play/pause, restart and native range scrubbing. Thirty edits of undo history, redo, explicit browser save/restore, JSON file/paste import, project export and standalone typed React export are available. This is a focused two-keyframe scene editor, not a general video editor or a claim of Motion Studio feature parity.

Continuous playback uses a MotionValue. The driver stops when the canvas is offscreen, the document is hidden, or reduced motion is active. Reduced motion displays final poses and disables temporal playback/scrubbing. Canvas selection has native layer-button alternatives. Editing shows the resulting final pose; Play restarts from the beginning when already at the end.

Exported React uses the same shapes, colours, numeric keyframes and easing functions as the editor. It includes reduced-motion handling. `pnpm check:studio` compiles a generated export against strict TypeScript and the installed Motion/React types without writing temporary source files.

## AI Kit

Open `/ai-kit` to write a creative brief, copy a schema-aware agent prompt, import and validate a returned JSON scene, preview it and transfer the draft to Studio. Draft transfer uses session storage; Studio has an explicit Load AI draft action. Starter scenes are labelled as local presets, never as AI output. Neither briefs nor access codes are persisted.

The user explicitly deferred provider setup. No live provider call or paid generation was made or verified. Prompt packs, validation, preview and transfer work without credentials. The optional OpenAI adapter is implemented behind server configuration; it is not an assertion of tested live model availability.

### Optional local provider configuration

Copy placeholder variable names from root `.env.example` into `apps/docs/.env.local` and supply values locally:

- `MOTION_AI_ENABLED=1` explicitly enables generation.
- `OPENAI_API_KEY` is a server-only provider key.
- `OPENAI_MODEL` must name an available Responses API model supporting structured outputs. No model or price is guessed.
- `MOTION_AI_ACCESS_CODE` is a separate private workspace passphrase, entered in the UI for generation. It is never the provider key.

Restart the server after configuration. Secrets must never use `NEXT_PUBLIC_` names, appear in committed source or be pasted into chat. Keep this workspace bound to 127.0.0.1:3000. Public hosting needs real account authentication and a distributed rate-limit store before enabling this feature.

The server action checks exact local host/origin, configuration, bounded brief/access-code inputs and a constant-time hashed passphrase comparison. One concurrent generation, five requests per minute and fifty per process per UTC day are allowed; failed upstream attempts count. Limits are in-memory and reset with the process, so they are for this single-owner local tool. The fixed HTTPS destination is api.openai.com/v1/responses, with no caller URL, redirects, tools or remote assets. Requests use store:false, structured JSON output, a 3200-token cap, a 25-second deadline and a 64KB response cap. Only explicit Generate submits a brief. Errors shown to the client never contain upstream bodies, prompts, credentials or internal exceptions.

The integration follows [official OpenAI Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses), accessed 2026-10-23. Completed structured output is independently validated; incomplete responses, refusals and malformed scenes are rejected. Imported/generated content is plain text and numeric data, never executed code or raw HTML. All extra fields, duplicate IDs, unsupported styles and out-of-range/nonfinite values fail validation. The existing ban on arbitrary execution and browser network primitives remains intact; the reviewed server transport is isolated from the component package.

## Verification and scope

The package remains 153 components and its rc.2 archive is unchanged. No new runtime dependency was added. Docs tests reference the already installed Vitest 5.0.4 version; install scripts were disabled and the resolved package set remains 434. `artifacts/tools-*` contains build, type, lint, unit, browser and audit evidence. Browser coverage includes both tools at all twelve required widths, normal/reduced axe scans, real editing/undo/redo/storage/export, invalid imports, cross-page transfer and native touch.

Changes are local, not synchronized to GitHub. Earlier Firefox/WebKit host limitations remain deferred. Provider setup and live generation remain deferred by explicit user choice.
