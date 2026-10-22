import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { cardMetadata } from "@personal/motion-kit/cards/metadata";
import { CardDemo } from "./CardDemo";
export default function CardsPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">05 / Composed surfaces</p>
          <h1>Give content a home.</h1>
          <p className="lede">
            Readable cards, optional depth, and native actions. Movement follows attention.
          </p>
        </section>
        <h2>Surface studies</h2>
        <CardDemo />
        <section className="section" id="reference">
          <h2>Card reference</h2>
          <p>
            Import from <code>@personal/motion-kit/cards</code> inside MotionProvider. Cards render
            articles, with children supplying headings and actions. Pointer surfaces cache bounds at
            entry; touch keeps the flat surface. FloatingCard responds finitely to hover or focus.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Card component reference"
          >
            <table>
              <caption>Composable content · native controls · live reduced motion</caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Behavior</th>
                </tr>
              </thead>
              <tbody>
                {cardMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.performance} ·{" "}
                      {item.name === "ExpandableCard"
                        ? "summary required, defaultOpen optional; native details/summary, no modal behavior."
                        : item.name === "HoverRevealCard"
                          ? "summary required; button toggles hidden content; mouse hover offers a visual hint."
                          : item.name === "MorphingCard"
                            ? "active boolean controls radius; application owns state."
                            : item.name === "ParallaxCard"
                              ? "Scroll enhancement initializes in view; reduced motion removes the scroll listener."
                              : item.name === "StackCard"
                                ? "Two decorative layers; children rendered once."
                                : "children, className, style and semantic article attributes; bounded mouse feedback and focus support."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Tilt and depth follow mouse position. Spotlight and glow paint their surface; use them
            sparingly. Parallax moves content within its card, so leave space around interactive
            children. Preserve visible focus when customizing styles.
          </p>
          <pre tabIndex={0} role="region" aria-label="Card usage example">
            <code>{`import { HoverCard, ExpandableCard } from "@personal/motion-kit/cards";\n\n<HoverCard><h2>Project</h2><a href="/project">Explore</a></HoverCard>\n<ExpandableCard summary="More details">Supporting content</ExpandableCard>`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Cards documentation</footer>
    </div>
  );
}
