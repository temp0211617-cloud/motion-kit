import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("..", import.meta.url));
const kit = join(root, "packages", "motion-kit");
const manifest = JSON.parse(readFileSync(join(kit, "package.json"), "utf8"));
const cli = process.env.npm_execpath;
assert.ok(cli && /pnpm\.(?:c?js|mjs)$/.test(cli), "Run this check through pnpm check:release");
const environment = { ...process.env, NEXT_TELEMETRY_DISABLED: "1", TURBO_TELEMETRY_DISABLED: "1" };
function run(command, args, cwd, label) {
  const result = spawnSync(command, args, {
    cwd,
    env: environment,
    encoding: "utf8",
    timeout: 180_000,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${label} failed (${result.status}): ${result.stderr}`);
  return result.stdout;
}
const pnpm = (args, cwd, label) => run(process.execPath, [cli, ...args], cwd, label);
assert.equal(manifest.private, true);
assert.equal(manifest.license, "UNLICENSED");
assert.match(manifest.version, /-rc\.[0-9]+$/);
for (const hook of ["prepack", "postpack", "prepare", "preinstall", "install", "postinstall"])
  assert.ok(!manifest.scripts[hook], "Unexpected packaging/install lifecycle hook");
const artifacts = join(root, "artifacts");
mkdirSync(artifacts, { recursive: true });
const packed = JSON.parse(pnpm(["pack", "--json", "--pack-destination", artifacts], kit, "Pack"));
const archive = join(artifacts, `personal-motion-kit-${manifest.version}.tgz`);
assert.ok(
  JSON.stringify(packed).includes(manifest.version),
  "Pack output did not identify candidate",
);
const paths = run("tar", ["-tf", archive], root, "Inspect archive").trim().split(/\r?\n/);
assert.ok(paths.includes("package/README.md"), "Package guide missing from archive");
for (const path of paths)
  assert.ok(
    !path.split("/").includes("..") &&
      (path === "package/" ||
        path === "package/README.md" ||
        path === "package/package.json" ||
        path.startsWith("package/dist/")),
    `Unexpected packed path: ${path}`,
  );
for (const entry of Object.values(manifest.exports)) {
  assert.ok(paths.includes(`package/${entry.import.slice(2)}`), "Packed JS export missing");
  assert.ok(paths.includes(`package/${entry.types.slice(2)}`), "Packed declaration missing");
}
const archivedManifest = JSON.parse(
  run("tar", ["-xOf", archive, "package/package.json"], root, "Read packed manifest"),
);
assert.equal(archivedManifest.private, true);
assert.equal(archivedManifest.version, manifest.version);
assert.equal(archivedManifest.sideEffects, false);
assert.deepEqual(archivedManifest.peerDependencies, manifest.peerDependencies);
const consumers = join(root, ".codex", "consumers");
mkdirSync(consumers, { recursive: true });
const fixture = mkdtempSync(join(consumers, "rc-"));
const fixtureManifest = {
  name: "private-motion-kit-consumer",
  private: true,
  type: "module",
  packageManager: "pnpm@11.25.0",
  dependencies: {
    "@personal/motion-kit": `file:${relative(fixture, archive).split(sep).join("/")}`,
    react: manifest.devDependencies.react,
    "react-dom": manifest.devDependencies["react-dom"],
    motion: manifest.devDependencies.motion,
  },
  devDependencies: {
    typescript: manifest.devDependencies.typescript,
    "@types/react": manifest.devDependencies["@types/react"],
    "@types/react-dom": manifest.devDependencies["@types/react-dom"],
  },
};
writeFileSync(join(fixture, "package.json"), JSON.stringify(fixtureManifest, null, 2));
writeFileSync(
  join(fixture, ".npmrc"),
  "ignore-scripts=true\nstrict-peer-dependencies=true\nauto-install-peers=false\n",
);
writeFileSync(join(fixture, "pnpm-workspace.yaml"), "packages: []\n");
pnpm(
  [
    "install",
    "--offline",
    "--ignore-workspace",
    "--ignore-scripts",
    "--strict-peer-dependencies",
    "--no-frozen-lockfile",
  ],
  fixture,
  "Offline installed consumer",
);
writeFileSync(
  join(fixture, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "NodeNext",
        moduleResolution: "NodeNext",
        jsx: "react-jsx",
        strict: true,
        exactOptionalPropertyTypes: true,
        noUncheckedIndexedAccess: true,
        skipLibCheck: true,
        noEmit: true,
      },
      include: ["*.tsx"],
    },
    null,
    2,
  ),
);
for (const [prefix, path] of [
  ["root", join(root, "README.md")],
  ["package", join(kit, "README.md")],
]) {
  const snippets = [...readFileSync(path, "utf8").matchAll(/```tsx\r?\n([\s\S]*?)```/g)];
  assert.ok(snippets.length, "README TSX examples missing");
  snippets.forEach((snippet, index) =>
    writeFileSync(join(fixture, `${prefix}-example-${index}.tsx`), snippet[1]),
  );
}
writeFileSync(
  join(fixture, "contracts.tsx"),
  `import { Pressable, SwipeAction } from "@personal/motion-kit/gestures";
import { AnimatedTabs, type TabItem } from "@personal/motion-kit/navigation";
import type { ComponentMetadata } from "@personal/motion-kit";
import { gestureMetadata } from "@personal/motion-kit/gestures/metadata";
const metadata: ComponentMetadata[] = gestureMetadata;
const items: TabItem[] = [{id:"one",label:"One",children:"Copy"}];
const tabs = <AnimatedTabs label="Chapters" items={items} value="one" onValueChange={() => {}} />;
// @ts-expect-error Raw HTML is outside the packaged children API.
const raw = <Pressable dangerouslySetInnerHTML={{__html:"Unsupported"}} />;
// @ts-expect-error The ordinary action alternative must have a name.
const unnamed = <SwipeAction label="Item" onAction={() => {}}>Copy</SwipeAction>;
void metadata; void tabs; void raw; void unnamed;
`,
);
pnpm(["exec", "tsc", "--noEmit"], fixture, "Installed declarations and README examples");
writeFileSync(
  join(fixture, "server.mjs"),
  `import assert from "node:assert/strict";
import { foundationVariables, motionPresets } from "@personal/motion-kit";
import { gestureMetadata } from "@personal/motion-kit/gestures/metadata";
assert.equal(typeof foundationVariables,"object"); assert.equal(motionPresets.premium.duration,0.32); assert.equal(gestureMetadata.length,11);
`,
);
run(
  process.execPath,
  ["--conditions=react-server", "server.mjs"],
  fixture,
  "Server-only installed import",
);
writeFileSync(
  join(fixture, "ssr.mjs"),
  `import assert from "node:assert/strict";
import { createElement as h } from "react"; import { renderToString } from "react-dom/server";
import { MotionProvider } from "@personal/motion-kit/provider"; import { FadeUp } from "@personal/motion-kit/core";
import { Pressable, LongPressMotion } from "@personal/motion-kit/gestures";
const html = renderToString(h(MotionProvider,{reducedMotion:"always"},h(FadeUp,null,h(Pressable,null,"Mark & review")),h(LongPressMotion,{label:"study",onLongPress:()=>{}})));
assert.ok(html.includes("Mark &amp; review")); assert.ok(html.includes('type="button"')); assert.ok(html.includes("Activate"));
`,
);
run(process.execPath, ["ssr.mjs"], fixture, "Installed client SSR");
assert.notEqual(
  realpathSync(join(fixture, "node_modules", "@personal", "motion-kit")),
  realpathSync(kit),
  "Consumer resolved workspace source",
);
const require = createRequire(join(kit, "package.json"));
const { build } = createRequire(require.resolve("tsup/package.json"))("esbuild");
const consumerBundle = await build({
  stdin: {
    contents: 'export { Pressable } from "@personal/motion-kit/gestures";',
    resolveDir: fixture,
    sourcefile: "installed-consumer.js",
  },
  bundle: true,
  write: false,
  minify: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  external: ["react", "react/*", "react-dom", "react-dom/*", "motion", "motion/*"],
  logLevel: "silent",
});
const output = consumerBundle.outputFiles[0];
assert.ok(
  output.contents.byteLength < 6000 && !output.text.includes("Hold "),
  "Installed consumer retains sibling controllers",
);
const receipt = {
  version: manifest.version,
  private: true,
  archive: relative(root, archive).split(sep).join("/"),
  bytes: readFileSync(archive).byteLength,
  sha256: createHash("sha256").update(readFileSync(archive)).digest("hex"),
  files: paths.length,
  checks: {
    allowlist: true,
    declarations: true,
    readmeExamples: true,
    negativeTypes: true,
    offlineInstalledConsumer: true,
    serverConditions: true,
    clientSSR: true,
    treeShaking: true,
  },
  localPressableBytes: output.contents.byteLength,
  browserScope:
    "This command verifies package/consumer only; browser results and limitations are recorded in docs/checkpoints.md.",
};
writeFileSync(join(artifacts, "release-receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
process.stdout.write(
  `Private ${manifest.version} archive/installed consumer pass: ${receipt.files} files, ${receipt.bytes} bytes, SHA256 ${receipt.sha256}.\n`,
);
process.stdout.write(`Reviewable installed fixture: ${relative(root, fixture)}\n`);
