# Release plan

Verified private candidate: `0.9.0-rc.2`. All 153 components and phases0–19 are complete for the agreed private Chromium scope. Final closure fixes hover taking ownership of already-playing native video. Full validation passes99units/260Chromium checks and all build/type/lint/package/security/performance/audit/format gates; the actual archive and isolated installed consumer pass. Prior candidate evidence remains in checkpoints and browser-compatibility.md.

`pnpm check:release` creates a local tarball and verifies an isolated offline installed consumer. The package remains private:true and UNLICENSED. CI is configured for the full Chromium/Firefox/WebKit matrix and has not executed from this workspace.

Stable 1.0 status requires passing the advertised support matrix and all security, accessibility, responsive/visual, API and package gates. The 141 ordinary metadata entries remain building and 12 remain experimental. Firefox/WebKit environment limits remain documented; they do not block independent development or use of the explicit Chromium private-candidate baseline. Experimental patterns retain experimental status through any later stable release. Public publication requires a separate user request.

## Phase completion

Scope follows MASTER_BUILD_SPEC.md phases0–19. Complete means the private Chromium-scoped deliverable and its required local gates are verified; it does not certify the deferred browser matrix or public/stable release. The detailed historical evidence is in [checkpoints](checkpoints.md).

| Phase | Deliverable                                          | Status                      | Evidence                                                                     |
| ----- | ---------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------- |
| 0     | Workspace, strict toolchain, install/security policy | Complete                    | [Architecture](architecture.md), checkpoint0                                 |
| 1     | Shared design/motion tokens and provider             | Complete                    | [Design system](design-system.md), checkpoint1                               |
| 2     | Core15                                               | Complete                    | Core exports/demo, checkpoint2                                               |
| 3     | Text16                                               | Complete                    | Text exports/demo, checkpoint3                                               |
| 4     | Buttons/links12                                      | Complete                    | Interaction exports/demo, checkpoint4                                        |
| 5     | Cards12                                              | Complete                    | Cards exports/demo, checkpoint5                                              |
| 6     | Scroll15                                             | Complete                    | Scroll exports/demo, checkpoint6                                             |
| 7     | Ticker11                                             | Complete                    | Ticker exports/demo, checkpoint7                                             |
| 8     | Carousel/media12                                     | Complete                    | Media exports/demo, checkpoint8                                              |
| 9     | Editorial12                                          | Complete                    | Editorial exports/demo, checkpoint9                                          |
| 10    | Cinematic15                                          | Complete                    | Cinematic exports/demo, checkpoint10                                         |
| 11    | Navigation/overlays10                                | Complete                    | Navigation exports/demo, checkpoint11                                        |
| 12    | Experimental12                                       | Complete                    | Experimental exports/demo, checkpoint12                                      |
| 13    | Security audit                                       | Complete                    | [Security audit](security-audit.md), source scan/dependency gates            |
| 14    | Responsive/visual audit                              | Complete                    | [Responsive audit](responsive-audit.md), twelve-width checks                 |
| 15    | Accessibility audit                                  | Complete for verified scope | [Accessibility audit](accessibility-audit.md), checkpoint15 scope correction |
| 16    | Performance audit                                    | Complete                    | [Performance audit](performance-audit.md), bundle/runtime gates              |
| 17    | API consistency and generic interactions11           | Complete                    | [API audit](api-audit.md),153 export/catalog checks                          |
| 18    | Documentation and integration guides                 | Complete                    | [API guide](api-guide.md), root/package guides and twelve demos              |
| 19    | Private candidate, archive and installed consumer    | Complete rc.2               | [Candidate report](release-candidate.md), release receipt                    |

## Deferred verification

Deferred at the user's explicit request on2026-10-16. Keep these pending without blocking the completed implementation phases or repeatedly attempting the same host repairs. Their checks remain enabled in full validation/CI; passing Chromium does not mark them passed.

| Item                                              | Status  | Resume condition                                                                 |
| ------------------------------------------------- | ------- | -------------------------------------------------------------------------------- |
| Firefox Windows mozglue launch                    | Pending | Working browser host/runner                                                      |
| WebKit native-video captures at320/1440           | Pending | Working native-media capture environment                                         |
| Concurrent WebKit native mobile tap inconsistency | Pending | Reproduce and verify on a working compatible host; serial evidence retained      |
| Full CI three-engine run                          | Pending | Connected private repository/runner; workflow is configured but has not executed |

No further implementation phase or additional components are required by the agreed plan. Publishing or promoting a stable release is a separate action.
