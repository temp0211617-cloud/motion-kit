import Link from "next/link";
import { StressDemo } from "./StressDemo";
export default function AuditPage() {
  return (
    <div className="shell">
      <header className="site-header">
        <Link href="/" className="wordmark">
          MK<span className="caption">Layout reference</span>
        </Link>
        <nav aria-label="Documentation">
          <Link href="/navigation">Navigation</Link>
          <Link href="/editorial">Editorial</Link>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">14 / Content under pressure</p>
          <h1>A demanding layout.</h1>
          <p className="lede">
            Long labels and reading content help check how a composition behaves at smaller sizes.
          </p>
        </section>
        <StressDemo />
      </main>
      <footer className="site-footer">Motion Kit / Responsive fixtures</footer>
    </div>
  );
}
