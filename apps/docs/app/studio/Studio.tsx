"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import {
  colours,
  easings,
  parseScene,
  sceneCode,
  sceneKey,
  sceneLength,
  starterScene,
  type Layer,
  type Pose,
  type Scene,
} from "../../lib/scene";
import { useStageVisibility } from "../signature/useStageVisibility";
import { ScenePreview } from "./ScenePreview";
function download(text: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
const poseFields = [
  ["x", -100, 100, 1],
  ["y", -110, 110, 1],
  ["scale", 0.2, 1.5, 0.05],
  ["rotate", -180, 180, 1],
  ["opacity", 0, 1, 0.05],
] as const;
export function Studio() {
  const [scene, setScene] = useState<Scene>(starterScene);
  const [selected, setSelected] = useState("layer-2");
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("Ready. Select a layer to edit.");
  const [json, setJson] = useState("");
  const [history, setHistory] = useState<Scene[]>([]);
  const [future, setFuture] = useState<Scene[]>([]);
  const time = useMotionValue(sceneLength(scene));
  const scrub = useRef<HTMLInputElement>(null);
  const clock = useRef<HTMLOutputElement>(null);
  const reduced = useMotionPreference();
  const { ref: stageRef, visible } = useStageVisibility();
  const total = sceneLength(scene);
  const layer = scene.layers.find((l) => l.id === selected) ?? scene.layers[0]!;
  useEffect(
    () =>
      time.on("change", (value) => {
        if (scrub.current) scrub.current.value = String(value);
        if (clock.current)
          clock.current.textContent = `${value.toFixed(2)}s / ${total.toFixed(2)}s`;
      }),
    [time, total],
  );
  useEffect(() => {
    if (!playing || reduced || !visible) return;
    if (time.get() >= total) time.set(0);
    const control = animate(time, total, {
      duration: total - time.get(),
      ease: "linear",
      onComplete: () => setPlaying(false),
    });
    return () => control.stop();
  }, [playing, reduced, visible, time, total]);
  function commit(next: Scene) {
    setPlaying(false);
    setHistory((h) => [...h.slice(-29), scene]);
    setFuture([]);
    setScene(next);
    time.set(sceneLength(next));
  }
  function edit(patch: Partial<Layer>) {
    commit({
      ...scene,
      layers: scene.layers.map((l) => (l.id === layer.id ? { ...l, ...patch } : l)),
    });
  }
  function poseEdit(side: "from" | "to", key: keyof Pose, value: number) {
    if (Number.isFinite(value)) edit({ [side]: { ...layer[side], [key]: value } });
  }
  function load(v: unknown) {
    const next = parseScene(v);
    commit(next);
    setSelected(next.layers[0]!.id);
    setMessage("Project loaded.");
  }
  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((f) => [scene, ...f]);
    setHistory((h) => h.slice(0, -1));
    setScene(previous);
    setPlaying(false);
    time.set(sceneLength(previous));
  }
  function redo() {
    const next = future[0];
    if (!next) return;
    setHistory((h) => [...h, scene]);
    setFuture((f) => f.slice(1));
    setScene(next);
    setPlaying(false);
    time.set(sceneLength(next));
  }
  const code = sceneCode(scene);
  return (
    <section className="studio-tool" aria-label="Visual animation editor">
      <div className="tool-toolbar">
        <div>
          <span className="eyebrow">SCENE / {scene.layers.length} LAYERS</span>
          <strong>{scene.name}</strong>
        </div>
        <div className="tool-actions">
          <button disabled={!history.length} onClick={undo}>
            Undo
          </button>
          <button disabled={!future.length} onClick={redo}>
            Redo
          </button>
          <button
            onClick={() => {
              try {
                localStorage.setItem(sceneKey, JSON.stringify(scene));
                setMessage("Saved in this browser.");
              } catch {
                setMessage("Browser storage unavailable. Export JSON instead.");
              }
            }}
          >
            Save project
          </button>
          <button
            onClick={() => {
              try {
                const saved = localStorage.getItem(sceneKey);
                if (!saved) throw Error("No saved project in this browser.");
                load(JSON.parse(saved));
              } catch (e) {
                setMessage(e instanceof Error ? e.message : "Unable to restore project.");
              }
            }}
          >
            Restore saved
          </button>
          <button
            onClick={() => {
              try {
                const draft = sessionStorage.getItem(sceneKey);
                if (!draft) throw Error("No AI draft available. Create one in AI Kit.");
                load(JSON.parse(draft));
              } catch (e) {
                setMessage(e instanceof Error ? e.message : "Unable to load draft.");
              }
            }}
          >
            Load AI draft
          </button>
        </div>
      </div>
      <div className="studio-workspace">
        <aside className="studio-layers" aria-label="Scene layers">
          <p className="eyebrow">LAYERS</p>
          {scene.layers.map((l, i) => (
            <button key={l.id} aria-pressed={layer.id === l.id} onClick={() => setSelected(l.id)}>
              <span>0{i + 1}</span>
              {l.name}
              <small>{l.shape}</small>
            </button>
          ))}
          <button
            disabled={scene.layers.length >= 6}
            onClick={() => {
              const id = `layer-${Date.now()}`;
              commit({
                ...scene,
                layers: [
                  ...scene.layers,
                  { ...starterScene().layers[1]!, id, name: "New layer", text: "Hello motion" },
                ],
              });
              setSelected(id);
            }}
          >
            + Add layer
          </button>
          <button
            disabled={scene.layers.length === 1}
            onClick={() => {
              const layers = scene.layers.filter((l) => l.id !== layer.id);
              commit({ ...scene, layers });
              setSelected(layers[0]!.id);
            }}
          >
            Delete selected
          </button>
          <div className="studio-presets">
            <p className="eyebrow">STARTING POINTS</p>
            <button onClick={() => load(starterScene())}>Layered entrance</button>
            <button
              onClick={() => {
                const next = starterScene();
                next.name = "Staggered cards";
                next.layers = next.layers.map((l, i) => ({
                  ...l,
                  shape: "label",
                  text: ["Design", "Build", "Move"][i]!,
                  from: { x: -80, y: (i - 1) * 75, opacity: 0, scale: 0.8, rotate: 0 },
                  to: { x: 0, y: (i - 1) * 75, opacity: 1, scale: 1, rotate: 0 },
                  delay: i * 0.25,
                }));
                load(next);
              }}
            >
              Staggered labels
            </button>
          </div>
        </aside>
        <div className="studio-canvas" ref={stageRef}>
          <div className="studio-canvas-meta">
            <span>LIVE CANVAS</span>
            <span>{reduced ? "REDUCED MOTION · FINAL POSE" : "TRANSFORM / OPACITY"}</span>
          </div>
          <ScenePreview scene={scene} time={time} selected={layer.id} onSelect={setSelected} />
          <div className="studio-transport">
            <button
              disabled={reduced}
              aria-pressed={playing && visible && !reduced}
              onClick={() => {
                setPlaying(!playing);
              }}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                time.set(0);
              }}
            >
              Restart
            </button>
            <label className="scrub-label">
              Timeline
              <input
                ref={scrub}
                aria-label="Timeline position"
                type="range"
                min="0"
                max={total}
                step="0.01"
                defaultValue={total}
                disabled={reduced}
                onInput={(e) => {
                  setPlaying(false);
                  time.set(Number(e.currentTarget.value));
                }}
              />
            </label>
            <output ref={clock} aria-live="off">
              {total.toFixed(2)}s / {total.toFixed(2)}s
            </output>
          </div>
          <div className="studio-timeline" aria-label="Layer timings">
            {scene.layers.map((l) => (
              <div key={l.id}>
                <span>{l.name}</span>
                <div>
                  <span
                    style={{
                      marginLeft: `${(l.delay / total) * 100}%`,
                      width: `${(l.duration / total) * 100}%`,
                    }}
                  >
                    {l.duration}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="studio-inspector" aria-label="Layer inspector">
          <p className="eyebrow">INSPECTOR / {layer.name}</p>
          <label>
            Scene name
            <input
              maxLength={80}
              value={scene.name}
              onChange={(e) => commit({ ...scene, name: e.target.value })}
            />
          </label>
          <label>
            Layer name
            <input
              maxLength={40}
              value={layer.name}
              onChange={(e) => edit({ name: e.target.value })}
            />
          </label>
          <label>
            Text
            <input
              maxLength={100}
              value={layer.text}
              onChange={(e) => edit({ text: e.target.value })}
            />
          </label>
          <div className="inspector-pair">
            <label>
              Shape
              <select
                value={layer.shape}
                onChange={(e) => edit({ shape: e.target.value as Layer["shape"] })}
              >
                {["card", "orb", "label"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Colour
              <select
                value={layer.colour}
                onChange={(e) => edit({ colour: e.target.value as Layer["colour"] })}
              >
                {colours.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="inspector-pair">
            <label>
              Duration (s)
              <input
                type="number"
                min="0.1"
                max="5"
                step="0.1"
                value={layer.duration}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= 0.1 && v <= 5) edit({ duration: v });
                }}
              />
            </label>
            <label>
              Delay (s)
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={layer.delay}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v >= 0 && v <= 5) edit({ delay: v });
                }}
              />
            </label>
          </div>
          <label>
            Easing
            <select
              value={layer.ease}
              onChange={(e) => edit({ ease: e.target.value as Layer["ease"] })}
            >
              {easings.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          {(["from", "to"] as const).map((side) => (
            <fieldset key={side}>
              <legend>{side === "from" ? "Start keyframe" : "End keyframe"}</legend>
              <div className="pose-fields">
                {poseFields.map(([key, min, max, step]) => (
                  <label key={key}>
                    {key}
                    <input
                      aria-label={`${side} ${key}`}
                      type="number"
                      min={min}
                      max={max}
                      step={step}
                      value={layer[side][key]}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= min && v <= max) poseEdit(side, key, v);
                      }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </aside>
      </div>
      <p role="status" className="tool-status">
        {message}
      </p>
      <div className="tool-export">
        <section>
          <h2>Take it with you.</h2>
          <p>
            Export plain React + Motion code, or save an editable JSON project.{" "}
            <Link href="/ai-kit">Build a draft with AI Kit ↗</Link>
          </p>
          <div className="tool-actions">
            <button onClick={() => download(code, "MotionScene.tsx", "text/plain")}>
              Download React
            </button>
            <button
              onClick={() =>
                download(JSON.stringify(scene, null, 2), "motion-scene.json", "application/json")
              }
            >
              Export JSON
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  setMessage("React code copied.");
                } catch {
                  setMessage("Copy unavailable. Select the code below or download it.");
                }
              }}
            >
              Copy React
            </button>
          </div>
          <label>
            Generated React code
            <textarea readOnly rows={12} value={code} />
          </label>
        </section>
        <section>
          <h2>Bring a project in.</h2>
          <label>
            Project JSON
            <textarea
              rows={8}
              value={json}
              maxLength={32000}
              onChange={(e) => setJson(e.target.value)}
              placeholder="Paste a Motion Kit version 1 project"
            />
          </label>
          <button
            onClick={() => {
              try {
                load(JSON.parse(json));
              } catch (e) {
                setMessage(e instanceof Error ? e.message : "Invalid project JSON.");
              }
            }}
          >
            Import JSON
          </button>
          <label>
            Or choose a project file
            <input
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  if (file.size > 32000) throw Error("Project file must be smaller than 32KB.");
                  load(JSON.parse(await file.text()));
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Unable to read project.");
                }
                e.target.value = "";
              }}
            />
          </label>
        </section>
      </div>
    </section>
  );
}
