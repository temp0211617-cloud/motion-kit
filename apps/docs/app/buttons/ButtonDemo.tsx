"use client";

import { useState } from "react";
import {
  MotionButton,
  MagneticButton,
  ElasticButton,
  GlowButton,
  SpotlightButton,
  RippleButton,
  IconMotionButton,
  ArrowLink,
  UnderlineLink,
  HoverShiftLink,
  MorphingButton,
  LoadingButton,
} from "@personal/motion-kit/interactions";
import { MotionProvider } from "@personal/motion-kit/provider";

const buttons = {
  MotionButton,
  MagneticButton,
  ElasticButton,
  GlowButton,
  SpotlightButton,
  RippleButton,
};
export function ButtonDemo() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shape, setShape] = useState(false);
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
          Reduce button motion
        </label>
        <p role="status" className="caption">
          Activated {count} times
        </p>
      </div>
      <h2 className="demo-grid">A clear invitation.</h2>
      <div className="token-grid demo-grid">
        {Object.entries(buttons).map(([name, Component]) => (
          <article className="panel token-panel" key={name}>
            <h3>{name}</h3>
            <Component onClick={() => setCount((value) => value + 1)}>
              {name === "MotionButton" ? "Activate action" : "Try interaction"}
            </Component>
          </article>
        ))}
        <article className="panel token-panel">
          <h3>IconMotionButton</h3>
          <IconMotionButton label="Add item" onClick={() => setCount((value) => value + 1)}>
            +
          </IconMotionButton>
        </article>
        <article className="panel token-panel">
          <h3>MorphingButton</h3>
          <MorphingButton
            active={shape}
            aria-pressed={shape}
            onClick={() => setShape((value) => !value)}
          >
            Change shape
          </MorphingButton>
        </article>
        <article className="panel token-panel">
          <h3>LoadingButton</h3>
          <LoadingButton loading={loading} onClick={() => setCount((value) => value + 1)}>
            Save draft
          </LoadingButton>
          <p className="demo-space">
            <button
              type="button"
              aria-pressed={loading}
              onClick={() => setLoading((value) => !value)}
            >
              Toggle loading state
            </button>
          </p>
        </article>
        <article className="panel token-panel">
          <h3>ArrowLink</h3>
          <ArrowLink href="#reference">Read the reference</ArrowLink>
        </article>
        <article className="panel token-panel">
          <h3>UnderlineLink</h3>
          <UnderlineLink href="#reference">Explore the API</UnderlineLink>
        </article>
        <article className="panel token-panel">
          <h3>HoverShiftLink</h3>
          <HoverShiftLink href="#reference">A small invitation</HoverShiftLink>
        </article>
      </div>
    </MotionProvider>
  );
}
