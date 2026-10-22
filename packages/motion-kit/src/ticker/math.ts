export function normalizeLoop(value: number, length: number) {
  const offset =
    Number.isFinite(value) && Number.isFinite(length) && length > 0
      ? -(((-value % length) + length) % length)
      : 0;
  return offset === 0 ? 0 : offset;
}
export function safeSpeed(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(240, value)) : 40;
}
export function boundedOffset(value: number, length: number, viewport: number) {
  return [value, length, viewport].every(Number.isFinite)
    ? Math.max(-Math.max(0, length - viewport), Math.min(0, value))
    : 0;
}
