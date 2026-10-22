export const motionTokens = {
  media: { enterOpacity: 0.85, momentumFactor: 0.2, previewLimit: 4.5 },
  surface: { perspective: 800, tilt: 6, floatAngle: 1 },
  duration: {
    instant: 0.12,
    fast: 0.18,
    default: 0.32,
    relaxed: 0.55,
    cinematic: 0.9,
  },
  stagger: {
    tight: 0.035,
    default: 0.07,
    relaxed: 0.12,
  },
  distance: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 40,
    xl: 64,
  },
  scale: {
    press: 0.97,
    hover: 1.02,
    emphasis: 1.05,
  },
  spring: {
    soft: { type: "spring", stiffness: 180, damping: 24, mass: 1 },
    smooth: { type: "spring", stiffness: 260, damping: 30, mass: 1 },
    snappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.8 },
    elastic: { type: "spring", stiffness: 320, damping: 20, mass: 0.9 },
    heavy: { type: "spring", stiffness: 170, damping: 26, mass: 1.35 },
  },
  ease: {
    standard: [0.2, 0, 0, 1] as const,
    entrance: [0.16, 1, 0.3, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },
} as const;
