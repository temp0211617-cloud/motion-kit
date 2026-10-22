import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { sceneCode, starterScene } from "../apps/docs/lib/scene.ts";
const require = createRequire(new URL("../apps/docs/package.json", import.meta.url));
const ts = require("typescript");
const configPath = fileURLToPath(new URL("../apps/docs/tsconfig.json", import.meta.url));
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  fileURLToPath(new URL("../apps/docs", import.meta.url)),
);
const file = fileURLToPath(new URL("../apps/docs/__studio_export_check__.tsx", import.meta.url));
const options = { ...parsed.options, noEmit: true, jsx: ts.JsxEmit.ReactJSX };
const host = ts.createCompilerHost(options);
const originalSource = host.getSourceFile.bind(host);
const source = sceneCode(starterScene());
host.getSourceFile = (name, languageVersion, onError, shouldCreate) =>
  name.replaceAll("\\", "/").toLowerCase() === file.replaceAll("\\", "/").toLowerCase()
    ? ts.createSourceFile(name, source, languageVersion, true, ts.ScriptKind.TSX)
    : originalSource(name, languageVersion, onError, shouldCreate);
const program = ts.createProgram([file], options, host);
const errors = ts
  .getPreEmitDiagnostics(program)
  .filter((d) => d.category === ts.DiagnosticCategory.Error);
if (errors.length) {
  process.stderr.write(
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
      getCanonicalFileName: (n) => n,
      getNewLine: () => "\n",
    }),
  );
  process.exitCode = 1;
} else process.stdout.write("Generated Studio React export passes strict TypeScript.\n");
