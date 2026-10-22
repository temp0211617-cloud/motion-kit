# API audit — Phase 17

All153 catalog components are implemented and matched against server metadata and public client exports by `check:package`.141 remain building and12 experimental; implementation count is not a stable-release claim. Existing button imports remain compatible. The eleven generic interaction components use the focused `@personal/motion-kit/gestures` entry and separate server metadata.

## Interaction contracts

- Pressable reuses MotionButton's typed native button props, non-submitting default, disabled behavior, raw-HTML rejection and shared feedback.
- HoverScale/HoverLift/HoverMagnet/CursorAttract/TiltSurface/FollowPointer render one child subtree. Mouse coordinates use local cached geometry and MotionValues. Focus, touch and reduction stay flat. Geometry invalidates after scroll/resize; active listeners clean up.
- DragSurface/ElasticDrag provide bounded horizontal movement, Left/Right/Reset controls and arrows/Home. Child controls retain native input; child focus resets displacement. Elasticity is a shared token; the containing track clips visual excursions. Reduced motion keeps content static with movement controls disabled.
- SwipeAction exposes a native action button in every mode. Optional background swipe preserves vertical touch scrolling, ignores child controls, and cancels on pointer/touch cancellation, focus, reduction or disable. The application owns confirmations and undo.
- LongPressMotion fires once per hold and cancels on release/leave/blur/cancellation/hidden document/disable/timing or callback change/unmount. A normal activation button performs the same action. Delay is bounded300–2000ms, default600ms. No essential task depends on holding.

## Existing APIs

Controlled tabs continue to report requests without mutating controlled selection. Dynamic value/reorder/disabled changes preserve keyed panel drafts and update their accessible relationships. Invalid selection falls back to an enabled tab. Native dialog state, initial/return focus refs and scroll-lock ownership remain covered by browser regressions.

`initialIndex`, `initial`, `defaultValue` and similarly named initial props initialize uncontrolled state; changing them does not reset a mounted instance. Media selection clamps to current collection bounds. FilmStrip's selected media is replaced when the selected frame changes; keep persistent application data above that boundary. Keep stable keys/IDs for child lists. Layout/preference changes preserve the existing child subtree; removing or replacing keyed content follows normal React semantics.

Public declarations export prop/item types at category entries. Root/tokens/presets/metadata stay server safe. Negative declaration checks reject raw HTML and missing swipe action labels; runtime URL/DOM prop guards remain. No dependency or security exemption was added.

## Validation

New native action, hold lifecycle, dynamic props, SSR, focused drafts, gesture cancellation, touch and all12width browser checks are part of the suite. Mobile/desktop axe and320/1440 screenshots reviewed; demo inputs use visible shared field styles. Production consumer checks include Pressable/HoverMagnet/DragSurface/SwipeAction/LongPressMotion and ensure Pressable excludes sibling hold/gesture code. Full Chromium baseline:96 units and256 browser tests PASS. After the final cancelled-swipe guard, build/types/lint/96 units/package/performance/security/audit/format and all18 interaction browser checks PASS. All12widths and320/1440 axe/captures are covered; captures reviewed. Gesture local graph14,010 bytes; Pressable consumer3,654 bytes excludes sibling hold code. Fifteen consumer bundle checks PASS. Firefox/WebKit compatibility limitations remain documented separately; development is not blocked by those extra targets.

Documentation follow-up:BeforeAfterSlider now freezes and rounds initial position, preserves live position across initial/label updates and synchronizes output/ARIA from its MotionValue without frame-level React state. Dynamic-label regression and the full97-unit/257-Chromium suite pass. Shared layout/color token imports were narrowed without changing public values; media graph19,833 bytes.
