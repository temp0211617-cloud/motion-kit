import { Examples } from "./Examples";
export default function ExamplesPage() {
  return (
    <div className="shell">
      <main id="main" tabIndex={-1}>
        <section className="playground-intro">
          <p className="eyebrow">THE INTERACTION COLLECTION · 04 STUDIES</p>
          <h1>
            Small details.
            <br />
            <em>Big feeling.</em>
          </h1>
          <p className="lede">
            An evolving collection of complete interfaces. Move, drag, switch and explore—these are
            live examples, ready to take apart.
          </p>
          <nav className="example-index" aria-label="Examples on this page">
            <a href="#trail">01 Cursor trail</a>
            <a href="#ticker-study">02 Live ticker</a>
            <a href="#transitions">03 Page transitions</a>
            <a href="#grid-study">04 Gallery grid</a>
          </nav>
        </section>
        <Examples />
      </main>
    </div>
  );
}
