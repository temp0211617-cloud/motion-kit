"use client";
import { safeDOMProps } from "../utils/dom-props";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { safeHref, safeLinkRel } from "./url";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { motionTokens } from "../tokens/motion-base";

export interface MotionLinkProps extends Omit<
  HTMLMotionProps<"a">,
  "href" | "whileHover" | "whileTap" | "dangerouslySetInnerHTML" | "children"
> {
  children?: ReactNode;
  href: string;
}
export function ArrowLink({ children, href, target, rel, style, ...props }: MotionLinkProps) {
  const reduced = useMotionPreference();
  return (
    <motion.a
      {...safeDOMProps(props)}
      href={safeHref(href)}
      target={target}
      rel={safeLinkRel(target, rel)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        minHeight: layoutTokens.controlSize,
        color: colorTokens.accent,
        ...style,
      }}
      initial="rest"
      animate="rest"
      whileHover={reduced ? "rest" : "hover"}
      whileFocus={reduced ? "rest" : "hover"}
    >
      {children}
      <motion.span
        aria-hidden="true"
        variants={{ rest: { x: 0 }, hover: { x: motionTokens.distance.xs / 2 } }}
        transition={{ duration: reduced ? 0 : motionTokens.duration.fast }}
      >
        ↗
      </motion.span>
    </motion.a>
  );
}
export function UnderlineLink({ children, href, target, rel, style, ...props }: MotionLinkProps) {
  return (
    <motion.a
      {...safeDOMProps(props)}
      href={safeHref(href)}
      target={target}
      rel={safeLinkRel(target, rel)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: layoutTokens.controlSize,
        color: colorTokens.accent,
        textDecoration: "underline",
        textUnderlineOffset: "0.25em",
        ...style,
      }}
    >
      {children}
    </motion.a>
  );
}
export function HoverShiftLink(props: MotionLinkProps) {
  const { children, href, target, rel, style, ...rest } = props;
  const reduced = useMotionPreference();
  return (
    <motion.a
      {...safeDOMProps(rest)}
      href={safeHref(href)}
      target={target}
      rel={safeLinkRel(target, rel)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: layoutTokens.controlSize,
        color: colorTokens.accent,
        ...style,
      }}
      whileHover={reduced ? {} : { x: motionTokens.distance.xs / 2 }}
    >
      {children}
    </motion.a>
  );
}
