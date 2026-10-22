import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("all categories remain reachable after navigating away from home", async ({ page }) => {
  await page.goto("/text");
  const nav = page.getByRole("navigation", { name: "Documentation" });
  await expect(nav.getByRole("link")).toHaveCount(18);
  await expect(nav.getByRole("link", { name: "Text", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("link", { name: "Cards", exact: true }).click();
  await expect(page).toHaveURL(/\/cards$/);
  await expect(nav.getByRole("link")).toHaveCount(18);
  await nav.getByRole("link", { name: "Playground", exact: true }).click();
  await expect(page).toHaveURL(/\/playground$/);
  await expect(nav.getByRole("link", { name: "Playground", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(page.getByRole("searchbox", { name: "Search components" })).toBeVisible();
});

test("catalog exposes every component and combines search with category filters", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".collection-card")).toHaveCount(12);
  await expect(page.locator(".collection-copy li")).toHaveCount(153);
  const search = page.getByRole("searchbox", { name: "Search components" });
  await search.fill("FadeUp");
  await expect(page.locator("#catalog").getByRole("status")).toHaveText("1 components");
  await page.getByText("Browse component names", { exact: true }).click();
  await expect(page.getByRole("link", { name: "FadeUp", exact: false })).toHaveAttribute(
    "href",
    "/core",
  );
  await page.getByRole("combobox", { name: "Collection", exact: true }).selectOption("text");
  await expect(page.getByText("No matching components.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#catalog").getByRole("status")).toHaveText("153 components");
  await page.getByRole("button", { name: "Grid", exact: true }).click();
  await expect(page.getByRole("button", { name: "Grid", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("six advanced studies have functional keyboard and touch-safe controls", async ({ page }) => {
  await page.goto("/playground");
  const selection = page.getByRole("group", { name: "Choose an advanced study" });
  await expect(selection.getByRole("button")).toHaveCount(6);
  await page.getByRole("button", { name: "Electric", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Selected artwork: Electric");
  await selection.getByRole("button", { name: /Spring field/ }).click();
  await page.getByRole("button", { name: "Right", exact: true }).click();
  await page.getByRole("slider", { name: /Spring stiffness/ }).press("End");
  await expect(page.getByRole("slider", { name: /Spring stiffness/ })).toHaveValue("400");
  await selection.getByRole("button", { name: /Perspective deck/ }).click();
  await page.getByRole("button", { name: "Next card" }).click();
  await expect(page.getByRole("status")).toHaveText("Card 2 of 4");
  await selection.getByRole("button", { name: /Layout morph/ }).click();
  await page.getByRole("button", { name: "Column", exact: true }).click();
  await expect(page.locator(".morph-stage")).toHaveClass(/morph-column/);
  await selection.getByRole("button", { name: /SVG drawing/ }).click();
  await page.getByRole("button", { name: "Replay drawing" }).click();
  await expect(page.getByRole("img", { name: "Animated looping vector signature" })).toBeVisible();
  await selection.getByRole("button", { name: /Scroll scene/ }).click();
  await page.getByRole("button", { name: "Jump to end" }).click();
  const scroller = page.getByRole("region", { name: "Scrollable sculpture scene" });
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
  await page.getByRole("button", { name: "Back to start" }).click();
  await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBe(0);
});

test("every study supports live reduction and has no axe violations", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/playground");
  const selection = page.getByRole("group", { name: "Choose an advanced study" });
  await page.getByLabel("Reduce lab motion").check();
  for (const name of [
    "Shared layout",
    "Spring field",
    "Perspective deck",
    "Layout morph",
    "SVG drawing",
    "Scroll scene",
  ]) {
    await selection.getByRole("button", { name: new RegExp(name) }).click();
    await expect(page.locator(".study-content")).toHaveAttribute("data-reduced-motion", "true");
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  await page.getByLabel("Reduce lab motion").uncheck();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".study-content")).toHaveAttribute("data-reduced-motion", "true");
  expect(errors).toEqual([]);
});

for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`showcase and all studies fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      await page.screenshot({ path: `test-results/showcase-${width}.png`, fullPage: true });
      await page.screenshot({ path: `test-results/showcase-top-${width}.png` });
    }
    await page.goto("/playground");
    for (const name of [
      "Shared layout",
      "Spring field",
      "Perspective deck",
      "Layout morph",
      "SVG drawing",
      "Scroll scene",
    ]) {
      await page
        .getByRole("group", { name: "Choose an advanced study" })
        .getByRole("button", { name: new RegExp(name) })
        .click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    if (width === 320 || width === 1440)
      await page.screenshot({ path: `test-results/playground-${width}.png`, fullPage: true });
  });
}
