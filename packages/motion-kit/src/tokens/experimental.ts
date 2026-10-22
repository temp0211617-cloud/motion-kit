/** Low-opacity decorations preserve foreground contrast; trails use bounded spring lag. */
export const experimentalTokens = {
  idleOpacity: 0.08,
  activeOpacity: 0.18,
  trailMassStep: 0.2,
  noiseFrequency: 0.7,
} as const;
