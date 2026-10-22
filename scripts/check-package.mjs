import { readFileSync, statSync } from "node:fs";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

const root = new URL("../packages/motion-kit/", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
assert.equal(manifest.private, true);
assert.equal(manifest.sideEffects, false);
for (const entry of Object.values(manifest.exports)) {
  assert.ok(statSync(new URL(entry.types, root)).size > 0);
  assert.ok(statSync(new URL(entry.import, root)).size > 0);
}
const provider = readFileSync(new URL(manifest.exports["./provider"].import, root), "utf8");
assert.match(provider, /["']use client["']/);
const server = readFileSync(new URL(manifest.exports["."].import, root), "utf8");
assert.doesNotMatch(server, /motion\/react|MotionProvider|use client/);
const bytes = statSync(new URL(manifest.exports["./provider"].import, root)).size;
assert.ok(bytes < 10_000, `Provider exceeds 10 kB budget: ${bytes}`);
const hooks = readFileSync(new URL(manifest.exports["./hooks"].import, root), "utf8");
assert.match(hooks, /["']use client["']/);
// Follow local ESM imports so split chunks cannot hide an accidental client boundary.
function inspectGraph(url, visited = new Set()) {
  if (visited.has(url.href)) return "";
  visited.add(url.href);
  const source = readFileSync(url, "utf8");
  const imports = [...source.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)];
  return source + imports.map((match) => inspectGraph(new URL(match[1], url), visited)).join("");
}
const graph = inspectGraph(new URL(manifest.exports["."].import, root));
assert.doesNotMatch(graph, /motion\/react|use client|createContext|fetch\(/);
assert.ok(graph.length < 20_000, `Server token graph exceeds 20 kB: ${graph.length}`);
for (const [name, entry] of Object.entries(manifest.exports)) {
  if (name.endsWith("/metadata") || ["./tokens", "./presets"].includes(name)) {
    assert.doesNotMatch(
      inspectGraph(new URL(entry.import, root)),
      /motion\/react|use client|createContext|fetch\(/,
      `${name} crosses the server boundary`,
    );
  }
}
for (const name of [
  "./gestures",
  "./experimental",
  "./navigation",
  "./cinematic",
  "./editorial",
  "./media",
  "./ticker",
  "./provider",
  "./hooks",
  "./core",
  "./text",
  "./interactions",
  "./cards",
  "./scroll",
]) {
  const entry = new URL(manifest.exports[name].import, root);
  assert.match(readFileSync(entry, "utf8"), /["']use client["']/);
  const graphBytes = Buffer.byteLength(inspectGraph(entry));
  assert.ok(graphBytes < 20_000, `${name} local graph exceeds 20 kB: ${graphBytes}`);
  process.stdout.write(
    `${name}: ${graphBytes} local bytes, excluding external React/Motion peers.\n`,
  );
}
process.stdout.write(
  `Package exports, client boundary, and provider budget pass (${bytes} bytes).\n`,
);
// Ensure the seed catalog, server metadata and public client exports agree.
const catalog = readFileSync(new URL("../../docs/component-catalog.md", root), "utf8").split(
  "## Signature quality targets",
)[0];
const planned = catalog
  .split(/\r?\n/)
  .filter((line) => /^[A-Z][A-Za-z0-9]*(?:, [A-Za-z0-9]+)+$/.test(line))
  .flatMap((line) => line.split(",").map((name) => name.trim()));
const implemented = [];
for (const [name, entry] of Object.entries(manifest.exports)) {
  if (!name.endsWith("/metadata")) continue;
  const metadata = await import(new URL(entry.import, root).href);
  const components = await import(
    new URL(manifest.exports[name.replace("/metadata", "")].import, root).href
  );
  for (const item of Object.values(metadata).flat()) {
    assert.equal(
      typeof components[item.name],
      "function",
      `${item.name} is missing from its public entry`,
    );
    assert.ok(
      item.reducedMotion && item.keyboardAccessible && item.mobileSafe,
      `${item.name} metadata contract missing`,
    );
    implemented.push(item.name);
  }
}
assert.equal(new Set(implemented).size, implemented.length, "Duplicate component metadata");
assert.deepEqual(implemented.sort(), planned.sort(), "Catalog differs from implemented exports");
process.stdout.write(`Catalog and public exports match: ${implemented.length} components.\n`);
