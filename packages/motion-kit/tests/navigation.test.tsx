import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { AnimatedTabs, AnimatedModal, type TabItem } from "../src/navigation";
import { MotionProvider } from "../src/providers/MotionProvider";
import { lockScroll } from "../src/navigation/scroll-lock";
it("skips disabled tabs and preserves hidden panel drafts", () => {
  render(
    <MotionProvider reducedMotion="always">
      <AnimatedTabs
        label="Chapters"
        items={[
          {
            id: "a",
            label: "A",
            children: (
              <label>
                Draft
                <input />
              </label>
            ),
          },
          { id: "disabled", label: "Disabled", disabled: true, children: "Unavailable" },
          { id: "b", label: "B", children: "Second" },
        ]}
      />
    </MotionProvider>,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "Draft" }), {
    target: { value: "Preserved" },
  });
  fireEvent.keyDown(screen.getByRole("tab", { name: "A" }), { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: "B" })).toHaveFocus();
  expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
  fireEvent.keyDown(screen.getByRole("tab", { name: "B" }), { key: "Home" });
  expect(screen.getByRole("textbox", { name: "Draft" })).toHaveValue("Preserved");
});
it("reports controlled tab requests without mutating the selected value", () => {
  const onValueChange = vi.fn();
  render(
    <MotionProvider reducedMotion="always">
      <AnimatedTabs
        value="a"
        onValueChange={onValueChange}
        label="Controlled"
        items={[
          { id: "a", label: "One", children: "First" },
          { id: "b", label: "Two", children: "Second" },
        ]}
      />
    </MotionProvider>,
  );
  fireEvent.click(screen.getByRole("tab", { name: "Two" }));
  expect(onValueChange).toHaveBeenCalledWith("b");
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
});
it("nested scroll locks preserve existing inline styles until the final owner releases", () => {
  const original = document.body.style.cssText;
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "7px";
  const first = lockScroll(),
    second = lockScroll();
  first();
  first();
  expect(document.body.style.overflow).toBe("hidden");
  second();
  expect(document.body.style.overflow).toBe("auto");
  expect(document.body.style.paddingRight).toBe("7px");
  document.body.style.cssText = original;
});
it("renders a named closed native dialog safely on the server", () => {
  const html = renderToString(
    <MotionProvider>
      <AnimatedModal open title="Project & notes" onOpenChange={() => {}}>
        <p>Readable content</p>
      </AnimatedModal>
    </MotionProvider>,
  );
  expect(html).toContain("Project &amp; notes");
  expect(html).toContain("aria-labelledby");
  expect(html).not.toMatch(/<dialog[^>]*\bopen=/);
});

it("updates controlled selection and keyed panel relationships after reordering or disabling items", () => {
  const onValueChange = vi.fn();
  const items: TabItem[] = [
    { id: "a", label: "One", children: <input aria-label="Controlled draft" /> },
    { id: "b", label: "Two", children: <p>Second</p> },
  ];
  const view = (value: string, current = items) => (
    <MotionProvider reducedMotion="always">
      <AnimatedTabs
        value={value}
        onValueChange={onValueChange}
        label="Dynamic tabs"
        items={current}
      />
    </MotionProvider>
  );
  const { rerender } = render(view("a"));
  fireEvent.change(screen.getByRole("textbox", { name: "Controlled draft" }), {
    target: { value: "Kept across reorder" },
  });
  rerender(view("b"));
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  rerender(view("a", [items[1]!, items[0]!]));
  expect(screen.getByRole("textbox", { name: "Controlled draft" })).toHaveValue(
    "Kept across reorder",
  );
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
    "aria-controls",
    screen.getByRole("tabpanel", { name: "One" }).id,
  );
  rerender(view("a", [{ ...items[0]!, disabled: true }, items[1]!]));
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  expect(onValueChange).not.toHaveBeenCalled();
});
