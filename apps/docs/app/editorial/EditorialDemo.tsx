"use client";
import { useState } from "react";
import {
  RulerScrollIndicator,
  HorizontalRuler,
  SectionCounter,
  SectionTracker,
  EditorialSlider,
  NumberedMediaRail,
  EditorialTimeline,
  ChapterIndicator,
  StoryIndex,
  MeasureScale,
  StickyChapterNav,
  ReadingProgressRail,
} from "@personal/motion-kit/editorial";
import { MotionProvider } from "@personal/motion-kit/provider";
const sections = [
  { id: "ed-observe", label: "Observe" },
  { id: "ed-compose", label: "Compose" },
  { id: "ed-respond", label: "Respond" },
];
const slides = sections.map((section, index) => ({
  id: section.id,
  title: ["A quieter frame.", "Space to compose.", "A clear response."][index] ?? section.label,
  media: (
    <img
      className="media-image"
      src={index % 2 ? "/media-accent.svg" : "/ticker-frame.svg"}
      alt={`Editorial study: ${section.label}`}
      width={400}
      height={240}
      loading="lazy"
    />
  ),
  children: (
    <>
      <p>
        Type and image share a measured rhythm. This chapter keeps its reading flow at every size.
      </p>
      <a href="#reference">Read {section.label.toLowerCase()} reference</a>
    </>
  ),
}));
export function EditorialDemo() {
  const [reduce, setReduce] = useState(false);
  return (
    <MotionProvider reducedMotion={reduce ? "always" : "user"}>
      <div className="controls">
        <label className="check">
          <input
            type="checkbox"
            checked={reduce}
            onChange={(event) => setReduce(event.target.checked)}
          />
          Reduce editorial motion
        </label>
      </div>
      <section className="section">
        <h2>EditorialSlider</h2>
        <div className="panel token-panel">
          <EditorialSlider label="Editorial stories" slides={slides} />
        </div>
      </section>
      <section className="section">
        <h2>RulerScrollIndicator</h2>
        <div className="panel token-panel">
          <RulerScrollIndicator sections={sections} label="Project ruler" />
        </div>
      </section>
      <section className="section">
        <h2>Chapters in view</h2>
        <div className="token-grid">
          <article className="panel token-panel">
            <h3>SectionCounter</h3>
            <SectionCounter sections={sections} label="Current project section" />
            <h3>ChapterIndicator</h3>
            <ChapterIndicator sections={sections} label="Current chapter" />
          </article>
          <article className="panel token-panel">
            <h3>StoryIndex</h3>
            <StoryIndex sections={sections} label="Story contents" />
          </article>
          <article className="panel token-panel">
            <h3>SectionTracker</h3>
            <SectionTracker sections={sections} label="Tracked project">
              {(state) => (
                <p>
                  Active section: <strong>{state.activeId}</strong>
                </p>
              )}
            </SectionTracker>
          </article>
        </div>
        <h3>HorizontalRuler</h3>
        <HorizontalRuler sections={sections} label="Horizontal chapters" />
      </section>
      <section className="section">
        <h2>StickyChapterNav</h2>
        <StickyChapterNav sections={sections} label="Sticky chapters" />
        <div>
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              tabIndex={-1}
              className="editorial-chapter"
              aria-labelledby={`${section.id}-title`}
            >
              <p className="eyebrow">{String(index + 1).padStart(2, "0")} / Chapter</p>
              <h3 id={`${section.id}-title`}>{section.label}</h3>
              <p className="lede">A measured chapter with room to read, navigate, and return.</p>
              <img
                className="media-image chapter-image"
                src={index % 2 ? "/media-accent.svg" : "/ticker-frame.svg"}
                alt={`Chapter study: ${section.label}`}
                width={400}
                height={240}
                loading="lazy"
              />
            </section>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>NumberedMediaRail</h2>
        <NumberedMediaRail label="Numbered studies">
          {slides.map((slide) => (
            <div key={slide.id}>{slide.media}</div>
          ))}
        </NumberedMediaRail>
      </section>
      <section className="section">
        <h2>EditorialTimeline</h2>
        <EditorialTimeline
          label="Design sequence"
          entries={sections.map((section) => ({
            id: section.id,
            label: section.label,
            children: <p>A step in a considered process.</p>,
          }))}
        />
      </section>
      <section className="section">
        <h2>MeasureScale</h2>
        <MeasureScale label="Spacing study" />
      </section>
      <section className="section">
        <h2>ReadingProgressRail</h2>
        <ReadingProgressRail label="Document reading progress" />
      </section>
    </MotionProvider>
  );
}
