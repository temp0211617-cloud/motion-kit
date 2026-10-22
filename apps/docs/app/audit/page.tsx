import { FeaturePreview } from "../signature/FeaturePreview";
import Link from "next/link";
import { StressDemo } from "./StressDemo";
export default function AuditPage() {
  return (
    <div className="shell">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Motion Kit</Link>
        <span aria-hidden="true"> / </span>
        <span>Component documentation</span>
      </nav>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <p className="eyebrow">14 / Content under pressure</p>
          <h1>A demanding layout.</h1>
          <p className="lede">
            Long labels and reading content help check how a composition behaves at smaller sizes.
          </p>
        </section>
        <StressDemo />
        <FeaturePreview standalone />
      </main>
      <footer className="site-footer">Motion Kit / Responsive fixtures</footer>
    </div>
  );
}
