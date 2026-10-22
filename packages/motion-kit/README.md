# @personal/motion-kit

Private React motion components with typed APIs, shared tokens, native keyboard/touch alternatives and reduced-motion support. 153 components across 12 categories are implemented. The package is a private candidate; experimental patterns remain experimental. Chromium is the verified baseline; additional Firefox/WebKit compatibility is pending.

## Install privately

Use `workspace:*` within the Motion Kit workspace. For another project, build and pack this package, copy the resulting tarball, then install it with the supported peers:

```sh
pnpm add ./personal-motion-kit-0.9.0-rc.2.tgz react@19.3.0 react-dom@19.3.0 motion@14.1.0
```

The archive must exist locally; this package is not published to a public registry. React/React DOM peers are `^19.3.0`, Motion is `^14.1.0`; React 18 compatibility is not claimed. Output is ESM/ES2022 with declarations and source maps. No bundled runtime dependencies, install scripts, telemetry or hidden requests are included. Tailwind is not required by the library.

## Start

Place MotionProvider around your client subtree. This example is a Next.js client component:

```tsx
"use client";
import { useState } from "react";
import { MotionProvider } from "@personal/motion-kit/provider";
import { FadeUp } from "@personal/motion-kit/core";
import { Pressable } from "@personal/motion-kit/gestures";

export function Example() {
  const [marks, setMarks] = useState(0);
  return (
    <MotionProvider preset="premium" reducedMotion="user">
      <FadeUp>
        <Pressable onClick={() => setMarks((value) => value + 1)}>Mark study</Pressable>
        <output aria-live="polite">Marks: {marks}</output>
      </FadeUp>
    </MotionProvider>
  );
}
```

Root/tokens/presets exports are server safe. For optional CSS variables, import `foundationVariables` from `/tokens` and apply it to a containing element's `style`. Components, `/provider` and `/hooks` preserve client boundaries. `useMotionKit` requires MotionProvider; `useMotionPreference` works outside it and follows the system preference. SSR/missing media queries use reduced motion. Provider defaults are premium/user; other presets are subtle/cinematic/playful/editorial.

| Entry           | Contents                                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| `/core`         | Entrances, stagger, presence and page transitions                              |
| `/text`         | Split/reveal text, numbers and controlled text movement                        |
| `/interactions` | Native motion buttons and safe links                                           |
| `/gestures`     | Pressable, hover/pointer surfaces, bounded drag, swipe and hold alternatives   |
| `/cards`        | Semantic cards, native disclosures and optional pointer effects                |
| `/scroll`       | Progress, parallax, sticky stories and native horizontal rails                 |
| `/ticker`       | Live/drag/vertical/dual/media tickers and rulers                               |
| `/media`        | Carousels, FilmStrip, native MediaRail, comparison, image/video previews       |
| `/editorial`    | Measured navigation, counters, EditorialSlider, timelines and reading progress |
| `/cinematic`    | Finite masks/reveals, Curtains, bounded hero/depth scenes                      |
| `/navigation`   | Native navigation, tabs, accordion, modal and drawer                           |
| `/experimental` | Optional cursor decorations, finite fields and liquid/distortion accents       |

Every category has a server-safe `/metadata` entry, for example `/media/metadata`. Component prop/item types are exported at the category entry. The source repository's docs app provides live demos, API/default/limit tables and examples for every component.

## Behavior contracts

Keep semantic content and visible focus styles. Most entrance/surface wrappers create block elements; use them only where that HTML structure is valid. Buttons default to type=button. Links/media reject executable schemes and credential-bearing URLs; new browsing contexts isolate the opener. Caller raw HTML is unsupported.

Initial/default props initialize uncontrolled state; change controlled values/callbacks where supported. Preserve stable child keys/IDs. Keep durable application state above content that can be removed or selected media that is replaced. Layout/reduced-motion changes preserve existing children.

Use unique, meaningful labels and IDs for rails, chapters, tabs and dialogs. Native dialogs require browser dialog support. Keep them mounted through controlled close; use `initialFocusRef` and `returnFocusRef` when implicit browser focus cannot identify the desired element. Applications own route announcements and focus after an opener is removed.

Author media alt text, captions, dimensions and loading/playback policy. FilmStrip selection is separate from thumbnail viewport position; comparison layers are inert visual content. Video hover previews are explicit, muted and finite, and native controls/captions remain available. Hover starts playback only when the player is paused; existing playback remains under native/application control through pointer leave and reduced-motion changes. Source changes and unmount still pause the removed player. Codec support depends on the browser/platform.

Tickers start paused and expose controls. Hover/pointer effects remain optional; focused controls, touch and reduced motion stay usable. Drag has arrows/native controls; SwipeAction always shows its action button; LongPressMotion offers ordinary activation and cancels pending holds on interruption. Applications own destructive-action confirmation/undo.

Use experimental effects sparingly; they keep experimental status. Profile your real content/device workload. Motion coordinates use MotionValues and offscreen/heavy effects initialize lazily, but media, blur and layered content still affect application performance.

Private use only. Full browser compatibility and stable-release status are not implied by the archive.
