# Architecture

## Repository

- `apps/docs`: internal visual documentation/playground.
- `packages/motion-kit`: reusable private candidate package; stable status awaits release gates.
- optional heavy/experimental engines can later move to separate optional package/entrypoint.

## Component layers

- primitives: low-level reusable motion mechanics
- hooks: reusable state/progress/pointer/scroll mechanics
- components: public UI building blocks
- tokens/presets/providers: global system behavior
- metadata: documentation/search/performance/tier data

## Export strategy

Prefer explicit subpath exports where useful:

- `@personal/motion-kit`
- `@personal/motion-kit/text`
- `@personal/motion-kit/scroll`
- `@personal/motion-kit/editorial`
- `@personal/motion-kit/experimental`

Avoid exports that force unrelated client modules into every consumer bundle.
