import { SpatialGallery } from "../signature/SpatialGallery";
import { FeaturePreview } from "../signature/FeaturePreview";
import { AnimatedStats } from "../signature/AnimatedStats";
export default function ShowcasePage() {
  return (
    <div className="shell">
      <main id="main" tabIndex={-1}>
        <section className="playground-intro">
          <p className="eyebrow">THE SIGNATURE COLLECTION</p>
          <h1>
            Motion you
            <br />
            <em>can feel.</em>
          </h1>
          <p className="lede">
            Live compositions, rolling numbers, and a gallery that lives in three dimensions. Every
            interaction has a keyboard alternative.
          </p>
        </section>
        <AnimatedStats />
        <SpatialGallery />
        <FeaturePreview standalone />
      </main>
    </div>
  );
}
