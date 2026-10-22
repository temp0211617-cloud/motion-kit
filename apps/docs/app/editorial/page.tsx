import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { editorialMetadata } from "@personal/motion-kit/editorial/metadata";
import { EditorialDemo } from "./EditorialDemo";
export default function EditorialPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">09 / A readable sequence</p>
          <h1>Make room for the story.</h1>
          <p className="lede">
            Large images, clear chapter landmarks, and a deliberate reading pace.
          </p>
        </section>
        <EditorialDemo />
        <section className="section" id="reference">
          <h2>Editorial reference</h2>
          <p>
            Import from <code>@personal/motion-kit/editorial</code> inside MotionProvider.
            Navigation targets are document sections with unique safe IDs; keep their order aligned
            with the reading flow. Use measured chapters for long narratives, with static content
            and native anchors as the foundation.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Editorial component reference"
          >
            <table>
              <caption>Native chapter links · cached geometry · restrained transitions</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {editorialMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.tier} · {item.performance} ·{" "}
                      {item.name === "EditorialSlider"
                        ? "slides: unique id/title/media/children; label required, className optional. Cyclic keys/buttons/swipe, directional masks, index/total and progress; autoplay false, interval5–60s, wheel false (horizontal only); hover/focus pause, reduced static playback."
                        : item.name === "NumberedMediaRail"
                          ? "children and label; native MediaRail with numbered captions."
                          : item.name === "EditorialTimeline"
                            ? "entries: unique id/label/children; label required, className optional; semantic ordered sequence."
                            : item.name === "MeasureScale"
                              ? "label required; count2–120 (default20), positive step10; static accessible scale."
                              : item.name === "ReadingProgressRail"
                                ? "label required, className optional; full document progress and percentage, including reduced motion."
                                : item.name === "SectionTracker"
                                  ? "sections/label; children(state) receives activeIndex, activeId and progress MotionValue."
                                  : "sections: unique safe id and label, label required, className optional. Active tracking uses cached document positions; ruler axis vertical/horizontal and sticky false. Desktop vertical ruler falls back to horizontal on smaller/shorter screens."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Section progress covers the tracked content span; document progress covers the whole
            page. The active chapter crosses the upper third of the reading viewport. Geometry
            refreshes on resize/content sizing; frame scrolling updates MotionValues and coarse
            chapter state. Motion is optional; primary links and controls stay native.
          </p>
          <p>
            Keep critical reading outside autoplay slides, and avoid this slider for dense forms or
            precision tasks. Play is explicit by default; manual navigation pauses playback. Exiting
            panels are inert and hidden from accessibility, while focused incoming actions complete
            their entrance immediately. The application owns media loading, captions, and playback.
          </p>
          <pre tabIndex={0} role="region" aria-label="Editorial ruler usage">
            <code>{`import { RulerScrollIndicator } from "@personal/motion-kit/editorial";\n\n<RulerScrollIndicator label="Chapters" sections={[\n  { id: "observe", label: "Observe" }, { id: "compose", label: "Compose" }\n]} />\n<section id="observe">...</section>\n<section id="compose">...</section>`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Editorial documentation</footer>
    </div>
  );
}
