"use client";
import { useState } from "react";
import { useHydrated } from "../useHydrated";
import {
  LiveTicker,
  DraggableTicker,
  VerticalTicker,
  DualTicker,
  LogoTicker,
  ImageTicker,
  VelocityTicker,
  HoverPauseTicker,
  NewsTicker,
  EdgeFadeTicker,
  RulerTicker,
} from "@personal/motion-kit/ticker";
import { MotionProvider } from "@personal/motion-kit/provider";
const chips = [
  "A measured rhythm",
  "Small moments",
  "Room to breathe",
  "Movement with purpose",
].map((text, index) => (
  <span className="ticker-chip" key={text} id={index === 0 ? "ticker-first-word" : undefined}>
    {text}
  </span>
));
const plain = ["North", "Fieldwork", "Tern Studio", "Quiet Objects"].map((text) => (
  <span className="ticker-chip" key={text}>
    {text}
  </span>
));
export function TickerDemo() {
  const ready = useHydrated();
  const [reduce, setReduce] = useState(false);
  const [speed, setSpeed] = useState(40);
  return (
    <MotionProvider reducedMotion={reduce ? "always" : "user"}>
      <label className="check controls">
        <input
          type="checkbox"
          disabled={!ready}
          checked={reduce}
          onChange={(event) => setReduce(event.target.checked)}
        />
        Reduce ticker motion
      </label>
      <section className="section">
        <h2>A steady line</h2>
        <div className="panel token-panel">
          <h3>LiveTicker</h3>
          <label className="card-note">
            Speed (pixels per second)
            <input
              aria-label="Live rail speed"
              type="number"
              disabled={!ready}
              min={0}
              max={240}
              value={speed}
              onChange={(event) =>
                setSpeed(Math.max(0, Math.min(240, event.currentTarget.valueAsNumber || 0)))
              }
            />
          </label>
          <LiveTicker label="Live rail" speed={speed} pauseOnHover={false}>
            {chips}
          </LiveTicker>
        </div>
      </section>
      <section className="section">
        <h2>Take hold</h2>
        <div className="panel token-panel">
          <h3>DraggableTicker</h3>
          <DraggableTicker label="Drag rail">{plain}</DraggableTicker>
        </div>
      </section>
      <section className="section">
        <h2>A measured scale</h2>
        <div className="panel token-panel">
          <h3>RulerTicker</h3>
          <RulerTicker label="Ruler rail" />
        </div>
      </section>
      <section className="section">
        <h2>Different rhythms</h2>
        <div className="token-grid demo-grid">
          <article className="panel token-panel">
            <h3>VerticalTicker</h3>
            <VerticalTicker label="Vertical rail">{plain}</VerticalTicker>
          </article>
          <article className="panel token-panel">
            <h3>HoverPauseTicker</h3>
            <HoverPauseTicker label="Hover rail">{plain}</HoverPauseTicker>
          </article>
          <article className="panel token-panel">
            <h3>VelocityTicker</h3>
            <VelocityTicker label="Velocity rail">{plain}</VelocityTicker>
          </article>
          <article className="panel token-panel">
            <h3>EdgeFadeTicker</h3>
            <EdgeFadeTicker label="Faded rail">{plain}</EdgeFadeTicker>
          </article>
        </div>
      </section>
      <section className="section">
        <h2>Two directions</h2>
        <h3>DualTicker</h3>
        <DualTicker label="Dual rail" first={plain} second={plain.slice().reverse()} />
      </section>
      <section className="section">
        <h2>Names & frames</h2>
        <div className="panel token-panel">
          <h3>LogoTicker</h3>
          <LogoTicker label="Studio list">{plain}</LogoTicker>
        </div>
        <div className="panel token-panel demo-grid">
          <h3>ImageTicker</h3>
          <ImageTicker
            label="Image rail"
            images={[
              {
                src: "/ticker-frame.svg",
                alt: "An olive circle and geometric frame",
                width: 240,
                height: 144,
              },
              {
                src: "/ticker-frame.svg",
                alt: "A repeated geometric study",
                width: 200,
                height: 120,
              },
            ]}
          />
        </div>
      </section>
      <section className="section">
        <h2>A quiet feed</h2>
        <h3>NewsTicker</h3>
        <NewsTicker
          label="News rail"
          items={[
            "New collection / Shared surfaces",
            "Field notes / A slower pace",
            "From the studio / Readable motion",
          ]}
        />
      </section>
    </MotionProvider>
  );
}
