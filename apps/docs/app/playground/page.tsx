import { MotionLab } from "./MotionLab";
export default function PlaygroundPage() {
  return (
    <div className="shell">
      <main id="main" tabIndex={-1}>
        <section className="playground-intro">
          <p className="eyebrow">THE MOTION LAB / 006 INTERACTIVE STUDIES</p>
          <h1>
            Go on.
            <br />
            <em>Play with it.</em>
          </h1>
          <p className="lede">
            Six advanced compositions. Real controls. A little more room for experimentation.
          </p>
          <p className="caption">
            These are new example compositions, separate from the 153 reusable package components.
          </p>
        </section>
        <MotionLab />
      </main>
    </div>
  );
}
