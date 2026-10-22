import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("keyboard activation, named icons and controlled busy state", async ({ page }) => {
  await page.goto("/buttons");
  const action = page.getByRole("button", { name: "Activate action" });
  await action.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await expect(page.getByRole("status")).toHaveText("Activated 2 times");
  await page.getByRole("button", { name: "Add item" }).click();
  await expect(page.getByRole("status")).toHaveText("Activated 3 times");
  await page.getByRole("button", { name: "Toggle loading state" }).click();
  await expect(page.getByRole("button", { name: "Save draft" })).toBeDisabled();
  await page.getByRole("button", { name: "Toggle loading state" }).click();
  await expect(page.getByRole("button", { name: "Save draft" })).toBeEnabled();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("mouse enhancement has a reduced-motion fallback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/buttons");
  const tile = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "MagneticButton", exact: true }) });
  const button = tile.getByRole("button");
  await button.scrollIntoViewIfNeeded();
  const box = await button.boundingBox();
  if (!box) throw new Error("Missing button bounds");
  await page.mouse.move(box.x + 4, box.y + box.height / 2);
  await expect
    .poll(() => button.evaluate((node) => getComputedStyle(node).transform))
    .not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(button).toHaveCSS("transform", "none");
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`buttons fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/buttons");
    await expect(page.getByRole("heading", { name: "Press. Respond.", exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/buttons-top-${width}.png` });
      await page.getByRole("button", { name: "Save draft" }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/buttons-state-${width}.png` });
    }
  });
}

test("touch activation has no lingering magnetic displacement", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3100/buttons");
  const button = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "MagneticButton", exact: true }) })
    .getByRole("button");
  await button.tap();
  await expect(page.getByRole("status")).toHaveText("Activated 1 times");
  await expect(button).toHaveCSS("transform", "none");
  await context.close();
});
