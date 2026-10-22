"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";

export function HeroScene() {
  const [arrangement, setArrangement] = useState("Stack");
  const reduced = useMotionPreference();
  return (
    <div className="hero-scene">
      <div className="scene-toolbar">
        <span>
          <span className="live-dot" />
          LIVE STUDY 001
        </span>
        <span>layout · spring</span>
      </div>
      <div
        className={`scene-canvas scene-${arrangement.toLowerCase()}`}
        aria-label={`${arrangement} card composition`}
      >
        {["01", "02", "03"].map((label, index) => (
          <motion.div
            key={label}
            layout={!reduced}
            className={`scene-card scene-card-${index}`}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
            style={{ rotate: reduced ? 0 : arrangement === "Stack" ? (index - 1) * 14 : 0 }}
          >
            <span>FORM / {label}</span>
            <div className="scene-sculpture" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <strong>{["Make it", "feel", "alive."][index]}</strong>
          </motion.div>
        ))}
      </div>
      <div className="scene-footer">
        <div className="scene-switch" role="group" aria-label="Hero arrangement">
          {["Stack", "Grid", "Row"].map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={value === arrangement}
              onClick={() => setArrangement(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <span className="caption">Click to rearrange ↗</span>
      </div>
    </div>
  );
}
