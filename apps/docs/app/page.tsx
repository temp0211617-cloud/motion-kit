import Link from "next/link";
import { FoundationPreview } from "./FoundationPreview";
import { HeroScene } from "./HeroScene";
import { ComponentCatalog } from "./ComponentCatalog";
import { categories } from "./catalog-data";
import { AnimatedStats } from "./signature/AnimatedStats";
import { SpatialGallery } from "./signature/SpatialGallery";

export default function HomePage() {
  return (
    <div className="shell showcase-shell">
      <main id="main" tabIndex={-1}>
        <section className="showcase-hero" aria-labelledby="title">
          <div className="showcase-intro">
            <p className="eyebrow">A PRIVATE COLLECTION OF MOVEMENT</p>
            <h1 id="title">
              <span className="hero-product">Motion Kit</span>Make interfaces
              <br />
              <em>feel alive.</em>
            </h1>
            <p className="lede">
              153 composable components. Twelve collections. A playground for the details that make
              an interface worth touching.
            </p>
            <div className="hero-actions">
              <Link className="action-primary" href="#catalog">
                Explore the library <span aria-hidden="true">↗</span>
              </Link>
              <Link className="action-secondary" href="/playground">
                Open playground <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <p className="hero-footnote">
              React + TypeScript · Powered by Motion · Reduced-motion aware
            </p>
          </div>
          <HeroScene />
        </section>
        <AnimatedStats />
        <SpatialGallery />
        <section className="lab-banner" aria-labelledby="lab-title">
          <div>
            <p className="eyebrow">BEYOND THE BASICS</p>
            <h2 id="lab-title">
              Less watching.
              <br />
              More playing.
            </h2>
            <p>
              Shared layouts. Spring physics. Perspective decks. SVG drawing. Scroll-linked scenes.
              Try the interaction, then change how it behaves.
            </p>
            <Link className="action-primary" href="/playground">
              Enter the motion lab <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <Link
            href="/playground"
            className="lab-banner-art"
            aria-label="Try the advanced motion playground"
          >
            <span>DRAG.</span>
            <span>SHUFFLE.</span>
            <span>REPEAT. ↗</span>
          </Link>
        </section>
        <ComponentCatalog categories={categories} />
        <section id="foundations" className="section" aria-labelledby="foundations-title">
          <div className="showcase-heading">
            <div>
              <p className="eyebrow">ONE SYSTEM / FIVE TEMPOS</p>
              <h2 id="foundations-title">Find the right feeling.</h2>
            </div>
            <p>
              Try a preset. Replay the entrance.
              <br />
              Your system motion preference always applies.
            </p>
          </div>
          <FoundationPreview />
        </section>
        <section id="tokens" className="section integration-summary">
          <p className="eyebrow">BUILT TO COMPOSE</p>
          <h2>
            Bring your design.
            <br />
            We’ll bring the movement.
          </h2>
          <p>
            Typed APIs, shared tokens, keyboard alternatives, and focused category imports. Start
            with a provider, then compose your own scene.
          </p>
          <pre tabIndex={0} role="region" aria-label="Provider usage example">
            <code>{`import { MotionProvider } from "@personal/motion-kit/provider";\nimport { FadeUp } from "@personal/motion-kit/core";\n\n<MotionProvider preset="premium">\n  <FadeUp>Your next idea.</FadeUp>\n</MotionProvider>`}</code>
          </pre>
          <p className="caption">
            Private release candidate · Chromium verified · Additional browser verification pending.
            Advanced studies are examples, separate from the 153 package APIs.
          </p>
        </section>
      </main>
      <footer className="site-footer">
        <span>motion kit / Made to move.</span>
        <Link href="/core">Read the documentation ↗</Link>
      </footer>
    </div>
  );
}
