/** Unsupported raw HTML is rejected even when a JavaScript caller bypasses prop types. */
export function safeDOMProps<T extends object>(props: T): T {
  if (Object.hasOwn(props, "dangerouslySetInnerHTML")) throw new Error("Raw HTML is not supported");
  return props;
}
