import { connection } from "next/server";
import { aiConfigured } from "../../server/ai-provider";
import { AIKit } from "./AIKit";
export default async function AIKitPage() {
  await connection();
  return (
    <div className="shell">
      <main id="main" tabIndex={-1}>
        <section className="tool-intro">
          <p className="eyebrow">MOTION KIT / AI KIT</p>
          <h1>
            From a thought.
            <br />
            <em>To a feeling.</em>
          </h1>
          <p className="lede">
            Describe the movement. Turn a brief into an editable scene, inspect its settings, then
            refine it in Studio.
          </p>
        </section>
        <AIKit configured={aiConfigured()} />
      </main>
    </div>
  );
}
