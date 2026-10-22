"use client";
import { useState } from "react";
import { MotionProvider } from "@personal/motion-kit/provider";
import {
  Pressable,
  HoverScale,
  HoverLift,
  HoverMagnet,
  CursorAttract,
  TiltSurface,
  FollowPointer,
  DragSurface,
  ElasticDrag,
  SwipeAction,
  LongPressMotion,
} from "@personal/motion-kit/gestures";
const surfaces = [
  { name: "HoverScale", Component: HoverScale },
  { name: "HoverLift", Component: HoverLift },
  { name: "HoverMagnet", Component: HoverMagnet },
  { name: "CursorAttract", Component: CursorAttract },
  { name: "TiltSurface", Component: TiltSurface },
  { name: "FollowPointer", Component: FollowPointer },
];
export function GestureDemo() {
  const [reduced, setReduced] = useState(false),
    [disabled, setDisabled] = useState(false),
    [marks, setMarks] = useState(0),
    [holds, setHolds] = useState(0),
    [swipes, setSwipes] = useState(0);
  return (
    <MotionProvider reducedMotion={reduced ? "always" : "user"}>
      <div className="controls">
        <label className="check">
          <input
            type="checkbox"
            checked={reduced}
            onChange={(event) => setReduced(event.target.checked)}
          />
          Reduce interaction motion
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(event) => setDisabled(event.target.checked)}
          />
          Disable interaction effects
        </label>
      </div>
      <section className="section">
        <h2>Direct feedback</h2>
        <Pressable disabled={disabled} onClick={() => setMarks((value) => value + 1)}>
          Mark study
        </Pressable>
        <output className="demo-output" aria-live="polite">
          Press marks: {marks}
        </output>
      </section>
      <section className="section">
        <h2>Local surfaces</h2>
        <div className="token-grid">
          {surfaces.map(({ name, Component }) => (
            <Component key={name} disabled={disabled}>
              <article className="panel token-panel">
                <h3>{name}</h3>
                <p>Move nearby. Focus stays still.</p>
                <label className="card-note">
                  {name} draft
                  <input aria-label={`${name} draft`} defaultValue="" />
                </label>
                <a href="#reference">Read {name}</a>
              </article>
            </Component>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Bounded movement</h2>
        <div className="token-grid">
          <DragSurface label="Drag study" disabled={disabled}>
            <article className="panel token-panel">
              <h3>DragSurface</h3>
              <p>Drag this background horizontally, or use the arrow controls.</p>
              <label className="card-note">
                Drag draft
                <input aria-label="Drag draft" />
              </label>
            </article>
          </DragSurface>
          <ElasticDrag label="Elastic study" disabled={disabled}>
            <article className="panel token-panel">
              <h3>ElasticDrag</h3>
              <p>A short elastic response within a bounded track.</p>
              <a href="#reference">Elastic reference</a>
            </article>
          </ElasticDrag>
        </div>
      </section>
      <section className="section">
        <h2>Optional gestures</h2>
        <SwipeAction
          label="Swipe study"
          actionLabel="Mark swipe study"
          disabled={disabled}
          onAction={() => setSwipes((value) => value + 1)}
        >
          <article className="panel token-panel">
            <h3>SwipeAction</h3>
            <p>Swipe the background or choose the action below.</p>
          </article>
        </SwipeAction>
        <output className="demo-output" aria-live="polite">
          Swipe marks: {swipes}
        </output>
        <div className="section">
          <h3>LongPressMotion</h3>
          <p>Hold for 600ms or activate directly. Release or leave to cancel a hold.</p>
          <LongPressMotion
            label="study"
            disabled={disabled}
            onLongPress={() => setHolds((value) => value + 1)}
          />
          <output className="demo-output" aria-live="polite">
            Hold marks: {holds}
          </output>
        </div>
      </section>
    </MotionProvider>
  );
}
