import Link from "next/link";
import { cinematicMetadata } from "@personal/motion-kit/cinematic/metadata";
import { CinematicDemo } from "./CinematicDemo";
export default function CinematicPage() {
  return (
    <div className="shell">
      <header className="site-header">
        <Link href="/" className="wordmark">
          MK<span className="caption">Cinematic system</span>
        </Link>
        <nav aria-label="Documentation">
          <Link href="/editorial">Editorial</Link>
          <a href="#reference">Reference</a>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">10 / Space and depth</p>
          <h1>A scene with purpose.</h1>
          <p className="lede">
            A restrained opening, a small change of perspective, then room to read.
          </p>
        </section>
        <CinematicDemo />
        <section className="section" id="reference">
          <h2>Cinematic reference</h2>
          <p>
            Import from <code>@personal/motion-kit/cinematic</code> inside MotionProvider. Motion
            enhances visible server content. Scene children retain their state through responsive
            and motion preference changes.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Cinematic component reference"
          >
            <table>
              <caption>Finite reveals · lazy depth · composable content</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {cinematicMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.performance} ·{" "}
                      {item.name === "ImageMaskReveal"
                        ? "src, alt, positive width/height required; optional caption/className/replayKey. Safe URL schemes; lazy image loading."
                        : [
                              "Curtains",
                              "SplitScreenReveal",
                              "MaskReveal",
                              "IrisReveal",
                              "WipeReveal",
                            ].includes(item.name)
                          ? "children; optional className/replayKey. Finite0.9s reveal once in view; replayKey changes restart without remounting children. Curtains direction horizontal/vertical; SplitScreenReveal opens vertically. Focus/reduction/missing visibility support show content immediately."
                          : item.name === "FloatingHeroObjects"
                            ? "children, objects array (maximum8, decorative/inert), optional className. Finite1.8s drift; no continuous loop."
                            : item.name === "SpotlightHero"
                              ? "children, optional className; bounded mouse light, static center on touch/reduced motion."
                              : item.name === "LayeredParallax"
                                ? "children and decorative background; optional className/style. Background inert; both layers move within40px bounds."
                                : item.name === "CinematicGallery"
                                  ? "keyed children, optional className; responsive grid, lazy per-item depth; over64 items remain static."
                                  : "children, optional className/style (inner MotionStyle). Bounded desktop transform, lazy scroll controller; below1024px or600px height, reduced motion and focused descendants remain flat."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Reveals use div wrappers; choose valid HTML nesting. Mask content can briefly be
            visually covered, so avoid applying it to critical alerts. Keyboard focus completes it
            immediately. Curtains uses two inert decorative panels and never duplicates reading
            content. Clipping and radial light may paint; keep scenes modest and media
            application-owned.
          </p>
          <pre tabIndex={0} role="region" aria-label="Curtains usage">
            <code>{`import { Curtains } from "@personal/motion-kit/cinematic";\n\n<Curtains replayKey={revision}>\n  <section aria-labelledby="scene-title">\n    <h2 id="scene-title">An opening frame</h2>\n    <a href="/work">Explore work</a>\n  </section>\n</Curtains>`}</code>
          </pre>
        </section>
      </main>
      <footer className="site-footer">Motion Kit / Cinematic documentation</footer>
    </div>
  );
}
