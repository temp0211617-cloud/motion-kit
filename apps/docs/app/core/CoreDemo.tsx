"use client";

import { useState } from "react";
import {
  FadeUp,
  FadeIn,
  FadeLeft,
  FadeRight,
  FadeDown,
  ScaleIn,
  ScaleFade,
  SlideIn,
  ScrollReveal,
  Stagger,
  StaggerItem,
  Presence,
  PageTransition,
  MotionGroup,
  Reveal,
} from "@personal/motion-kit/core";
import { MotionProvider } from "@personal/motion-kit/provider";

const entrances = {
  FadeIn,
  FadeUp,
  FadeDown,
  FadeLeft,
  FadeRight,
  ScaleIn,
  ScaleFade,
  SlideIn,
  Reveal,
};
export function CoreDemo() {
  const [replay, setReplay] = useState(0);
  const [show, setShow] = useState(true);
  const [page, setPage] = useState(1);
  const [reduce, setReduce] = useState(false);
  return (
    <MotionProvider reducedMotion={reduce ? "always" : "user"}>
      <div className="controls">
        <button type="button" onClick={() => setReplay((value) => value + 1)}>
          Replay core demos
        </button>
        <label className="check">
          <input
            type="checkbox"
            checked={reduce}
            onChange={(event) => setReduce(event.target.checked)}
          />
          Reduce core motion
        </label>
      </div>
      <h2 className="demo-grid">Entrance primitives</h2>
      <div className="token-grid demo-grid" key={replay}>
        {Object.entries(entrances).map(([name, Component]) => (
          <article className="panel token-panel demo-tile" key={name}>
            <h3>{name}</h3>
            <Component>
              <div className="demo-block">Move with purpose.</div>
            </Component>
          </article>
        ))}
      </div>
      <section className="section" aria-labelledby="stagger-title">
        <h2 id="stagger-title">Stagger / StaggerItem</h2>
        <p>Explicit indexes preserve timing through sorting and conditional children.</p>
        <Stagger key={replay}>
          <div className="token-grid">
            {[0, 1, 2].map((index) => (
              <StaggerItem index={index} key={index}>
                <div className="panel token-panel">Chapter {index + 1}</div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>
      <section className="section" aria-labelledby="presence-title">
        <h2 id="presence-title">Presence</h2>
        <button
          type="button"
          aria-expanded={show}
          aria-controls="presence-demo"
          onClick={() => setShow((value) => !value)}
        >
          Toggle presence
        </button>
        <div id="presence-demo" className="demo-space">
          <Presence show={show}>
            <div className="panel token-panel">
              <p>Exiting content leaves the keyboard and accessibility tree immediately.</p>
              <button type="button">Present action</button>
            </div>
          </Presence>
        </div>
      </section>
      <section className="section" aria-labelledby="page-title">
        <h2 id="page-title">PageTransition / MotionGroup</h2>
        <button type="button" onClick={() => setPage((value) => (value === 1 ? 2 : 1))}>
          Next chapter
        </button>
        <div className="demo-space">
          <MotionGroup id="core-chapters">
            <PageTransition transitionKey={String(page)}>
              <div className="panel token-panel">
                <h3>Chapter {page}</h3>
                <p>The next chapter follows the previous exit.</p>
              </div>
            </PageTransition>
          </MotionGroup>
        </div>
      </section>
      <section className="section" aria-labelledby="scroll-title">
        <h2 id="scroll-title">ScrollReveal</h2>
        <ScrollReveal key={replay} data-testid="viewport-demo">
          <div className="panel token-panel">
            <h3>A reveal on arrival.</h3>
            <p>One observer, one entrance. Keyboard focus reveals content immediately.</p>
            <button type="button">Viewport action</button>
          </div>
        </ScrollReveal>
      </section>
    </MotionProvider>
  );
}
