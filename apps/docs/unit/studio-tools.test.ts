import { describe, it, expect, vi, afterEach } from "vitest";
import { parseScene, sceneCode, sceneLength, starterScene, progress } from "../lib/scene";
import {
  aiConfigured,
  allowedAIOrigin,
  parseProviderOutput,
  reserveRequest,
  releaseRequest,
  validAccessCode,
} from "../server/ai-provider";
afterEach(() => vi.unstubAllEnvs());
describe("Studio project boundary", () => {
  it("round trips valid projects and detaches parsed values", () => {
    const original = starterScene();
    const next = parseScene(JSON.parse(JSON.stringify(original)));
    expect(next).toEqual(original);
    next.layers[0]!.to.x = 10;
    expect(original.layers[0]!.to.x).toBe(65);
    expect(sceneLength(next)).toBe(1.2);
  });
  it.each([NaN, Infinity, -101, 101, "3"])("rejects malformed animation positions %s", (value) => {
    const scene = starterScene();
    (scene.layers[0]!.from as unknown as Record<string, unknown>).x = value;
    expect(() => parseScene(scene)).toThrow();
  });
  it("rejects unknown fields, duplicate ids, oversized labels and excess layers", () => {
    const scene = starterScene();
    expect(() => parseScene({ ...scene, script: "alert(1)" })).toThrow();
    expect(() => parseScene({ ...scene, layers: [...scene.layers, ...scene.layers] })).toThrow();
    expect(() => parseScene({ ...scene, name: "x".repeat(81) })).toThrow();
    expect(() => parseScene({ ...scene, layers: [] })).toThrow();
    expect(() => parseScene({ ...scene, layers: Array(7).fill(scene.layers[0]) })).toThrow();
  });
  it("keeps text as data and emits reduced-motion-aware deterministic React", () => {
    const scene = starterScene();
    scene.layers[0]!.text = "</script><script>alert(1)</script>";
    const code = sceneCode(parseScene(scene));
    expect(code).toContain("useReducedMotion");
    expect(code).toContain("{layer.text}");
    expect(code).toContain("as const");
    expect(code).not.toContain("dangerouslySetInnerHTML");
    expect(code).not.toContain("eval(");
    expect(progress(-2, scene.layers[0]!)).toBe(0);
    expect(progress(20, scene.layers[0]!)).toBe(1);
  });
});
describe("AI provider contract", () => {
  it("requires all server opt-ins and authenticates a separate workspace code", () => {
    vi.stubEnv("MOTION_AI_ENABLED", "0");
    expect(aiConfigured()).toBe(false);
    vi.stubEnv("MOTION_AI_ENABLED", "1");
    vi.stubEnv("OPENAI_API_KEY", "unit-placeholder");
    vi.stubEnv("OPENAI_MODEL", "unit-model");
    vi.stubEnv("MOTION_AI_ACCESS_CODE", "unit-access-code");
    expect(aiConfigured()).toBe(true);
    expect(validAccessCode("unit-access-code")).toBe(true);
    expect(validAccessCode("wrong")).toBe(false);
  });
  it("rejects cross-origin and public host calls", () => {
    expect(allowedAIOrigin("localhost:3000", "http://localhost:3000")).toBe(true);
    expect(allowedAIOrigin("127.0.0.1:3100", "http://127.0.0.1:3100")).toBe(true);
    expect(allowedAIOrigin("localhost:3000", "https://attacker.example")).toBe(false);
    expect(allowedAIOrigin("public.example", "http://public.example")).toBe(false);
    expect(allowedAIOrigin("localhost:3000", null)).toBe(false);
  });
  it("accepts only complete validated output and rejects refusals or malformed payloads", () => {
    const scene = starterScene();
    expect(
      parseProviderOutput({
        status: "completed",
        output: [
          { type: "message", content: [{ type: "output_text", text: JSON.stringify(scene) }] },
        ],
      }),
    ).toEqual(scene);
    expect(() => parseProviderOutput({ status: "incomplete", output: [] })).toThrow();
    expect(() =>
      parseProviderOutput({
        status: "completed",
        output: [{ type: "message", content: [{ type: "refusal" }] }],
      }),
    ).toThrow();
    expect(() =>
      parseProviderOutput({
        status: "completed",
        output: [{ type: "message", content: [{ type: "output_text", text: '{"script":"bad"}' }] }],
      }),
    ).toThrow();
  });
  it("bounds concurrency and request rate", () => {
    const now = Date.UTC(2026, 9, 23);
    expect(reserveRequest(now)).toBe(true);
    expect(reserveRequest(now)).toBe(false);
    releaseRequest();
    for (let i = 0; i < 4; i++) {
      expect(reserveRequest(now)).toBe(true);
      releaseRequest();
    }
    expect(reserveRequest(now)).toBe(false);
    expect(reserveRequest(now + 60000)).toBe(true);
    releaseRequest();
  });
});
