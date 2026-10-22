# Security Standard

## Secrets

- `.env` files are ignored; only `.env.example` is committed.
- Never log credentials/tokens.
- No secrets in fixtures, screenshots, docs, or example code.

## Dependencies

Before adding a dependency verify necessity, maintenance health, bundle/security impact, runtime behavior, and whether it can be a peer dependency.
Avoid install/postinstall scripts unless justified.

## Browser/DOM safety

- No `eval`, Function constructors, or arbitrary script execution.
- Avoid `dangerouslySetInnerHTML`.
- Validate external URLs and reject unsafe schemes.
- Do not create network behavior inside UI components by default.

## SSR/client boundary

- No `window`/`document` access during SSR.
- Avoid unnecessary `use client` boundaries.
- Deterministic server/client markup.

## Package safety

- Private publish config by default.
- Explicit exports.
- No telemetry.
- No remote binary downloads during install/runtime.

## CI/release gate

A critical/high unresolved finding blocks stable release.
