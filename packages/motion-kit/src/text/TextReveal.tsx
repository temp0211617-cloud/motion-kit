"use client";

import { useEffect, type CSSProperties } from "react";
import { motion, useAnimationControls, type Variants } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useMotionKit } from "../providers/MotionProvider";
import { splitText } from "./segmentation";
import { motionTokens } from "../tokens/motion";

export const readerOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
  userSelect: "none",
};
export interface TextRevealProps {
  children: string;
  className?: string;
  by?: "words" | "characters" | "lines";
  effect?: "rise" | "fade" | "blur" | "mask";
}

export function SplitText({ children, className, by = "words", effect = "rise" }: TextRevealProps) {
  const reduced = useMotionPreference();
  const { preset } = useMotionKit();
  const controls = useAnimationControls();
  const tooLong = children.length > 2048;
  const all = tooLong ? [children] : splitText(children, by);
  const limited = !tooLong && all.length <= 128;
  // Large prose stays unsplit; the animation is intended for short display text.
  const parts = all.length <= 128 ? all : [children];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: effect === "fade" || effect === "blur" ? 0 : motionTokens.text.travel,
      filter: effect === "blur" ? `blur(${motionTokens.text.blur})` : "none",
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      filter: "none",
      transition: {
        duration: reduced ? 0 : preset.duration,
        delay: reduced ? 0 : Math.min(index * preset.stagger, 2),
      },
    }),
  };
  useEffect(() => {
    controls.stop();
    if (!limited) return;
    if (reduced) controls.set("visible");
    else {
      controls.set("hidden");
      void controls.start("visible");
    }
    return () => controls.stop();
  }, [children, controls, reduced, by, effect, limited, preset.duration, preset.stagger]);
  if (!limited) return <span className={className}>{children}</span>;
  const groups =
    by === "characters"
      ? splitText(children, "words").map((word) => splitText(word, "characters"))
      : parts.map((part) => [part]);
  let ordinal = 0;
  return (
    <span className={className}>
      <span style={readerOnly}>{children}</span>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={controls}
        style={{ whiteSpace: "pre-wrap" }}
      >
        {groups.map((group, groupIndex) => (
          <span
            key={groupIndex}
            style={{
              display:
                by === "lines"
                  ? "block"
                  : by === "characters" && !/^\s+$/u.test(group.join(""))
                    ? "inline-flex"
                    : effect === "mask" && !/^\s+$/u.test(group.join(""))
                      ? "inline-block"
                      : "inline",
              maxWidth: "100%",
              flexWrap: "wrap",
              overflow: effect === "mask" ? "clip" : undefined,
            }}
          >
            {group.map((part) => (
              <motion.span
                key={ordinal}
                custom={ordinal++}
                variants={variants}
                style={{
                  display: /^\s+$/u.test(part) ? "inline" : "inline-block",
                  whiteSpace: "pre-wrap",
                }}
              >
                {part || "\u00a0"}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
type SimpleTextProps = Omit<TextRevealProps, "by" | "effect">;
export function WordReveal(props: SimpleTextProps) {
  return <SplitText {...props} by="words" />;
}
export function CharacterReveal(props: SimpleTextProps) {
  return <SplitText {...props} by="characters" />;
}
export function LineReveal(props: SimpleTextProps) {
  return <SplitText {...props} by="lines" />;
}
export function BlurText(props: SimpleTextProps) {
  return <SplitText {...props} effect="blur" />;
}
export function MaskedTextReveal(props: SimpleTextProps) {
  return <SplitText {...props} effect="mask" />;
}
