export function mediaSource(source: string): string {
  const trimmed = source.trim();
  if (
    !trimmed ||
    [...trimmed].some(
      (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  )
    throw new Error("Media requires a safe URL");
  try {
    const url = new URL(trimmed, "https://motion-kit.invalid/");
    if (url.username || url.password || !["http:", "https:"].includes(url.protocol))
      throw new Error();
  } catch {
    throw new Error("Media requires a safe URL");
  }
  return trimmed;
}
