# Known Issues

- Private candidate0.9.0-rc.2 contains all153 implemented components; phases0–19 are complete for the verified Chromium scope. Metadata141building/12experimental is retained; stable promotion is a separate release action.
- Full99-unit/260-Chromium validation and actual archive/installed-consumer verification pass. Native-video hover ownership and early docs hydration edits are fixed; native playback, initial/default state, controlled tabs, keyed drafts and focus restoration retain their documented contracts.
- Additional browser/CI verification is explicitly PENDING at the user's2026-10-16 request: Firefox Windows mozglue launch; WebKit native-video captures320/1440; concurrent native mobile tap inconsistency; full CI three-engine execution. Keep these deferred without retrying the same host repairs during phase completion. Full projects/assertions remain enabled. See [phase status/pending registry](release-plan.md).
- [Browser compatibility evidence](browser-compatibility.md) records rc.1's serial256-check and targeted39-check WebKit passes alongside concurrent failures. Those historical results do not certify rc.2's full matrix. No broad stable support claim is made.
- Current local category graphs:editorial18,698bytes, media19,852bytes, gestures14,213bytes. Media has148bytes headroom under the unchanged20k budget; review import granularity before extending it.
- Repository has no Git metadata. Local checkpoints and package receipts record progress. PrivateRC0.9.0-rc.2 is packaged/verified; CI is configured and remains pending execution. No external publication/upload occurred.

Supported peers start at verified React/React DOM19.3 and Motion14.1. React18 support is not claimed. See release-candidate.md for the current artifact, integrity and validation details.
