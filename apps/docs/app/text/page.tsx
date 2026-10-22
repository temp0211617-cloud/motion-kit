import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { textMetadata } from "@personal/motion-kit/text/metadata";
import { TextDemo } from "./TextDemo";

export default function TextPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">03 / Words before effects</p>
          <h1>Text in motion</h1>
          <p className="lede">
            Short display moments with a complete reading experience. Preserve the sentence, then
            choose its tempo.
          </p>
        </section>
        <TextDemo />
        <section id="reference" className="section">
          <h2>Text reference</h2>
          <p>
            Import from <code>@personal/motion-kit/text</code> within MotionProvider. Text children
            are strings; numeric components accept value/from/decimals/locale. Use effects for short
            headings and counters; keep long prose and critical instructions static.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Text component reference"
          >
            <table>
              <caption>
                Complete screen-reader content · visible SSR · reduced-motion fallback
              </caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Props / cost / notes</th>
                </tr>
              </thead>
              <tbody>
                {textMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.performance} ·{" "}
                      {item.name === "LineReveal"
                        ? "Explicit newline-delimited text; fluid reflow remains within authored lines."
                        : item.name === "SplitText"
                          ? "by: words/characters/lines; effect: rise/fade/blur/mask; children, className."
                          : item.name === "AnimatedNumber" || item.name === "NumberTicker"
                            ? "value required; optional from, decimals (0–20), locale (en-US), className. Invalid numbers fall back to zero; NumberTicker starts from zero."
                            : item.name === "Typewriter" || item.name === "ScrambleText"
                              ? "children, className, duration (2s; clamped to 4s). Full text remains accessible throughout."
                              : item.name === "TextTicker" || item.name === "ScrollVelocityText"
                                ? "children, className, autoplay (false); TextTicker speed (40px/s). Built-in pause/play, hover/focus pause, offscreen suspension. Reduced motion wraps a static copy."
                                : "children, className; provider tempo and OS preference. Rolling/Flip animate changed text; Shimmer performs one brief opacity pulse."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Splitting is capped at 128 segments. Character reveals preserve grapheme clusters; use
            word reveals for joining scripts and ligatures. Blur stays modest and is intended for
            short labels. Readers receive one complete string; visual copies are hidden from
            assistive technology. Numbers do not announce animation frames. Tickers start paused and
            provide controls for any continuous movement.
          </p>
          <pre tabIndex={0} role="region" aria-label="Text usage example">
            <code>{`import { WordReveal, AnimatedNumber } from "@personal/motion-kit/text";\n\n<WordReveal>A considered pace.</WordReveal>\n<AnimatedNumber value={2480} decimals={0} locale="en-US" />`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Text documentation</footer>
    </div>
  );
}
