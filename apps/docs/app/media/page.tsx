import Link from "next/link";
import { mediaMetadata } from "@personal/motion-kit/media/metadata";
import { MediaDemo } from "./MediaDemo";
export default function MediaPage() {
  return (
    <div className="shell">
      <header className="site-header">
        <Link className="wordmark" href="/">
          MK<span className="caption">Carousel & media</span>
        </Link>
        <nav aria-label="Documentation">
          <Link href="/ticker">Ticker</Link>
          <a href="#reference">Reference</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">08 / A collection in focus</p>
          <h1>Choose a frame.</h1>
          <p className="lede">
            Native navigation, clear comparisons, and media that stays under your control.
          </p>
        </section>
        <MediaDemo />
        <section className="section" id="reference">
          <h2>Media reference</h2>
          <p>
            Import from <code>@personal/motion-kit/media</code> inside MotionProvider. Use carousels
            for optional browsing, with important content also available in the page flow. Native
            scrolling and controls support touch, keyboard and reduced motion.
          </p>
          <div
            className="table-scroll"
            role="region"
            aria-label="Media component reference"
            tabIndex={0}
          >
            <table>
              <caption>Native rails · labeled comparisons · explicit media playback</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {mediaMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.tier} · {item.performance} ·{" "}
                      {item.name === "FilmStrip"
                        ? "frames: unique id, label, thumbnail, media; label required; initialIndex optional, snap true, edgeFade false. Frame buttons/range playhead select media and pause the previous native video/audio."
                        : item.name === "BeforeAfterSlider"
                          ? "before/after visual nodes, label, beforeLabel/afterLabel required; initial percent50. Visual layers inert; native range is the control."
                          : item.name === "VideoHoverPreview"
                            ? "src, poster, captionSrc, label required; captionLanguage en; hoverPlay false. Validated sources, preload none, muted native controls; opt-in mouse previews start only from paused playback, stop by4.5s and cancel on reduced motion. Existing native playback stays user-controlled."
                            : item.name === "HoverMediaPreview"
                              ? "children trigger, preview node and label required; mouse enhancement plus explicit toggle, Escape dismissal and focus restoration."
                              : item.name === "ImageReveal" || item.name === "ImageTilt"
                                ? "src, descriptive alt, positive width/height; optional caption/className. Lazy image, visible SSR; reveal once in view or mouse-only bounded tilt."
                                : item.name === "AnimatedGallery"
                                  ? "children/className; preserve child keys when reordering. In-view layout/entry/exit; exiting actions inert. Larger than64 items stays static."
                                  : "children, label required; className/initialIndex optional. Native arrow/Home/End and Previous/Next, single-slide carousels; MediaRail uses smaller cells. Drag/momentum enhancements are mouse-only; touch scrolls natively. InfiniteCarousel wraps button/keyboard navigation without duplicate slides."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Movie playhead selection is separate from thumbnail viewport scrolling. Images/videos
            and interactive custom nodes are supplied by the application; keep thumbnail children
            visual, and author meaningful captions and alternatives. Comparison labels describe the
            two states; its visual layers cannot host active controls. Gallery motion avoids
            offscreen initialization.
          </p>
          <pre tabIndex={0} role="region" aria-label="Film strip usage">
            <code>{`import { FilmStrip, BeforeAfterSlider } from "@personal/motion-kit/media";\n\n<FilmStrip label="Project frames" frames={[\n  { id: "first", label: "Observe", thumbnail: <img src="/thumb.webp" alt="" />, media: <img src="/frame.webp" alt="Project sketch" /> }\n]} />\n<BeforeAfterSlider label="Compare" beforeLabel="Original" afterLabel="Revised" before={beforeImage} after={afterImage} />`}</code>
          </pre>
        </section>
      </main>
      <footer className="site-footer">Motion Kit / Media documentation</footer>
    </div>
  );
}
