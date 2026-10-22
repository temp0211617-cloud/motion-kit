import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const packageRoot = new URL("../packages/motion-kit/", import.meta.url);
const require = createRequire(new URL("package.json", packageRoot));
const { build } = createRequire(require.resolve("tsup/package.json"))("esbuild");
const targets = [
  ["Pressable", "gestures"],
  ["HoverMagnet", "gestures"],
  ["DragSurface", "gestures"],
  ["SwipeAction", "gestures"],
  ["LongPressMotion", "gestures"],
  ["LiveTicker", "ticker"],
  ["DraggableTicker", "ticker"],
  ["RulerTicker", "ticker"],
  ["DragCarousel", "media"],
  ["EditorialSlider", "editorial"],
  ["RulerScrollIndicator", "editorial"],
  ["StickyStory", "scroll"],
  ["FilmStrip", "media"],
  ["Curtains", "cinematic"],
  ["MediaRail", "media"],
  ["ReadingProgressRail", "editorial"],
];
const report = {};
for (const [name, category] of targets) {
  const metrics = {};
  for (const peers of [false, true]) {
    const result = await build({
      stdin: {
        contents: `export { ${name} } from "@personal/motion-kit/${category}";`,
        resolveDir: fileURLToPath(packageRoot),
        sourcefile: "consumer.js",
      },
      bundle: true,
      write: false,
      minify: true,
      format: "esm",
      platform: "browser",
      target: "es2022",
      define: { "process.env.NODE_ENV": '"production"' },
      external: peers ? [] : ["react", "react/*", "react-dom", "react-dom/*", "motion", "motion/*"],
      logLevel: "silent",
    });
    const output = result.outputFiles[0];
    metrics[peers ? "withPeers" : "local"] = {
      bytes: output.contents.byteLength,
      gzipBytes: gzipSync(output.contents).byteLength,
    };
    if (!peers) {
      assert.ok(output.contents.byteLength < 12_000, `${name} consumer exceeds 12k local bytes`);
      if (name === "Pressable") {
        assert.ok(
          output.contents.byteLength < 6_000 && !output.text.includes("Hold "),
          "Pressable retains sibling gesture controllers",
        );
      }
      if (name === "ReadingProgressRail") {
        assert.ok(
          output.contents.byteLength < 3_500,
          "ReadingProgressRail retains sibling controllers",
        );
        assert.ok(
          !output.text.includes('"aria-roledescription":"carousel"'),
          "ReadingProgressRail retains a carousel",
        );
      }
    }
  }
  report[name] = metrics;
  process.stdout.write(
    `${name}: ${metrics.local.bytes} local / ${metrics.withPeers.gzipBytes} gzip bytes with React/Motion peers.\n`,
  );
}
writeFileSync(
  new URL("../docs/performance-bundles.json", import.meta.url),
  `${JSON.stringify(report, null, 2)}\n`,
);
