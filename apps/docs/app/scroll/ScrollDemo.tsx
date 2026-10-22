"use client";
import { useState } from "react";
import { motion, useTransform } from "motion/react";
import {
  Parallax,
  ParallaxSection,
  ScrollScale,
  ScrollRotate,
  ScrollOpacity,
  ScrollMaskReveal,
  ScrollVelocity,
  ScrollScene,
  useScrollScene,
  ScrollProgress,
  ScrollSectionProgress,
  StickyStory,
  StickyMediaStory,
  HorizontalScroll,
  ChapterScroll,
  PinnedSection,
} from "@personal/motion-kit/scroll";
import { MotionProvider } from "@personal/motion-kit/provider";
import { useMotionPreference } from "@personal/motion-kit/hooks";
const effects = {
  Parallax,
  ParallaxSection,
  ScrollScale,
  ScrollRotate,
  ScrollOpacity,
  ScrollMaskReveal,
  ScrollVelocity,
};
const chapters = [
  {
    id: "observe",
    title: "Observe",
    media: (
      <div className="story-media" data-testid="observe-media">
        <p className="eyebrow">01 / Looking closely</p>
        <p className="type-sample">A quieter frame.</p>
        <label className="card-note">
          A persistent media note
          <input aria-label="Story note" />
        </label>
      </div>
    ),
    body: (
      <>
        <p>
          Start with the person reading. The media rests alongside the chapter on a wide screen.
        </p>
        <p>
          On a narrow screen it becomes part of the reading order. Nothing depends on a pinned
          animation.
        </p>
      </>
    ),
  },
  {
    id: "compose",
    title: "Compose",
    media: (
      <div className="story-media" data-testid="compose-media">
        <p className="eyebrow">02 / Finding rhythm</p>
        <p className="type-sample">Space to read.</p>
      </div>
    ),
    body: (
      <>
        <p>Build a measured rhythm with type, spacing and a clear hierarchy.</p>
        <a href="#reference">Story API reference</a>
      </>
    ),
  },
  {
    id: "respond",
    title: "Respond",
    media: (
      <div className="story-media">
        <p className="eyebrow">03 / Giving control</p>
        <p className="type-sample">Follow attention.</p>
      </div>
    ),
    body: (
      <p>
        Chapter links use native navigation. Motion can stop immediately, while the story remains
        complete.
      </p>
    ),
  },
];
function SceneSample() {
  const progress = useScrollScene();
  const reduced = useMotionPreference();
  const scaleX = useTransform(progress, [0, 1], [0.2, 1]);
  return (
    <div className="panel token-panel">
      <h3>ScrollScene</h3>
      <p>Compose custom feedback from a shared MotionValue.</p>
      <motion.div
        aria-hidden="true"
        className="spacing-samples"
        style={{ scaleX: reduced ? 1 : scaleX, transformOrigin: "left" }}
      >
        <span style={{ width: "100%" }} />
      </motion.div>
    </div>
  );
}
export function ScrollDemo() {
  const [reduce, setReduce] = useState(false);
  return (
    <MotionProvider reducedMotion={reduce ? "always" : "user"}>
      <label className="check controls">
        <input
          type="checkbox"
          checked={reduce}
          onChange={(event) => setReduce(event.target.checked)}
        />
        Reduce scroll motion
      </label>
      <section className="section">
        <h2>Scroll-linked feedback</h2>
        <ScrollProgress />
        <div className="token-grid demo-grid">
          {Object.entries(effects).map(([name, Component]) => (
            <Component key={name}>
              <article className="panel token-panel">
                <h3>{name}</h3>
                <p>Small movement follows your own scrolling.</p>
                <a href="#reference">Focus {name} reference</a>
              </article>
            </Component>
          ))}
          <ScrollScene>
            <SceneSample />
          </ScrollScene>
        </div>
        <ScrollSectionProgress label="Short section progress">
          <article className="panel token-panel">
            <h3>ScrollSectionProgress</h3>
            <p>
              Use for sections longer than the viewport; page progress works across the whole
              document.
            </p>
          </article>
        </ScrollSectionProgress>
      </section>
      <section className="section" id="story">
        <h2>StickyStory</h2>
        <p>Three chapters, one continuous reading flow.</p>
        <StickyStory chapters={chapters} label="Story chapters" />
      </section>
      <section className="section">
        <h2>StickyMediaStory</h2>
        <StickyMediaStory
          media={
            <div className="story-media">
              <p className="type-sample">One held image.</p>
            </div>
          }
        >
          <div className="story-copy">
            <h3>A shared visual</h3>
            <p>A persistent media column alongside freeform editorial content.</p>
            <p>The application owns video playback, captions and media loading.</p>
          </div>
        </StickyMediaStory>
      </section>
      <section className="section">
        <h2>HorizontalScroll</h2>
        <HorizontalScroll label="Horizontal sample rail">
          {["First", "Second", "Third", "Fourth"].map((name) => (
            <article key={name} className="panel token-panel rail-item">
              <h3>{name}</h3>
              <a href="#reference">Explore {name.toLowerCase()} item</a>
            </article>
          ))}
        </HorizontalScroll>
      </section>
      <section className="section">
        <h2>ChapterScroll</h2>
        <ChapterScroll
          label="Compact chapters"
          chapters={[
            {
              id: "context",
              title: "Context",
              body: <p>A native anchor index without pinning.</p>,
            },
            { id: "detail", title: "Detail", body: <p>All content stays in the document.</p> },
          ]}
        />
      </section>
      <section className="section">
        <h2>PinnedSection</h2>
        <PinnedSection>
          <div className="panel token-panel">
            <h3>A held moment</h3>
            <p>CSS sticky on wide screens, natural document flow for mobile and reduced motion.</p>
          </div>
        </PinnedSection>
      </section>
    </MotionProvider>
  );
}
