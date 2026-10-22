let locks = 0;
let restore: (() => void) | undefined;
/** Shared ownership lets nested overlays release only their own lock. */
export function lockScroll() {
  if (locks++ === 0) {
    const { overflow, paddingRight } = document.body.style;
    const gutter = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    const padding = getComputedStyle(document.body).paddingRight;
    document.body.style.overflow = "hidden";
    if (gutter) document.body.style.paddingRight = `calc(${padding} + ${gutter}px)`;
    restore = () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) {
      restore?.();
      restore = undefined;
    }
  };
}
