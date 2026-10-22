export const easings = ["linear", "easeOut", "easeInOut"] as const;
export const colours = ["lime", "coral", "violet", "mint"] as const;
export type Pose = { x: number; y: number; scale: number; rotate: number; opacity: number };
export type Layer = {
  id: string;
  name: string;
  text: string;
  shape: "card" | "orb" | "label";
  colour: (typeof colours)[number];
  from: Pose;
  to: Pose;
  duration: number;
  delay: number;
  ease: (typeof easings)[number];
};
export type Scene = { version: 1; name: string; layers: Layer[] };
export const sceneKey = "motion-kit-studio-v1";
const pose: Pose = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
export function starterScene(): Scene {
  return {
    version: 1,
    name: "A little momentum",
    layers: [
      {
        id: "layer-1",
        name: "Orbit",
        text: "",
        shape: "orb",
        colour: "violet",
        from: { ...pose, x: -70, y: 60, scale: 0.4, opacity: 0 },
        to: { ...pose, x: 65, y: -55 },
        duration: 1.2,
        delay: 0,
        ease: "easeOut",
      },
      {
        id: "layer-2",
        name: "Main card",
        text: "Make it move.",
        shape: "card",
        colour: "lime",
        from: { ...pose, y: 65, rotate: -12, opacity: 0 },
        to: pose,
        duration: 0.9,
        delay: 0.2,
        ease: "easeOut",
      },
      {
        id: "layer-3",
        name: "Caption",
        text: "A little momentum ↗",
        shape: "label",
        colour: "mint",
        from: { ...pose, y: 110, opacity: 0 },
        to: { ...pose, y: 100 },
        duration: 0.6,
        delay: 0.6,
        ease: "easeInOut",
      },
    ],
  };
}
function record(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function keys(v: Record<string, unknown>, expected: string[]) {
  if (Object.keys(v).length !== expected.length || expected.some((k) => !Object.hasOwn(v, k)))
    throw Error("Unexpected project fields.");
}
function text(v: unknown, max: number) {
  if (
    typeof v !== "string" ||
    v.length > max ||
    Array.from(v).some((char) => char.charCodeAt(0) < 32)
  )
    throw Error("Invalid project text.");
  return v;
}
function num(v: unknown, min: number, max: number) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max)
    throw Error("Animation value is outside its allowed range.");
  return v;
}
function parsePose(v: unknown): Pose {
  if (!record(v)) throw Error("Invalid animation pose.");
  keys(v, ["x", "y", "scale", "rotate", "opacity"]);
  return {
    x: num(v.x, -100, 100),
    y: num(v.y, -110, 110),
    scale: num(v.scale, 0.2, 1.5),
    rotate: num(v.rotate, -180, 180),
    opacity: num(v.opacity, 0, 1),
  };
}
export function parseScene(v: unknown): Scene {
  if (!record(v)) throw Error("Invalid project.");
  keys(v, ["version", "name", "layers"]);
  if (v.version !== 1 || !Array.isArray(v.layers) || v.layers.length < 1 || v.layers.length > 6)
    throw Error("Use a version 1 project with 1–6 layers.");
  const seen = new Set<string>();
  return {
    version: 1,
    name: text(v.name, 80),
    layers: v.layers.map((l: unknown) => {
      if (!record(l)) throw Error("Invalid layer.");
      keys(l, ["id", "name", "text", "shape", "colour", "from", "to", "duration", "delay", "ease"]);
      const id = text(l.id, 40);
      if (!/^[a-zA-Z0-9-]+$/.test(id) || seen.has(id))
        throw Error("Layer identifiers must be unique.");
      seen.add(id);
      if (
        !["card", "orb", "label"].includes(String(l.shape)) ||
        !colours.includes(l.colour as Layer["colour"]) ||
        !easings.includes(l.ease as Layer["ease"])
      )
        throw Error("Unsupported layer style.");
      return {
        id,
        name: text(l.name, 40),
        text: text(l.text, 100),
        shape: l.shape as Layer["shape"],
        colour: l.colour as Layer["colour"],
        from: parsePose(l.from),
        to: parsePose(l.to),
        duration: num(l.duration, 0.1, 5),
        delay: num(l.delay, 0, 5),
        ease: l.ease as Layer["ease"],
      };
    }),
  };
}
export function sceneLength(scene: Scene) {
  return Math.max(...scene.layers.map((l) => l.delay + l.duration));
}
export function progress(time: number, layer: Layer) {
  const p = Math.max(0, Math.min(1, (time - layer.delay) / layer.duration));
  return layer.ease === "linear"
    ? p
    : layer.ease === "easeOut"
      ? 1 - (1 - p) ** 3
      : p * p * (3 - 2 * p);
}
export function sceneCode(scene: Scene) {
  return `"use client";\nimport { motion, useReducedMotion } from "motion/react";\n\nconst scene = ${JSON.stringify(scene, null, 2)} as const;\nconst colours = { lime: "#d3e5aa", coral: "#ffc3ac", violet: "#c7b6ff", mint: "#a9dfd1" };\n\nexport default function MotionScene() {\n  const reduced = useReducedMotion();\n  return <div style={{ position: "relative", overflow: "hidden", minHeight: 400, background: "#152929" }}>\n    {scene.layers.map(layer => <motion.div key={layer.id}\n      initial={reduced ? false : layer.from} animate={layer.to}\n      transition={{ duration: reduced ? 0 : layer.duration, delay: reduced ? 0 : layer.delay, ease: ({ linear: (p: number) => p, easeOut: (p: number) => 1 - (1 - p) ** 3, easeInOut: (p: number) => p * p * (3 - 2 * p) })[layer.ease] }}\n      style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -80, marginTop: -40, width: 160, boxSizing: "border-box", minHeight: layer.shape === "orb" ? 160 : 80, display: "grid", placeItems: "center", padding: 16, borderRadius: layer.shape === "orb" ? "50%" : 16, background: colours[layer.colour], color: "#152929", fontWeight: 650 }}>\n      {layer.text}\n    </motion.div>)}\n  </div>;\n}\n`;
}
export const poseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    scale: { type: "number" },
    rotate: { type: "number" },
    opacity: { type: "number" },
  },
  required: ["x", "y", "scale", "rotate", "opacity"],
};
export const sceneSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    version: { type: "integer", enum: [1] },
    name: { type: "string" },
    layers: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          text: { type: "string" },
          shape: { type: "string", enum: ["card", "orb", "label"] },
          colour: { type: "string", enum: colours },
          from: poseSchema,
          to: poseSchema,
          duration: { type: "number" },
          delay: { type: "number" },
          ease: { type: "string", enum: easings },
        },
        required: [
          "id",
          "name",
          "text",
          "shape",
          "colour",
          "from",
          "to",
          "duration",
          "delay",
          "ease",
        ],
      },
    },
  },
  required: ["version", "name", "layers"],
};
export function promptBrief(brief: string) {
  return `Design a Motion Kit scene for this brief: ${brief}\nReturn only version-1 scene JSON. Use 1–3 layers. Layer ids unique alphanumeric/hyphen. name ≤40 characters, text ≤100. shape card/orb/label; colour lime/coral/violet/mint; ease linear/easeOut/easeInOut. Each from/to pose has x (-100..100), y (-110..110), scale (.2..1.5), rotate (-180..180), opacity (0..1). duration .1..5 seconds, delay 0..5. Scene has version:1, name (≤80 chars), layers. Layer has id,name,text,shape,colour,from,to,duration,delay,ease. Keep text readable and final opacity 1. Do not return code, URLs, assets or extra properties.`;
}
