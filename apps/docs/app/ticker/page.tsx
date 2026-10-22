import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { tickerMetadata } from "@personal/motion-kit/ticker/metadata";
import { TickerDemo } from "./TickerDemo";
export default function TickerPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">07 / Continuous rhythm</p>
          <h1>Keep a steady pace.</h1>
          <p className="lede">
            True pixel speed, measured content, and direct control. Start, pause, take hold.
          </p>
        </section>
        <TickerDemo />
        <section className="section" id="reference">
          <h2>Ticker reference</h2>
          <p>
            Import from <code>@personal/motion-kit/ticker</code> inside MotionProvider. Use for
            decorative text, logos and image studies; keep primary reading content and actions
            outside a moving rail. Use plain visual children without stateful effects. Accessible
            originals render once; visual copies are inert and hidden from assistive technology, and
            duplicate IDs are removed.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Ticker component reference"
          >
            <table>
              <caption>
                Explicit playback · measured cycles · single static reduced-motion copy
              </caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {tickerMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.tier} · {item.performance} ·{" "}
                      {item.name === "RulerTicker"
                        ? "count 2–120, step positive up to 1000, snap default true; centered indicator, arrow/Home/End keys and drag; loop false enables finite bounds."
                        : item.name === "ImageTicker"
                          ? "images: safe http/https/relative src, descriptive alt, positive width/height; lazy loading and intrinsic dimensions."
                          : item.name === "NewsTicker"
                            ? "items string array; ordinary feed without live announcements."
                            : item.name === "DualTicker"
                              ? "first/second ReactNode rows, label required; opposing directions and separate pause controls."
                              : item.name === "LogoTicker"
                                ? "children rendered as a semantic list; visual duplicates excluded."
                                : "label and decorative children required; speed number or MotionValue (0–240 px/s), autoplay false, axis horizontal/vertical, direction forward/reverse, pauseOnHover true, draggable false, edgeFade false, loop true. Variant fixes its named behavior."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            LiveTicker also accepts className, gap, offset MotionValue, snapStep and semantic
            group/list. Drag momentum is finite and interruptible. Keyboard navigation pauses
            playback; focused child controls reset to the original copy. Resize preserves the loop
            phase. Animation frames stop offscreen, paused or reduced. More than64 direct children
            or a cycle requiring over32 copies uses a static fallback; a capped instance stays
            static. Empty rails disable playback.
          </p>
          <p>
            Vertical drag is optional and owns its gesture area; horizontal drag allows vertical
            page scrolling. Edge fades cost compositing and suit sparse rails. VelocityTicker
            changes speed with scroll; content is never fetched. Browser observers measure visual
            sizes, with a resize-event fallback when ResizeObserver is unavailable.
          </p>
          <pre tabIndex={0} role="region" aria-label="Ticker usage">
            <code>{`import { LiveTicker, RulerTicker } from "@personal/motion-kit/ticker";\n\n<LiveTicker label="Studio names" speed={40}>\n  <span>North</span><span>Fieldwork</span>\n</LiveTicker>\n<RulerTicker label="Measured scale" snap count={48} />`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Ticker documentation</footer>
    </div>
  );
}
