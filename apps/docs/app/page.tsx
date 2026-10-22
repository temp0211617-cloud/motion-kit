import { spacingTokens, typographyTokens } from "@personal/motion-kit/tokens";
import { FoundationPreview } from "./FoundationPreview";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="shell">
      <header className="site-header">
        <a className="wordmark" href="#main">
          MK<span className="caption">Private system / Preview</span>
        </a>
        <nav aria-label="Documentation">
          <a href="#foundations">Foundations</a>
          <a href="#tokens">Tokens</a>
          <Link href="/core">Core</Link>
          <Link href="/text">Text</Link>
          <Link href="/buttons">Buttons</Link>
          <Link href="/gestures">Interactions</Link>
          <Link href="/cards">Cards</Link>
          <Link href="/scroll">Scroll</Link>
          <Link href="/ticker">Ticker</Link>
          <Link href="/media">Media</Link>
          <Link href="/editorial">Editorial</Link>
          <Link href="/cinematic">Cinematic</Link>
          <Link href="/navigation">Navigation</Link>
          <Link href="/experimental">Experimental</Link>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero" aria-labelledby="title">
          <p className="eyebrow">A considered vocabulary for movement</p>
          <h1 id="title">Motion Kit</h1>
          <p className="lede">
            Compose quieter interfaces. Shared foundations, purposeful transitions, and motion that
            respects the person using it.
          </p>
          <span className="status">Private / Reusable components and shared foundations</span>
        </section>
        <section id="foundations" aria-labelledby="foundations-title" className="section">
          <div className="section-heading">
            <p className="eyebrow">01 / Motion language</p>
            <h2 id="foundations-title">One system. Five tempos.</h2>
            <p>Use a preset to set the pace. System motion preferences apply automatically.</p>
          </div>
          <FoundationPreview />
        </section>
        <section id="tokens" aria-labelledby="tokens-title" className="section">
          <div className="section-heading">
            <p className="eyebrow">02 / Shared foundations</p>
            <h2 id="tokens-title">A consistent rhythm.</h2>
            <p>Typography, space, and surfaces share a small set of reusable values.</p>
          </div>
          <div className="token-grid">
            <article className="panel token-panel">
              <h3>Typography</h3>
              <p className="type-sample">Designed to read.</p>
              <dl>
                {["heading-md", "body-md", "label-md"].map((name) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{typographyTokens.size[name as keyof typeof typographyTokens.size]}</dd>
                  </div>
                ))}
              </dl>
            </article>
            <article className="panel token-panel">
              <h3>Spacing</h3>
              <div className="spacing-samples" aria-hidden="true">
                {[2, 4, 6, 8, 12].map((key) => (
                  <span
                    key={key}
                    style={{ width: spacingTokens[key as keyof typeof spacingTokens] }}
                  />
                ))}
              </div>
              <p className="caption">8 / 16 / 24 / 32 / 48px at the default root size</p>
              <p>Rem-based space follows the reader’s text size.</p>
            </article>
            <article className="panel token-panel">
              <h3>Accessible by default</h3>
              <p>
                Keyboard controls, visible focus, conservative server rendering, and a
                reduced-motion override.
              </p>
              <p className="caption">
                Transform & opacity · no continuous React updates · no runtime network calls
              </p>
            </article>
          </div>
        </section>
        <section className="section usage" aria-labelledby="usage-title">
          <h2 id="usage-title">Start with the provider.</h2>
          <p>Wrap a client subtree. Import tokens separately in server components.</p>
          <pre tabIndex={0} role="region" aria-label="Provider usage example">
            <code>{`import { MotionProvider } from "@personal/motion-kit/provider";\n\n<MotionProvider preset="premium" reducedMotion="user">\n  {children}\n</MotionProvider>`}</code>
          </pre>
          <p>
            Use subtle motion for repeated tasks. Avoid cinematic entrances in dense workflows.
            Reduced motion shows content immediately.
          </p>
        </section>
      </main>
      <footer className="site-footer">
        <span>Motion Kit / Private documentation</span>
        <span>Purpose before spectacle.</span>
      </footer>
    </div>
  );
}
