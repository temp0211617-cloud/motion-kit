import Link from "next/link";
import { scrollMetadata } from "@personal/motion-kit/scroll/metadata";
import { ScrollDemo } from "./ScrollDemo";
export default function ScrollPage() {
  return (
    <div className="shell">
      <header className="site-header">
        <Link href="/" className="wordmark">
          MK<span className="caption">Scroll engine</span>
        </Link>
        <nav aria-label="Documentation">
          <Link href="/cards">Cards</Link>
          <a href="#story">Story</a>
          <a href="#reference">Reference</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">06 / Reading in motion</p>
          <h1>Follow the story.</h1>
          <p className="lede">
            Scroll at your own pace. Content stays readable, controls stay native, and motion
            follows.
          </p>
        </section>
        <ScrollDemo />
        <section className="section" id="reference">
          <h2>Scroll reference</h2>
          <p>
            Import from <code>@personal/motion-kit/scroll</code> inside MotionProvider. Use scroll
            effects for sparse editorial accents; avoid moving dense text or precision controls.
            Effects flatten when descendant controls receive focus. Mask and opacity effects suit
            decorative content.
          </p>
          <div
            className="table-scroll"
            role="region"
            aria-label="Scroll component reference"
            tabIndex={0}
          >
            <table>
              <caption>Readable server output · lazy effects · stacked fallback</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {scrollMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.tier} · {item.performance} ·{" "}
                      {item.name === "StickyStory" || item.name === "ChapterScroll"
                        ? "chapters: unique safe id, title, body, optional media; label required; native anchor index and active chapter. StickyStory adds progress and per-chapter sticky media."
                        : item.name === "StickyMediaStory"
                          ? "media and children; one sticky media column on wide screens."
                          : item.name === "HorizontalScroll"
                            ? "children and label required; native horizontal overflow, stacked reduced-motion fallback. Give items a flex basis and scroll-snap-align."
                            : item.name === "ScrollProgress"
                              ? "label optional; viewport document progress with accessible percentage."
                              : item.name === "ScrollSectionProgress"
                                ? "children and label required; section start/end progress; use sections taller than the viewport."
                                : item.name === "ScrollScene"
                                  ? "children and native div attributes; useScrollScene returns a shared progress MotionValue, centered while inactive."
                                  : item.name === "PinnedSection"
                                    ? "children and div attributes; 160vh desktop section with CSS sticky; natural mobile/reduced flow."
                                    : "children and native div attributes; bounded transform/opacity/clip effects, lazy in-view subscription; reduced motion preserves static content."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Sticky layouts activate at 1024px with at least 600px viewport height. All chapters and
            media render once and remain mounted across layout changes. Author accessible media and
            complete chapter text; application code controls playback. Keep interactive media modest
            in height so focused controls remain visible.
          </p>
          <pre tabIndex={0} role="region" aria-label="Sticky story usage">
            <code>{`import { StickyStory } from "@personal/motion-kit/scroll";\n\n<StickyStory label="Project chapters" chapters={[\n  { id: "begin", title: "Begin", body: <p>Chapter content</p>, media: <img src="/frame.webp" alt="Project sketch" /> }\n]} />`}</code>
          </pre>
        </section>
      </main>
      <footer className="site-footer">Motion Kit / Scroll documentation</footer>
    </div>
  );
}
