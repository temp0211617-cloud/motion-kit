"use client";
import { Children, isValidElement, type ReactNode } from "react";
import { NativeRail } from "../media/NativeRail";
import { colorTokens, layoutTokens } from "../tokens/layout";
import { spacingTokens } from "../tokens/spacing";
import { ordinal } from "./ordinal";
export function NumberedMediaRail({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <NativeRail label={label} {...(className ? { className } : {})}>
      {Children.toArray(children).map((child, index) => (
        <figure key={isValidElement(child) ? child.key : index} style={{ margin: 0 }}>
          <figcaption
            style={{ marginBottom: spacingTokens[3], fontVariantNumeric: "tabular-nums" }}
          >
            {ordinal(index + 1)}
          </figcaption>
          {child}
        </figure>
      ))}
    </NativeRail>
  );
}
export interface TimelineEntry {
  id: string;
  label: string;
  children: ReactNode;
}
export function EditorialTimeline({
  entries,
  label,
  className,
}: {
  entries: readonly TimelineEntry[];
  label: string;
  className?: string;
}) {
  if (
    !label.trim() ||
    entries.some((entry) => !entry.id.trim() || !entry.label.trim()) ||
    new Set(entries.map((entry) => entry.id)).size !== entries.length
  )
    throw new Error("Use a label and unique titled entries");
  return (
    <ol className={className} aria-label={label} style={{ listStyle: "none", padding: 0 }}>
      {entries.map((entry, index) => (
        <li
          key={entry.id}
          style={{
            borderLeft: `1px solid ${colorTokens.border}`,
            paddingLeft: spacingTokens[6],
            paddingBottom: spacingTokens[8],
          }}
        >
          <p style={{ color: colorTokens.accent }}>
            {ordinal(index + 1)} / {entry.label}
          </p>
          {entry.children}
        </li>
      ))}
    </ol>
  );
}
export function MeasureScale({
  count = 20,
  step = 10,
  label,
}: {
  count?: number;
  step?: number;
  label: string;
}) {
  if (
    !label.trim() ||
    !Number.isInteger(count) ||
    count < 2 ||
    count > 120 ||
    !Number.isFinite(step) ||
    step <= 0
  )
    throw new Error("Use a label, 2–120 ticks and a positive step");
  return (
    <div
      role="img"
      aria-label={`${label}: 0 to ${(count - 1) * step}`}
      style={{ display: "flex", flexWrap: "wrap", gap: spacingTokens[2] }}
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          style={{
            minWidth: layoutTokens.controlSize,
            textAlign: "center",
            borderLeft: `1px solid ${colorTokens.border}`,
            paddingTop: index % 5 === 0 ? spacingTokens[6] : spacingTokens[3],
          }}
        >
          {index % 5 === 0 ? index * step : "·"}
        </span>
      ))}
    </div>
  );
}
