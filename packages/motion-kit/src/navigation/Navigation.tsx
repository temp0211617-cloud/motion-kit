"use client";
import { Children, isValidElement, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { useElementInView } from "../hooks/useElementInView";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { spacingTokens } from "../tokens/spacing";
import { radiusTokens } from "../tokens/radius";
import { zIndexTokens } from "../tokens/z-index";
import { motionTokens } from "../tokens/motion-base";
export interface NavigationProps {
  children: ReactNode;
  label: string;
  className?: string;
}
function Navbar({
  children,
  label,
  className,
  floating = false,
}: NavigationProps & { floating?: boolean }) {
  if (!label.trim()) throw new Error("Navigation requires a label");
  const ref = useRef<HTMLElement>(null),
    reduced = useMotionPreference(),
    inView = useElementInView(ref, !reduced);
  return (
    <motion.nav
      ref={ref}
      aria-label={label}
      className={className}
      initial={false}
      animate={{ y: inView && !reduced && !floating ? -motionTokens.distance.xs : 0 }}
      transition={{ duration: reduced ? 0 : motionTokens.duration.default }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: spacingTokens[4],
        alignItems: "center",
        padding: spacingTokens[4],
        minWidth: 0,
        maxWidth: "100%",
        background: colorTokens.surface,
        border: `1px solid ${colorTokens.border}`,
        borderRadius: radiusTokens.pill,
        position: floating ? "sticky" : "relative",
        top: floating ? spacingTokens[4] : "auto",
        zIndex: floating ? zIndexTokens.sticky : "auto",
      }}
    >
      {children}
    </motion.nav>
  );
}
export function FloatingNavbar(props: NavigationProps) {
  return <Navbar {...props} floating />;
}
export function AnimatedNavbar(props: NavigationProps) {
  return <Navbar {...props} />;
}
export function DockNavigation({ children, label, className }: NavigationProps) {
  if (!label.trim()) throw new Error("Navigation requires a label");
  const reduced = useMotionPreference();
  return (
    <nav
      aria-label={label}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: spacingTokens[3],
        padding: spacingTokens[4],
        background: colorTokens.surface,
        border: `1px solid ${colorTokens.border}`,
        borderRadius: radiusTokens.lg,
        minWidth: 0,
      }}
    >
      {Children.toArray(children).map((child, index) => (
        <motion.div
          key={isValidElement(child) ? child.key : index}
          whileHover={reduced ? {} : { scale: motionTokens.scale.emphasis }}
          whileFocus={reduced ? {} : { scale: motionTokens.scale.emphasis }}
          style={{ minHeight: layoutTokens.controlSize, display: "flex", alignItems: "center" }}
        >
          {child}
        </motion.div>
      ))}
    </nav>
  );
}
export function MorphingMenu({
  children,
  label,
  className,
  summary = "Menu",
}: NavigationProps & { summary?: string }) {
  if (!label.trim() || !summary.trim()) throw new Error("Menu requires a label and summary");
  const ref = useRef<HTMLDetailsElement>(null),
    [open, setOpen] = useState(false),
    reduced = useMotionPreference();
  return (
    <details
      ref={ref}
      className={className}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && ref.current?.open) {
          event.preventDefault();
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
      style={{
        border: `1px solid ${colorTokens.border}`,
        borderRadius: radiusTokens.md,
        padding: spacingTokens[4],
      }}
    >
      <summary style={{ minHeight: layoutTokens.controlSize, cursor: "pointer" }}>
        {summary}
      </summary>
      <motion.nav
        aria-label={label}
        initial={false}
        animate={{
          opacity: open ? 1 : motionTokens.media.enterOpacity,
          y: open || reduced ? 0 : -motionTokens.distance.xs,
        }}
        transition={{ duration: reduced ? 0 : motionTokens.duration.fast }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: spacingTokens[4],
          marginTop: spacingTokens[4],
        }}
      >
        {children}
      </motion.nav>
    </details>
  );
}
export interface AccordionItem {
  id: string;
  title: string;
  children: ReactNode;
}
function Disclosure({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(false),
    reduced = useMotionPreference();
  return (
    <details
      onToggle={(event) => setOpen(event.currentTarget.open)}
      style={{ borderBottom: `1px solid ${colorTokens.border}`, paddingBlock: spacingTokens[4] }}
    >
      <summary style={{ minHeight: layoutTokens.controlSize, cursor: "pointer" }}>
        {item.title}
      </summary>
      <motion.div
        initial={false}
        animate={{
          opacity: open || reduced ? 1 : motionTokens.media.enterOpacity,
          y: open || reduced ? 0 : -motionTokens.distance.xs,
        }}
        transition={{ duration: reduced ? 0 : motionTokens.duration.fast }}
        style={{ padding: spacingTokens[4] }}
      >
        {item.children}
      </motion.div>
    </details>
  );
}
export function AnimatedAccordion({
  items,
  label,
  className,
}: {
  items: readonly AccordionItem[];
  label: string;
  className?: string;
}) {
  if (
    !label.trim() ||
    items.some((item) => !item.id.trim() || !item.title.trim()) ||
    new Set(items.map((item) => item.id)).size !== items.length
  )
    throw new Error("Accordion requires a label and unique titled items");
  return (
    <section aria-label={label} className={className}>
      {items.map((item) => (
        <Disclosure key={item.id} item={item} />
      ))}
    </section>
  );
}
