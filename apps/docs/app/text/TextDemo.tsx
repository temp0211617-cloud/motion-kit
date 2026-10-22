"use client";

import { useState } from "react";
import {
  SplitText,
  WordReveal,
  CharacterReveal,
  LineReveal,
  BlurText,
  ScrambleText,
  Typewriter,
  GradientText,
  ShimmerText,
  RollingText,
  FlipText,
  MaskedTextReveal,
  TextTicker,
  ScrollVelocityText,
  NumberTicker,
  AnimatedNumber,
} from "@personal/motion-kit/text";
import { MotionProvider } from "@personal/motion-kit/provider";

const samples = {
  SplitText,
  WordReveal,
  CharacterReveal,
  LineReveal,
  BlurText,
  ScrambleText,
  Typewriter,
  GradientText,
  ShimmerText,
  MaskedTextReveal,
};
export function TextDemo() {
  const [replay, setReplay] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [chapter, setChapter] = useState(false);
  const [number, setNumber] = useState(1200);
  return (
    <MotionProvider reducedMotion={reduce ? "always" : "user"}>
      <div className="controls">
        <button type="button" onClick={() => setReplay((value) => value + 1)}>
          Replay text demos
        </button>
        <label className="check">
          <input
            type="checkbox"
            checked={reduce}
            onChange={(event) => setReduce(event.target.checked)}
          />
          Reduce text motion
        </label>
      </div>
      <h2 className="demo-grid">Reveal a thought.</h2>
      <div className="token-grid demo-grid" key={replay}>
        {Object.entries(samples).map(([name, Component]) => (
          <article className="panel token-panel" key={name}>
            <h3>{name}</h3>
            <p className="type-sample">
              <Component>
                {name === "LineReveal"
                  ? "A clear thought.\nA considered pace."
                  : "A considered pace."}
              </Component>
            </p>
          </article>
        ))}
      </div>
      <section className="section">
        <h2>RollingText / FlipText</h2>
        <button type="button" onClick={() => setChapter((value) => !value)}>
          Change text
        </button>
        <p className="type-sample demo-space">
          <RollingText>{chapter ? "The next idea." : "The first idea."}</RollingText> /{" "}
          <FlipText>{chapter ? "Chapter two" : "Chapter one"}</FlipText>
        </p>
      </section>
      <section className="section">
        <h2>AnimatedNumber / NumberTicker</h2>
        <button type="button" onClick={() => setNumber((value) => (value === 1200 ? 2480 : 1200))}>
          Update value
        </button>
        <p className="type-sample demo-space">
          <AnimatedNumber value={number} /> / <NumberTicker value={number} />
        </p>
      </section>
      <section className="section">
        <h2>TextTicker</h2>
        <TextTicker className="panel token-panel">Movement should serve the message.</TextTicker>
      </section>
      <section className="section">
        <h2>ScrollVelocityText</h2>
        <ScrollVelocityText className="panel token-panel">
          A measured pace, shaped by the reader.
        </ScrollVelocityText>
      </section>
    </MotionProvider>
  );
}
