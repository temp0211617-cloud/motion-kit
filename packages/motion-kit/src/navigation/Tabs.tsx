"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import { motion, LayoutGroup } from "motion/react";
import { useMotionPreference } from "../hooks/useMotionPreference";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { spacingTokens } from "../tokens/spacing";
import { radiusTokens } from "../tokens/radius";
import { motionTokens } from "../tokens/motion-base";
export interface TabItem {
  id: string;
  label: string;
  children: ReactNode;
  disabled?: boolean;
}
export interface AnimatedTabsProps {
  items: readonly TabItem[];
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}
function Tabs({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
  className,
  kind,
}: AnimatedTabsProps & { kind: "pill" | "line" | "shared" }) {
  if (
    !label.trim() ||
    !items.length ||
    items.length > 32 ||
    items.some((item) => !item.id.trim() || !item.label.trim()) ||
    new Set(items.map((item) => item.id)).size !== items.length ||
    items.every((item) => item.disabled)
  )
    throw new Error("Use a label and 1–32 unique tabs with an enabled item");
  const [internal, setInternal] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.id,
  );
  const selected =
    items.find((item) => item.id === (value ?? internal) && !item.disabled)?.id ??
    items.find((item) => !item.disabled)?.id;
  const id = useId(),
    reduced = useMotionPreference(),
    buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <div className={className} style={{ minWidth: 0 }}>
      <LayoutGroup id={id}>
        <div
          role="tablist"
          aria-label={label}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: spacingTokens[2],
            marginBottom: spacingTokens[6],
          }}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel-${index}`}
              aria-selected={selected === item.id}
              tabIndex={selected === item.id ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const enabled = items.flatMap((candidate, candidateIndex) =>
                  candidate.disabled ? [] : [candidateIndex],
                );
                const current = enabled.indexOf(index);
                const next =
                  event.key === "Home"
                    ? enabled[0]
                    : event.key === "End"
                      ? enabled.at(-1)
                      : enabled[
                          (current + (event.key === "ArrowLeft" ? -1 : 1) + enabled.length) %
                            enabled.length
                        ];
                if (next !== undefined) {
                  buttons.current[next]?.focus();
                  select(items[next]!.id);
                }
              }}
              style={{
                position: "relative",
                isolation: "isolate",
                minHeight: layoutTokens.controlSize,
                minWidth: 0,
                maxWidth: "100%",
                overflowWrap: "anywhere",
                paddingInline: spacingTokens[4],
                border: "none",
                background: "transparent",
                color: colorTokens.text,
                borderRadius: radiusTokens.pill,
              }}
            >
              {selected === item.id && (
                <motion.span
                  aria-hidden="true"
                  {...(kind !== "pill" ? { layoutId: "selection" } : {})}
                  initial={reduced ? false : { opacity: motionTokens.media.enterOpacity }}
                  animate={{ opacity: 1 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : kind === "shared"
                        ? motionTokens.spring.soft
                        : { duration: motionTokens.duration.default }
                  }
                  style={{
                    position: "absolute",
                    inset: kind === "line" ? "auto 0 0" : 0,
                    height: kind === "line" ? spacingTokens[1] : "auto",
                    borderRadius: radiusTokens.pill,
                    background: kind === "line" ? colorTokens.accent : colorTokens.border,
                    zIndex: -1,
                  }}
                />
              )}
              {item.label}
            </button>
          ))}
        </div>
        {items.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            tabIndex={0}
            hidden={selected !== item.id}
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            style={{ minWidth: 0 }}
          >
            {item.children}
          </div>
        ))}
      </LayoutGroup>
    </div>
  );
}
export function AnimatedTabs(props: AnimatedTabsProps) {
  return <Tabs {...props} kind="pill" />;
}
export function SlidingTabs(props: AnimatedTabsProps) {
  return <Tabs {...props} kind="line" />;
}
export function SharedLayoutTabs(props: AnimatedTabsProps) {
  return <Tabs {...props} kind="shared" />;
}
