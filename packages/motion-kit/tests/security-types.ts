import type { RevealProps, PageTransitionProps } from "../src/core";
// Compile-time contracts fail if raw HTML is accidentally added back to these APIs.
const reveal: RevealProps = {
  // @ts-expect-error Raw HTML is outside the children API.
  dangerouslySetInnerHTML: { __html: "Unsupported" },
};
const page: PageTransitionProps = {
  transitionKey: "one",
  // @ts-expect-error Raw HTML is outside the children API.
  dangerouslySetInnerHTML: { __html: "Unsupported" },
};
void reveal;
void page;
