"use client";
import { controlSize } from "../tokens/layout-base";
import { isValidElement, type ReactNode } from "react";
import { spacingTokens } from "../tokens/spacing";

export const railViewportStyle = {
  display: "flex",
  gap: spacingTokens[6],
  overflowX: "auto",
  maxWidth: "100%",
  minWidth: 0,
  padding: spacingTokens[2],
  position: "relative",
  touchAction: "pan-x pan-y",
  scrollPaddingInline: spacingTokens[2],
} as const;

export function RailControls({
  id,
  label,
  count,
  active,
  scrollable,
  go,
  cycle = false,
}: {
  id: string;
  label: string;
  count: number;
  active: number;
  scrollable: boolean;
  go: (index: number) => void;
  cycle?: boolean;
}) {
  const style = { minHeight: controlSize };
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: spacingTokens[3],
        marginTop: spacingTokens[4],
      }}
    >
      <button
        type="button"
        aria-controls={id}
        aria-label={`Previous ${label}`}
        disabled={!count || (!cycle && (!scrollable || active === 0))}
        onClick={() => go(active - 1)}
        style={style}
      >
        Previous
      </button>
      <output aria-live="polite">
        {!scrollable && count
          ? `All ${count} items visible`
          : count
            ? `${active + 1} / ${count}`
            : "No items"}
      </output>
      <button
        type="button"
        aria-controls={id}
        aria-label={`Next ${label}`}
        disabled={!count || (!cycle && (!scrollable || active >= count - 1))}
        onClick={() => go(active + 1)}
        style={style}
      >
        Next
      </button>
    </div>
  );
}

export function RailItems({ items, width }: { items: ReactNode[]; width: string }) {
  return items.map((item, index) => (
    <div
      key={isValidElement(item) ? item.key : index}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${items.length}`}
      style={{ flex: `0 0 ${width}`, minWidth: 0, scrollSnapAlign: "start" }}
    >
      {item}
    </div>
  ));
}
