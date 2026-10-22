"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MotionProvider, useMotionKit } from "@personal/motion-kit/provider";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { motionPresets, type MotionPresetName } from "@personal/motion-kit/presets";
import { motionTokens } from "@personal/motion-kit/tokens";

function Preview({ replay }: { replay: number }) {
  const { preset } = useMotionKit();
  const reduced = useMotionPreference();
  return (
    <div className="preview-stage">
      <motion.div
        key={`${replay}-${reduced}`}
        className="preview-mark"
        initial={reduced ? false : { opacity: 0, y: preset.distance }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : preset.duration, ease: motionTokens.ease.entrance }}
      >
        M<span aria-hidden="true">↗</span>
      </motion.div>
      <p className="caption">
        {reduced
          ? "Reduced motion · immediate transition"
          : `${preset.duration}s · ${preset.distance}px entrance`}
      </p>
    </div>
  );
}

export function FoundationPreview() {
  const [preset, setPreset] = useState<MotionPresetName>("premium");
  const [reduce, setReduce] = useState(false);
  const [replay, setReplay] = useState(0);
  return (
    <div className="panel">
      <div className="controls">
        <label>
          Motion preset
          <select
            value={preset}
            onChange={(event) => {
              const next = event.target.value;
              if (Object.hasOwn(motionPresets, next)) setPreset(next as MotionPresetName);
            }}
          >
            {Object.keys(motionPresets).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={reduce}
            onChange={(event) => setReduce(event.target.checked)}
          />
          Reduce motion
        </label>
        <button type="button" onClick={() => setReplay((value) => value + 1)}>
          Replay entrance<span aria-hidden="true"> ↗</span>
        </button>
      </div>
      <MotionProvider preset={preset} reducedMotion={reduce ? "always" : "user"}>
        <Preview replay={replay} />
      </MotionProvider>
    </div>
  );
}
