"use client";
import { useState } from "react";
import {
  HoverCard,
  TiltCard,
  SpotlightCard,
  GlowCard,
  ThreeDCard,
  FloatingCard,
  PerspectiveCard,
  ExpandableCard,
  HoverRevealCard,
  MorphingCard,
  ParallaxCard,
  StackCard,
} from "@personal/motion-kit/cards";
const surfaces = {
  HoverCard,
  TiltCard,
  SpotlightCard,
  GlowCard,
  ThreeDCard,
  FloatingCard,
  PerspectiveCard,
  ParallaxCard,
  StackCard,
};
export function CardDemo() {
  const [active, setActive] = useState(false);
  return (
    <div className="token-grid demo-grid">
      {Object.entries(surfaces).map(([name, Component]) => (
        <Component key={name}>
          <h3>{name}</h3>
          <p>A composed surface with a quiet response.</p>
          <a href="#reference">Read {name} reference</a>
          {name === "ParallaxCard" && (
            <label className="card-note">
              Keep a note
              <input aria-label="Parallax note" defaultValue="" />
            </label>
          )}
        </Component>
      ))}
      <MorphingCard active={active}>
        <h3>MorphingCard</h3>
        <p>A controlled change of contour.</p>
        <button type="button" aria-pressed={active} onClick={() => setActive(!active)}>
          Change contour
        </button>
      </MorphingCard>
      <ExpandableCard summary="ExpandableCard">
        <p>A native disclosure for additional detail.</p>
        <a href="#reference">Expanded reference</a>
      </ExpandableCard>
      <HoverRevealCard summary="HoverRevealCard">
        <p>An explicit reveal with a pointer hint.</p>
        <a href="#reference">Revealed reference</a>
      </HoverRevealCard>
    </div>
  );
}
