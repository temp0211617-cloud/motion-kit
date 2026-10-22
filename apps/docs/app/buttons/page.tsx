import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { interactionMetadata } from "@personal/motion-kit/interactions/metadata";
import { ButtonDemo } from "./ButtonDemo";
export default function ButtonsPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">04 / Purposeful feedback</p>
          <h1>Press. Respond.</h1>
          <p className="lede">
            Semantic controls, familiar keyboard behavior, and restrained feedback. Every action
            works without a pointer effect.
          </p>
        </section>
        <ButtonDemo />
        <section className="section" id="reference">
          <h2>Button reference</h2>
          <p>
            Import from <code>@personal/motion-kit/interactions</code> inside MotionProvider.
            Buttons default to type=button; set type=submit explicitly for forms. Use simple
            feedback for repeated actions; avoid pointer attraction in dense or precision workflows.
          </p>
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Button component reference"
          >
            <table>
              <caption>
                Native keyboard activation · 44px minimum target · reduced-motion fallback
              </caption>
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Props / behavior</th>
                </tr>
              </thead>
              <tbody>
                {interactionMetadata.map((item) => (
                  <tr key={item.name}>
                    <th scope="row">{item.name}</th>
                    <td>
                      {item.performance} ·{" "}
                      {item.name.endsWith("Link")
                        ? "href required; native anchor props; http/https/mailto/tel/relative targets; unsafe schemes throw. New tabs isolate opener."
                        : item.name === "IconMotionButton"
                          ? "label required and non-empty; visual children hidden from screen readers."
                          : item.name === "LoadingButton"
                            ? "loading boolean; disabled while busy, aria-busy; children remain the action label."
                            : item.name === "MorphingButton"
                              ? "active boolean animates rounded/pill radius; application controls state."
                              : item.name === "MagneticButton" || item.name === "SpotlightButton"
                                ? "Mouse-only enhancement; keyboard/touch retain a native button. Geometry measured at pointer entry; movement stays in MotionValues."
                                : "Native button props and children; disabled blocks feedback/activation; provider tempo. MotionButton effect: scale/lift/elastic/glow/shift."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Keep focus visible when styling. Ripple uses pointer location or the button center for
            keyboard activation; animations clean up when replaced. Glow/spotlight cost paint and
            suit a small number of controls. Loading is controlled by the application, with no
            hidden network request.
          </p>
          <pre tabIndex={0} role="region" aria-label="Button usage example">
            <code>{`import { MotionButton, LoadingButton } from "@personal/motion-kit/interactions";\n\n<MotionButton onClick={save}>Save</MotionButton>\n<LoadingButton loading={pending} type="submit">Save draft</LoadingButton>`}</code>
          </pre>
        </section>
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Buttons documentation</footer>
    </div>
  );
}
