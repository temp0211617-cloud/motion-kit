"use client";
import { useState } from "react";
import { MotionProvider } from "@personal/motion-kit/provider";
import {
  CursorFollower,
  CursorTrail,
  CursorSpotlight,
  ImageTrail,
  AuroraBackground,
  AnimatedGrid,
  ParticleField,
  NoiseField,
  MeshGradient,
  DistortionHover,
  LiquidReveal,
  PhysicsFollower,
} from "@personal/motion-kit/experimental";
const pointers = [
  { name: "CursorFollower", Component: CursorFollower },
  { name: "CursorTrail", Component: CursorTrail },
  { name: "CursorSpotlight", Component: CursorSpotlight },
  { name: "PhysicsFollower", Component: PhysicsFollower },
  { name: "DistortionHover", Component: DistortionHover },
];
const fields = [
  { name: "AuroraBackground", Component: AuroraBackground },
  { name: "AnimatedGrid", Component: AnimatedGrid },
  { name: "NoiseField", Component: NoiseField },
  { name: "MeshGradient", Component: MeshGradient },
];
function PointerCopy({ name }: { name: string }) {
  const [marks, setMarks] = useState(0);
  return (
    <div className="effect-copy">
      <h3>{name}</h3>
      <p>A small visual response. The native cursor and controls stay yours.</p>
      <button type="button" onClick={() => setMarks((value) => value + 1)}>
        Mark {name}
      </button>
      <output aria-live="polite">
        {name} marks: {marks}
      </output>
    </div>
  );
}
export function ExperimentalDemo() {
  const [reduced, setReduced] = useState(false),
    [replay, setReplay] = useState(0);
  return (
    <MotionProvider reducedMotion={reduced ? "always" : "user"}>
      <label className="cinematic-control">
        <input
          type="checkbox"
          checked={reduced}
          onChange={(event) => setReduced(event.target.checked)}
        />
        Reduce experimental motion
      </label>
      <section className="section">
        <div className="section-heading">
          <h2>A pointer accent.</h2>
          <p>
            Mouse-only decoration, bounded to its surface. Keyboard and touch keep native controls.
          </p>
        </div>
        <div className="demo-grid">
          {pointers.map(({ name, Component }) => (
            <Component key={name} className={`panel effect-surface ${name.toLowerCase()}-demo`}>
              <PointerCopy name={name} />
            </Component>
          ))}
          <ImageTrail className="panel effect-surface imagetrail-demo" src="/media-accent.svg">
            <PointerCopy name="ImageTrail" />
          </ImageTrail>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>Finite fields.</h2>
          <p>One restrained pulse gives way to a static texture. No background loop.</p>
        </div>
        <button type="button" onClick={() => setReplay((value) => value + 1)}>
          Replay visual fields
        </button>
        <div className="demo-grid">
          {fields.map(({ name, Component }) => (
            <Component
              key={name}
              replayKey={replay}
              className={`panel effect-surface ${name.toLowerCase()}-demo`}
            >
              <div className="effect-copy">
                <h3>{name}</h3>
                <p>A low-opacity layer keeps the reading flow clear.</p>
              </div>
            </Component>
          ))}
          <ParticleField
            replayKey={replay}
            className="panel effect-surface particlefield-demo"
            count={24}
          >
            <div className="effect-copy">
              <h3>ParticleField</h3>
              <p>A deterministic, capped field of small points.</p>
              <label className="card-note">
                Field draft
                <input />
              </label>
            </div>
          </ParticleField>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>LiquidReveal</h2>
          <p>A finite change of shape, then a useful scene.</p>
        </div>
        <LiquidReveal className="panel effect-surface liquidreveal-demo" replayKey={replay}>
          <div className="effect-copy">
            <h3>A softer frame.</h3>
            <p>Focus completes the mask immediately; reduction keeps the content still.</p>
            <a href="#reference">Read the experimental contract</a>
            <label className="card-note">
              Liquid draft
              <input />
            </label>
          </div>
        </LiquidReveal>
      </section>
    </MotionProvider>
  );
}
