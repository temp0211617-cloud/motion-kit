"use client";
import { motion } from "motion/react";
import { useMotionPreference } from "@personal/motion-kit/hooks";
import { useStageVisibility } from "./useStageVisibility";

function RollingNumber({ value, run }: { value: number; run: boolean }) {
  const reduced = useMotionPreference();
  return (
    <strong>
      <span className="sr-only">{value}</span>
      <span className="rolling-digits" aria-hidden="true">
        {String(value)
          .split("")
          .map((digit, index) => (
            <span className="digit-window" key={index}>
              {run && !reduced ? (
                <motion.span
                  className="digit-strip"
                  initial={{ y: 0 }}
                  animate={{ y: `-${20 + Number(digit)}em` }}
                  transition={{ duration: 1.25 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {Array.from({ length: 30 }, (_, position) => (
                    <span key={position}>{position % 10}</span>
                  ))}
                </motion.span>
              ) : (
                digit
              )}
            </span>
          ))}
      </span>
    </strong>
  );
}
export function AnimatedStats() {
  const { ref, visible } = useStageVisibility();
  return (
    <div ref={ref} className="showcase-stats rolling-stats" aria-label="Library overview">
      {[
        [153, "package components"],
        [12, "collections"],
        [6, "playground studies"],
        [4, "gallery layouts"],
      ].map(([value, label]) => (
        <p key={label}>
          <RollingNumber value={Number(value)} run={visible} />
          {label}
        </p>
      ))}
    </div>
  );
}
