import Link from "next/link";
import { coreMetadata } from "@personal/motion-kit/core/metadata";
import { CoreDemo } from "./CoreDemo";

export default function CorePage() {
  return (
    <div className="shell">
      <header className="site-header">
        <Link className="wordmark" href="/">
          MK<span className="caption">Core primitives / 0.2</span>
        </Link>
        <nav aria-label="Documentation">
          <Link href="/">Foundations</Link>
          <a href="#core-reference">Reference</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">02 / The basic vocabulary</p>
          <h1>Core motion</h1>
          <p className="lede">
            Small, composable entrances and transitions. Content stays readable during server
            rendering and respects reduced motion.
          </p>
        </section>
        <CoreDemo />
        <section id="core-reference" className="section">
          <h2>API reference</h2>
          <p>
            Import from <code>@personal/motion-kit/core</code> within a MotionProvider. All
            components compose children. Use entrances for brief hierarchy cues; avoid repeated
            large movement in dense task interfaces.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Core component reference"
          >
            <table>
              <caption>
                Essential tier · light performance cost · touch-safe · reduced motion supported
              </caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Purpose / props</th>
                  <th scope="col">Accessibility / reduced motion</th>
                </tr>
              </thead>
              <tbody>
                {coreMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.name === "Stagger"
                        ? "Timing context: interval (preset default)."
                        : item.name === "StaggerItem"
                          ? "Indexed entrance: index (required), Reveal props."
                          : item.name === "Presence"
                            ? "Conditional exit: show (required), mode (sync/wait), onExitComplete."
                            : item.name === "PageTransition"
                              ? "Keyed crossfade: transitionKey (required), div props."
                              : item.name === "MotionGroup"
                                ? "Shared layout scope: id (required). Animate layout in children."
                                : "Entrance: variant (Reveal), trigger (mount/view), once (true), amount (0.2), delay (0); standard div props."}
                    </td>
                    <td>
                      {item.name === "Presence" || item.name === "PageTransition"
                        ? "Exiting content is inert/hidden; reduced motion uses zero duration. Application owns focus/navigation announcements."
                        : "Children retain semantics; SSR stays visible; focus reveals immediately; reduced motion snaps to final state."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <pre tabIndex={0} role="region" aria-label="Core usage example">
            <code>{`import { FadeUp, Stagger, StaggerItem } from "@personal/motion-kit/core";\n\n<FadeUp><h2>A considered entrance</h2></FadeUp>\n<Stagger>\n  {items.map((item, index) => (\n    <StaggerItem key={item.id} index={index}>{item.content}</StaggerItem>\n  ))}\n</Stagger>`}</code>
          </pre>
          <p>
            Viewport effects use IntersectionObserver and fall back to visible content when
            unavailable. Horizontal movement should sit inside a clipping surface. Exit primitives
            do not provide dialog focus management; use semantic interactive children and manage
            route focus at the application level.
          </p>
        </section>
      </main>
      <footer className="site-footer">Motion Kit / Core documentation</footer>
    </div>
  );
}
