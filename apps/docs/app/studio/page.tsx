import { Studio } from "./Studio";
export default function StudioPage() {
  return (
    <div className="shell">
      <main id="main" tabIndex={-1}>
        <section className="tool-intro">
          <p className="eyebrow">MOTION KIT / STUDIO</p>
          <h1>
            Your motion.
            <br />
            <em>Your direction.</em>
          </h1>
          <p className="lede">
            Compose a scene, shape each layer and scrub through time. Export a project or take the
            React code with you.
          </p>
        </section>
        <Studio />
      </main>
    </div>
  );
}
