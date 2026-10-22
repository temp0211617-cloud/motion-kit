import { motionTokens as base } from "./motion-base";
export const motionTokens = {
  ...base,
  text: {
    travel: "0.6em",
    blur: "4px",
    typingDuration: 2,
    maximumTypingDuration: 4,
    shimmerDuration: 2,
    tickerSpeed: 40,
  },
} as const;
export type MotionTokens = typeof motionTokens;
