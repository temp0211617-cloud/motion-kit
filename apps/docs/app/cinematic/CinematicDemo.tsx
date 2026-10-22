"use client";
import { useState } from "react";
import { MotionProvider } from "@personal/motion-kit/provider";
import {
  HeroParallax,
  PerspectiveHero,
  FloatingHeroObjects,
  SpotlightHero,
  MaskReveal,
  ImageMaskReveal,
  Curtains,
  IrisReveal,
  WipeReveal,
  SplitScreenReveal,
  LayeredParallax,
  CinematicGallery,
  ZoomScene,
  DepthSection,
  PerspectiveScroller,
} from "@personal/motion-kit/cinematic";
function Study({ name }: { name: string }) {
  return (
    <div className="cinematic-study">
      <img
        className="media-image"
        src="/ticker-frame.svg"
        alt={`Geometric study for ${name}`}
        width={400}
        height={240}
      />
      <h3>{name}</h3>
      <p>Space, depth, and a clear place to read.</p>
    </div>
  );
}
export function CinematicDemo() {
  const [reduced, setReduced] = useState(false),
    [replay, setReplay] = useState(0);
  return (
    <MotionProvider preset="cinematic" reducedMotion={reduced ? "always" : "user"}>
      <label className="cinematic-control">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(event) => setReduced(event.target.checked)}
        />
        Reduce cinematic motion
      </label>
      <section className="section" aria-labelledby="curtain-heading">
        <div className="section-heading">
          <p className="eyebrow">10 / A quiet opening</p>
          <h2 id="curtain-heading">Curtains</h2>
          <p>Two panels reveal one persistent scene. Keyboard focus opens it immediately.</p>
        </div>
        <button type="button" onClick={() => setReplay((value) => value + 1)}>
          Replay Curtains
        </button>
        <Curtains className="curtain-stage" replayKey={replay}>
          <div className="panel cinematic-feature">
            <img
              className="media-image"
              src="/media-accent.svg"
              alt="An abstract architectural frame"
              width={400}
              height={240}
            />
            <div>
              <p className="eyebrow">01 / The opening frame</p>
              <h3>Let the scene breathe.</h3>
              <p>A finite entrance gives way to a useful, readable interface.</p>
              <a href="#reference">Explore the Curtains API</a>
              <label className="card-note">
                Scene draft
                <input placeholder="Keep your idea here" />
              </label>
            </div>
          </div>
        </Curtains>
      </section>
      <section className="section" aria-labelledby="hero-heading">
        <div className="section-heading">
          <h2 id="hero-heading">Hero compositions</h2>
          <p>Desktop depth stays bounded; small screens retain a natural reading flow.</p>
        </div>
        <div className="demo-grid">
          <HeroParallax className="panel">
            <Study name="HeroParallax" />
          </HeroParallax>
          <PerspectiveHero className="panel">
            <Study name="PerspectiveHero" />
          </PerspectiveHero>
          <FloatingHeroObjects
            className="panel"
            objects={[
              <span key="ring" className="hero-object" />,
              <span key="disc" className="hero-object hero-object-disc" />,
            ]}
          >
            <div className="cinematic-copy">
              <h3>FloatingHeroObjects</h3>
              <p>A short, decorative drift. One clear foreground.</p>
            </div>
          </FloatingHeroObjects>
          <SpotlightHero className="panel">
            <div className="cinematic-copy">
              <h3>SpotlightHero</h3>
              <p>A subtle mouse light follows cached pointer geometry.</p>
              <a href="#reference">Read the hero contract</a>
            </div>
          </SpotlightHero>
        </div>
      </section>
      <section className="section" aria-labelledby="reveal-heading">
        <div className="section-heading">
          <h2 id="reveal-heading">A change of frame</h2>
          <p>Masks reveal once in view. Focus and reduced motion finish the scene.</p>
        </div>
        <div className="demo-grid">
          <MaskReveal className="panel">
            <Study name="MaskReveal" />
          </MaskReveal>
          <IrisReveal className="panel">
            <Study name="IrisReveal" />
          </IrisReveal>
          <WipeReveal className="panel">
            <Study name="WipeReveal" />
          </WipeReveal>
          <SplitScreenReveal className="panel">
            <Study name="SplitScreenReveal" />
          </SplitScreenReveal>
          <div className="panel cinematic-image-panel">
            <h3>ImageMaskReveal</h3>
            <ImageMaskReveal
              src="/media-accent.svg"
              alt="Offset lime arcs in a geometric frame"
              width={400}
              height={240}
              caption="One accessible image, with a finite mask."
            />
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="scene-heading">
        <div className="section-heading">
          <h2 id="scene-heading">Depth in the reading flow</h2>
          <p>Scroll controllers start in view and disconnect when static.</p>
        </div>
        <div className="demo-grid">
          <ZoomScene className="panel">
            <Study name="ZoomScene" />
          </ZoomScene>
          <DepthSection className="panel">
            <div className="cinematic-copy">
              <h3>DepthSection</h3>
              <p>A small scale change supports a considered pause.</p>
              <label className="card-note">
                Depth draft
                <input placeholder="A persistent note" />
              </label>
            </div>
          </DepthSection>
          <PerspectiveScroller className="panel">
            <Study name="PerspectiveScroller" />
          </PerspectiveScroller>
          <LayeredParallax
            className="panel"
            background={
              <img
                className="media-image"
                src="/media-accent.svg"
                alt=""
                width={400}
                height={240}
              />
            }
          >
            <div className="cinematic-copy">
              <h3 className="layer-copy">LayeredParallax</h3>
              <p className="layer-copy">
                Two bounded layers. Decorative background, readable foreground.
              </p>
            </div>
          </LayeredParallax>
        </div>
      </section>
      <section className="section" aria-labelledby="gallery-heading">
        <div className="section-heading">
          <h2 id="gallery-heading">CinematicGallery</h2>
          <p>Keyed images stay in the document. Each scene initializes only as needed.</p>
        </div>
        <CinematicGallery>
          {["Observe", "Compose", "Respond"].map((name) => (
            <figure className="panel cinematic-gallery-item" key={name}>
              <img
                className="media-image"
                src="/media-accent.svg"
                alt={`Cinematic geometric study: ${name}`}
                width={400}
                height={240}
              />
              <figcaption>{name}</figcaption>
            </figure>
          ))}
        </CinematicGallery>
      </section>
    </MotionProvider>
  );
}
