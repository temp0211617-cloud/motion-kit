"use client";
import Link from "next/link";
import { useState } from "react";
import { useMotionValue } from "motion/react";
import {
  parseScene,
  promptBrief,
  sceneCode,
  sceneKey,
  sceneLength,
  starterScene,
  type Scene,
} from "../../lib/scene";
import { ScenePreview } from "../studio/ScenePreview";
import { generateScene } from "./actions";
export function AIKit({ configured }: { configured: boolean }) {
  const [brief, setBrief] = useState(
    "A calm entrance for a product launch: a violet orbit, a lime card and a small caption.",
  );
  const [access, setAccess] = useState("");
  const [scene, setScene] = useState<Scene>(starterScene);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(
    "Starter scene loaded. This is a local preset, not AI output.",
  );
  const [result, setResult] = useState("");
  const [source, setSource] = useState("LOCAL STARTER");
  const time = useMotionValue(sceneLength(scene));
  async function generate() {
    if (pending) return;
    setPending(true);
    setStatus("Generating your scene…");
    try {
      const response = await generateScene(brief, access);
      if (response.scene) {
        const next = parseScene(response.scene);
        setScene(next);
        time.set(sceneLength(next));
        setSource("AI GENERATED · VALIDATED");
        setStatus("Scene generated. Review it, then send it to Studio.");
      } else setStatus(response.error ?? "Generation unavailable.");
    } catch {
      setStatus("Connection interrupted. Your current draft is preserved.");
    } finally {
      setPending(false);
    }
  }
  const pack =
    promptBrief(brief) +
    "\n\nAccessibility: support prefers-reduced-motion, keyboard controls and visible focus. Use transform and opacity. No telemetry, arbitrary code execution or remote assets.\n\nReturn editable project JSON, not executable code.";
  return (
    <section className="ai-tool" aria-label="AI animation workspace">
      <div className="ai-workspace">
        <section className="ai-brief">
          <p className="eyebrow">01 / CREATIVE BRIEF</p>
          <h2>What should it feel like?</h2>
          <label>
            Your animation brief
            <textarea
              rows={6}
              value={brief}
              minLength={8}
              maxLength={2000}
              onChange={(e) => setBrief(e.target.value)}
              disabled={pending}
            />
          </label>
          <div className="brief-suggestions">
            {[
              "A playful staggered entrance for three product labels.",
              "A quiet fade and rise for a welcome card.",
              "A bold rotating orbit around a product launch card.",
            ].map((v) => (
              <button disabled={pending} key={v} onClick={() => setBrief(v)}>
                {v}
              </button>
            ))}
          </div>
          <p className={`provider-state ${configured ? "provider-ready" : ""}`}>
            {configured ? "● Provider configured" : "○ Provider setup required"}
          </p>
          {configured ? (
            <label>
              Workspace access code
              <input
                type="password"
                value={access}
                maxLength={128}
                autoComplete="off"
                onChange={(e) => setAccess(e.target.value)}
              />
            </label>
          ) : (
            <p className="tool-help">
              Prompt packs and project import work now. Live generation requires the local server
              configuration below.
            </p>
          )}
          <button
            disabled={!configured || pending || brief.trim().length < 8 || !access}
            onClick={generate}
          >
            {pending ? "Generating…" : "Generate with AI"}
          </button>
          <p className="tool-help">
            Only Generate sends this brief to the configured OpenAI provider. Provider usage may
            incur charges. Drafts are never sent automatically.
          </p>
        </section>
        <section className="ai-result">
          <div className="studio-canvas-meta">
            <span>02 / REVIEW YOUR SCENE</span>
            <span>{source}</span>
          </div>
          <ScenePreview scene={scene} time={time} />
          <h2>{scene.name}</h2>
          <div className="ai-layer-summary">
            {scene.layers.map((l) => (
              <div key={l.id}>
                <strong>{l.name}</strong>
                <span>
                  {l.shape} · {l.duration}s · delay {l.delay}s
                </span>
              </div>
            ))}
          </div>
          <div className="tool-actions">
            <button
              onClick={() => {
                try {
                  sessionStorage.setItem(sceneKey, JSON.stringify(scene));
                  setStatus("Draft ready. Open Studio and choose Load AI draft.");
                } catch {
                  setStatus("Storage unavailable. Copy the project JSON and import it in Studio.");
                }
              }}
            >
              Send draft to Studio
            </button>
            <Link className="header-cta" href="/studio">
              Open Studio ↗
            </Link>
          </div>
        </section>
      </div>
      <p className="tool-status" role="status">
        {status}
      </p>
      <div className="tool-export">
        <section>
          <p className="eyebrow">AGENT HANDOFF</p>
          <h2>A brief your agent can use.</h2>
          <p>
            A reusable, schema-aware prompt for your own coding assistant. No provider connection
            needed.
          </p>
          <label>
            Agent prompt pack
            <textarea rows={12} value={pack} readOnly />
          </label>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(pack);
                setStatus("Prompt pack copied.");
              } catch {
                setStatus("Select and copy the prompt text above.");
              }
            }}
          >
            Copy prompt pack
          </button>
        </section>
        <section>
          <p className="eyebrow">VALIDATED IMPORT</p>
          <h2>Bring the answer back.</h2>
          <label>
            Generated project JSON
            <textarea
              rows={8}
              value={result}
              maxLength={32000}
              onChange={(e) => setResult(e.target.value)}
            />
          </label>
          <button
            onClick={() => {
              try {
                const next = parseScene(JSON.parse(result));
                setScene(next);
                time.set(sceneLength(next));
                setSource("IMPORTED · VALIDATED");
                setStatus("Project validated. Ready for Studio.");
              } catch (e) {
                setStatus(e instanceof Error ? e.message : "Invalid project JSON.");
              }
            }}
          >
            Validate and preview
          </button>
          <details className="example-guide">
            <summary>View React export</summary>
            <label>
              React scene code
              <textarea readOnly rows={10} value={sceneCode(scene)} />
            </label>
          </details>
        </section>
      </div>
      <details className="ai-setup">
        <summary>Local provider setup</summary>
        <p>
          Create <code>apps/docs/.env.local</code> on your computer. Set{" "}
          <code>MOTION_AI_ENABLED=1</code>, <code>OPENAI_API_KEY</code>, <code>OPENAI_MODEL</code>{" "}
          to a Responses API model supporting structured outputs, and{" "}
          <code>MOTION_AI_ACCESS_CODE</code> to a private workspace passphrase. Restart the server.
          Never put these values in client variables or source control.
        </p>
        <p>
          This integration is for the local workspace at localhost:3000. It accepts one concurrent
          generation, five per minute and fifty per process per day. Public hosting requires account
          authentication and a shared rate limit store.
        </p>
        <p>
          <a
            href="https://developers.openai.com/api/docs/guides/structured-outputs"
            target="_blank"
            rel="noreferrer"
          >
            Official provider documentation ↗
          </a>
        </p>
      </details>
    </section>
  );
}
