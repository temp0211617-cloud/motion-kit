/** Validate without touching the DOM; reject executable and unsupported schemes. */
export function safeHref(value: string): string {
  const trimmed = value.trim();
  if (
    !trimmed ||
    [...trimmed].some(
      (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  )
    throw new Error("Link requires a safe URL");
  let url: URL;
  try {
    url = new URL(trimmed, "https://motion-kit.invalid/");
  } catch {
    throw new Error("Link requires a safe URL");
  }
  if (
    url.username ||
    url.password ||
    !["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
  )
    throw new Error("Link requires a safe URL");
  return trimmed;
}
/** Isolate every new browsing context, including named and mixed-case targets. */
export function safeLinkRel(target: string | undefined, rel: string | undefined) {
  return target && !["_self", "_parent", "_top"].includes(target.toLowerCase())
    ? `${rel ?? ""} noopener noreferrer`.trim()
    : rel;
}
