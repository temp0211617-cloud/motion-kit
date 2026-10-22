import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionConfigContext } from "motion/react";
import { useContext } from "react";
import { MotionProvider, useMotionKit } from "../src/providers/MotionProvider";

function Consumer() {
  const { presetName, preset } = useMotionKit();
  const config = useContext(MotionConfigContext);
  return (
    <output>
      {presetName}:{preset.duration}:{config.reducedMotion}
    </output>
  );
}

describe("MotionProvider", () => {
  it("defaults to premium and respects the user's motion preference", () => {
    render(
      <MotionProvider>
        <Consumer />
      </MotionProvider>,
    );
    expect(screen.getByText("premium:0.32:user")).toBeInTheDocument();
  });
  it("propagates changed presets and an explicit reduced motion override", () => {
    const { rerender } = render(
      <MotionProvider preset="subtle">
        <Consumer />
      </MotionProvider>,
    );
    expect(screen.getByText("subtle:0.18:user")).toBeInTheDocument();
    rerender(
      <MotionProvider preset="cinematic" reducedMotion="always">
        <Consumer />
      </MotionProvider>,
    );
    expect(screen.getByText("cinematic:0.55:always")).toBeInTheDocument();
  });
  it("reports a missing provider", () => {
    expect(() => render(<Consumer />)).toThrow("useMotionKit must be used within MotionProvider");
  });
});
