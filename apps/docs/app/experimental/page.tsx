import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { experimentalMetadata } from "@personal/motion-kit/experimental/metadata";
import { ExperimentalDemo } from "./ExperimentalDemo";
export default function ExperimentalPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">12 / Optional expression</p>
          <h1>A little curiosity.</h1>
          <p className="lede">
            Optional pointer and texture accents, kept small, finite, and easy to leave behind.
          </p>
        </section>
        <ExperimentalDemo />
        <section className="section" id="reference">
          <h2>Experimental reference</h2>
          <p>
            Import from <code>@personal/motion-kit/experimental</code> inside MotionProvider. These
            optional patterns remain experimental through the release; use them where a static
            fallback is appropriate.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Experimental component reference"
          >
            <table>
              <caption>Bounded decoration · native cursor · finite fields</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">API / behavior</th>
                </tr>
              </thead>
              <tbody>
                {experimentalMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.performance} ·{" "}
                      {item.name === "ImageTrail"
                        ? "children, src; optional className. Safe decorative image source; four inert spring followers load on mouse entry, disappear on focus/leave/reduction. Supply important imagery separately with meaningful alt text."
                        : [
                              "AuroraBackground",
                              "AnimatedGrid",
                              "ParticleField",
                              "NoiseField",
                              "MeshGradient",
                              "LiquidReveal",
                            ].includes(item.name)
                          ? "children; optional className/replayKey. Finite1.8s field pulse or0.9s liquid reveal, once in view; replay preserves child state. Particle count1–48 (default24), deterministic positions. Noise filter mounts only in view; static CSS fallback on reduction/missing observers. Liquid focus completes its mask."
                          : item.name === "DistortionHover"
                            ? "children, optional className. Cached mouse tilt drives bounded skew; focus/touch/reduced motion stay flat."
                            : "children, optional className. Mouse-only surface coordinates, cached bounds and MotionValues. Trail capped6; follower1; physics uses heavier damping. No native cursor replacement; decoration disappears on focus/leave/reduction."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Decorative layers are inert, hidden from accessibility and clipped independently of
            content. Continuous pointer coordinates do not update React state; trail mounting
            changes only at entry/exit. Spring subscriptions release on unmount. Fields stop when
            offscreen or reduced, and never run an indefinite background loop. A changed replayKey
            while offscreen replays at the next view.
          </p>
          <p>
            Keep scenes modest. Radial gradients, skew, masks and SVG turbulence can paint; these
            accents do not require WebGL, Three or GSAP. Reading content stays visible in server
            HTML. Pointer decoration is absent on touch and reduced motion; important interactions
            remain native.
          </p>
          <pre tabIndex={0} role="region" aria-label="Experimental field usage">
            <code>{`import { ParticleField } from "@personal/motion-kit/experimental";\n\n<ParticleField count={24} replayKey={revision}>\n  <section><h2>A quieter field</h2><p>Readable content.</p></section>\n</ParticleField>`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Experimental documentation</footer>
    </div>
  );
}
