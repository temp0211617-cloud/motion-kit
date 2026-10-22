import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const require = createRequire(new URL("../packages/motion-kit/package.json", import.meta.url));
const ts = require("typescript");
const root = fileURLToPath(new URL("..", import.meta.url));
const ignored = new Set([
  "node_modules",
  "dist",
  ".next",
  ".turbo",
  ".git",
  "test-results",
  "playwright-report",
  "coverage",
]);
const authored = [];
function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (
      entry.isFile() &&
      ([".env.example", ".npmrc"].includes(entry.name) ||
        /\.(?:tsx?|mjs|json|md|ya?ml|svg|vtt|sh|txt)$/.test(entry.name))
    )
      authored.push(path);
  }
}
walk(root);
const findings = [];
const credential =
  /gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|sk-[A-Za-z0-9]{24,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|AKIA[0-9A-Z]{16}/;
const forbidden = new Set([
  "eval",
  "Function",
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "EventSource",
  "sendBeacon",
]);
const runtimeRoots = ["packages/motion-kit/src/", "apps/docs/app/"];
let inspected = 0;
function operationName(expression) {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  if (ts.isElementAccessExpression(expression) && ts.isStringLiteral(expression.argumentExpression))
    return expression.argumentExpression.text;
  if (ts.isParenthesizedExpression(expression)) return operationName(expression.expression);
  if (
    ts.isBinaryExpression(expression) &&
    expression.operatorToken.kind === ts.SyntaxKind.CommaToken
  )
    return operationName(expression.right);
  return "";
}
for (const path of authored) {
  const name = relative(root, path).replaceAll("\\", "/");
  const source = readFileSync(path, "utf8");
  // Report only paths and categories; credential values never enter diagnostic output.
  if (credential.test(source)) findings.push(`${name}: possible credential`);
  if (
    name.endsWith(".svg") &&
    /<script\b|<foreignObject\b|\bon[a-z]+\s*=|\bhref\s*=\s*["'](?:https?:|javascript:)/i.test(
      source,
    )
  )
    findings.push(`${name}: active/external SVG content`);
  if (!runtimeRoots.some((prefix) => name.startsWith(prefix)) || !/\.tsx?$/.test(name)) continue;
  inspected++;
  const ast = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    name.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  function inspect(node) {
    if (ts.isTypeNode(node)) return;
    const location = () =>
      `${name}:${ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1}`;
    if (
      (ts.isCallExpression(node) || ts.isNewExpression(node)) &&
      forbidden.has(operationName(node.expression))
    )
      findings.push(`${location()}: unsupported execution/network primitive`);
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      !ts.isStringLiteral(node.arguments[0])
    )
      findings.push(`${location()}: dynamic module input`);
    if (ts.isJsxAttribute(node) && node.name.getText(ast) === "dangerouslySetInnerHTML")
      findings.push(`${location()}: raw HTML sink`);
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      if (/^[a-z]/.test(node.tagName.getText(ast)))
        for (const attribute of node.attributes.properties) {
          if (
            ts.isJsxSpreadAttribute(attribute) &&
            ["props", "rest"].includes(attribute.expression.getText(ast))
          )
            findings.push(`${location()}: unguarded caller DOM props`);
        }
    }
    ts.forEachChild(node, inspect);
  }
  inspect(ast);
}
const manifest = JSON.parse(readFileSync(join(root, "packages/motion-kit/package.json"), "utf8"));
assert.equal(manifest.private, true);
assert.equal(manifest.sideEffects, false);
assert.deepEqual(manifest.files, ["dist", "README.md"], "Package files must remain allowlisted");
assert.deepEqual(Object.keys(manifest.dependencies ?? {}), [], "Unexpected runtime dependency");
assert.deepEqual(manifest.peerDependencies, {
  react: "^19.3.0",
  "react-dom": "^19.3.0",
  motion: "^14.1.0",
});
assert.ok(
  !["preinstall", "install", "postinstall", "prepublishOnly", "publish"].some((name) =>
    Object.hasOwn(manifest.scripts, name),
  ),
  "Unexpected install/publish hook",
);
const ignore = readFileSync(join(root, ".gitignore"), "utf8");
assert.match(ignore, /^\.env$/m);
assert.match(ignore, /^\.env\.\*$/m);
if (findings.length) {
  process.stderr.write(`${findings.join("\n")}\n`);
  process.exitCode = 1;
} else
  process.stdout.write(
    `Security checks pass: ${authored.length} authored files, ${inspected} runtime modules; private package, bounded peers and no runtime/install dependencies.\n`,
  );
