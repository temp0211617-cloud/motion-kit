"use client";
import { useState } from "react";
import { useHydrated } from "../useHydrated";
import {
  DragCarousel,
  MomentumCarousel,
  InfiniteCarousel,
  SnapCarousel,
  FilmStrip,
  MediaRail,
  HoverMediaPreview,
  ImageReveal,
  ImageTilt,
  BeforeAfterSlider,
  VideoHoverPreview,
  AnimatedGallery,
} from "@personal/motion-kit/media";
import { MotionProvider } from "@personal/motion-kit/provider";
const titles = ["Observe", "Compose", "Respond", "Refine", "Frame", "Measure", "Resolve", "Rest"];
const frames = titles.map((label, index) => ({
  id: `frame-${index}`,
  label,
  thumbnail: (
    <img
      className="media-image"
      src="/ticker-frame.svg"
      alt=""
      width={160}
      height={96}
      loading="lazy"
    />
  ),
  media: (
    <ImageReveal
      src="/ticker-frame.svg"
      alt={`Geometric study for ${label.toLowerCase()}`}
      width={400}
      height={240}
      caption={`${String(index + 1).padStart(2, "0")} / ${label}`}
    />
  ),
}));
const carousels = { DragCarousel, MomentumCarousel, InfiniteCarousel, SnapCarousel };
export function MediaDemo() {
  const ready = useHydrated();
  const [reduce, setReduce] = useState(false),
    [hover, setHover] = useState(false),
    [reverse, setReverse] = useState(false);
  const gallery = reverse ? frames.slice(0, 3).reverse() : frames.slice(0, 3);
  return (
    <MotionProvider reducedMotion={reduce ? "always" : "user"}>
      <div className="controls" data-media-ready={ready}>
        <label className="check">
          <input
            type="checkbox"
            checked={reduce}
            onChange={(event) => setReduce(event.target.checked)}
          />
          Reduce media motion
        </label>
      </div>
      <section className="section">
        <h2>Frame by frame</h2>
        <div className="panel token-panel">
          <h3>FilmStrip</h3>
          <FilmStrip label="Studio film" frames={frames} edgeFade />
        </div>
      </section>
      <section className="section">
        <h2>Move through a collection</h2>
        {Object.entries(carousels).map(([name, Component]) => (
          <article className="panel token-panel demo-grid" key={name}>
            <h3>{name}</h3>
            <Component label={name}>
              {frames.slice(0, 3).map((frame) => (
                <div key={frame.id}>{frame.media}</div>
              ))}
            </Component>
          </article>
        ))}
      </section>
      <section className="section">
        <h2>A native rail</h2>
        <h3>MediaRail</h3>
        <MediaRail label="Native media rail">
          {frames.slice(0, 4).map((frame) => (
            <div key={frame.id}>{frame.media}</div>
          ))}
        </MediaRail>
      </section>
      <section className="section">
        <h2>Compare a change</h2>
        <h3>BeforeAfterSlider</h3>
        <BeforeAfterSlider
          label="Compare geometric studies"
          beforeLabel="Original olive frame"
          afterLabel="Accent frame"
          before={
            <img className="media-image" src="/ticker-frame.svg" alt="" width={400} height={240} />
          }
          after={
            <img className="media-image" src="/media-accent.svg" alt="" width={400} height={240} />
          }
        />
      </section>
      <section className="section">
        <h2>Look closer</h2>
        <div className="token-grid">
          <article className="panel token-panel">
            <h3>ImageReveal</h3>
            <ImageReveal
              src="/ticker-frame.svg"
              alt="An olive circle within a geometric frame"
              width={400}
              height={240}
              caption="A restrained entrance."
            />
          </article>
          <article className="panel token-panel">
            <h3>ImageTilt</h3>
            <ImageTilt
              src="/media-accent.svg"
              alt="A pale frame across an olive background"
              width={400}
              height={240}
              caption="Mouse depth, flat touch fallback."
            />
          </article>
          <article className="panel token-panel">
            <h3>HoverMediaPreview</h3>
            <HoverMediaPreview
              label="Preview a studio frame"
              preview={
                <div>
                  <ImageReveal
                    src="/ticker-frame.svg"
                    alt="The studio frame preview"
                    width={400}
                    height={240}
                  />
                  <a href="#reference">Preview reference</a>
                </div>
              }
            >
              View studio frame
            </HoverMediaPreview>
          </article>
        </div>
      </section>
      <section className="section">
        <h2>A controlled preview</h2>
        <h3>VideoHoverPreview</h3>
        <label className="check">
          <input
            type="checkbox"
            checked={hover}
            onChange={(event) => setHover(event.target.checked)}
          />
          Enable hover video preview
        </label>
        <div className="video-demo">
          <VideoHoverPreview
            src="/media-preview.webm"
            poster="/ticker-frame.svg"
            captionSrc="/media-preview.vtt"
            label="Silent studio video"
            hoverPlay={hover}
          />
        </div>
        <p className="caption">
          Silent local study with captions. Hover previews are optional and stop within4.5 seconds;
          native controls remain available.
        </p>
      </section>
      <section className="section">
        <h2>A changing gallery</h2>
        <h3>AnimatedGallery</h3>
        <button type="button" aria-pressed={reverse} onClick={() => setReverse(!reverse)}>
          Reverse gallery order
        </button>
        <div className="demo-grid">
          <AnimatedGallery>
            {gallery.map((frame) => (
              <figure key={frame.id} style={{ margin: 0 }}>
                <img
                  className="media-image"
                  src="/ticker-frame.svg"
                  alt={`Gallery study: ${frame.label}`}
                  width={400}
                  height={240}
                  loading="lazy"
                />
                <figcaption>{frame.label}</figcaption>
              </figure>
            ))}
          </AnimatedGallery>
        </div>
      </section>
    </MotionProvider>
  );
}
