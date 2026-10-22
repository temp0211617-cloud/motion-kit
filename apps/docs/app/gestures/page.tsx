import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { gestureMetadata } from "@personal/motion-kit/gestures/metadata";
import { GestureDemo } from "./GestureDemo";
export default function GesturesPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">13 / A direct response</p>
          <h1>Within reach.</h1>
          <p className="lede">
            Local pointer feedback and optional gestures, with native controls always within reach.
          </p>
        </section>
        <GestureDemo />
        <section className="section" id="reference">
          <h2>Interaction reference</h2>
          <p>
            Import from <code>@personal/motion-kit/gestures</code> inside MotionProvider. Surface
            children render once. Keep meaningful controls inside; decorative movement never
            replaces an action.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Interaction component reference"
          >
            <table>
              <caption>Keyboard alternatives · local geometry · reduced motion</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {gestureMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.name === "Pressable"
                        ? "MotionButtonProps; native button, children, disabled, non-submitting default. Existing MotionButton effects are retained."
                        : item.name === "LongPressMotion"
                          ? "label, onLongPress; optional delayMs300–2000 (default600), disabled/className. Hold Space/Enter or primary pointer; normal Activate button provides the same action. Release/leave/cancel/blur/hidden/prop changes/unmount cancel pending holds."
                          : item.name === "SwipeAction"
                            ? "children, label, actionLabel, onAction; optional disabled/className. Background horizontal swipe40px invokes action; explicit native action button remains available on touch/reduced motion. Own confirmations and undo for destructive actions."
                            : item.name.endsWith("Drag") || item.name === "DragSurface"
                              ? "children, label; optional disabled/className. Horizontal range±40px, arrow keys16px, Home/Reset to center. Visible Left/Right/Reset controls. Child controls retain native input; focus resets displacement. Reduced motion keeps content static."
                              : "children; optional disabled/className. Mouse-only hover/local pointer response; focus/touch/reduction stay flat. HoverMagnet±8px, CursorAttract±4px, FollowPointer±16px, tilt±6°. Bounds refresh after scroll/resize."}{" "}
                      · {item.performance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <pre tabIndex={0} role="region" aria-label="Interaction usage example">
            <code>{`import { Pressable, HoverMagnet, SwipeAction } from "@personal/motion-kit/gestures";\n\n<HoverMagnet><Pressable onClick={mark}>Mark study</Pressable></HoverMagnet>\n<SwipeAction label="Study" actionLabel="Mark study" onAction={mark}>\n  <p>A study to revisit.</p>\n</SwipeAction>`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Interaction documentation</footer>
    </div>
  );
}
