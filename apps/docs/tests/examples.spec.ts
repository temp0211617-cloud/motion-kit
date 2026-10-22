import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("composed examples support transitions, ticker controls and modal focus", async ({ page }) => {
  await page.goto("/examples");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Small details");
  await page.getByRole("button", { name: "Next trail artwork" }).click();
  await expect(page.locator("#trail [role=status]")).toHaveText("Strawberry arch");
  await page.getByRole("button", { name: "Pause Forward ideas", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Play Forward ideas", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Revenue", exact: true }).click();
  await expect(page.locator(".mini-metric")).toContainText("$18,420");
  await expect(page.getByRole("button", { name: "Revenue", exact: true })).toBeFocused();
  const tile = page.locator(".archive-tile").first();
  await tile.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close artwork" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(tile).toBeFocused();
});
for (const reduced of [false, true])
  test(`examples responsive and accessible reduced=${reduced}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
    await page.goto("/examples");
    for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true);
    }
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
    if (reduced) {
      await expect(page.locator(".archive-stage")).toHaveClass(/archive-static/);
      await expect(page.getByRole("button", { name: "Move gallery left" })).toBeDisabled();
    }
    await page.locator("#grid-study").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `../../artifacts/examples-grid-${reduced ? "reduced" : "desktop"}.png`,
    });
  });

test("cursor movement and bounded gallery drag remain functional", async ({ page }) => {
  await page.goto("/examples");
  const trail = page.locator(".trail-stage");
  await trail.scrollIntoViewIfNeeded();
  const b = await trail.boundingBox();
  if (!b) throw Error("No trail bounds");
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.move(b.x + b.width / 2 + 80, b.y + b.height / 2 + 30, { steps: 8 });
  await expect(page.locator(".trail-stack")).toHaveAttribute("data-following", "true");
  await expect
    .poll(() => page.locator(".trail-stack").evaluate((n) => getComputedStyle(n).transform))
    .not.toBe("none");
  await trail.screenshot({ path: "../../artifacts/examples-trail.png" });
  await page
    .locator(".transition-stage")
    .screenshot({ path: "../../artifacts/examples-dashboard.png" });
  const sheet = page.locator(".archive-sheet");
  await sheet.scrollIntoViewIfNeeded();
  const p = await sheet.boundingBox();
  if (!p) throw Error("No sheet bounds");
  await page.mouse.move(p.x + p.width / 2, p.y + 80);
  await page.mouse.down();
  await page.mouse.move(p.x + p.width / 2 + 70, p.y + 90, { steps: 10 });
  await page.mouse.up();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.locator(".archive-tile").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Reset position" }).click();
  await expect
    .poll(() => sheet.evaluate((n) => new DOMMatrix(getComputedStyle(n).transform).m41))
    .toBe(0);
});
test("touch users can browse and inspect artworks", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/examples");
  await page.getByRole("button", { name: "Next trail artwork" }).tap();
  await expect(page.locator("#trail [role=status]")).toContainText("Strawberry");
  await page.locator(".archive-tile").first().tap();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close artwork" }).tap();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.screenshot({ path: "../../artifacts/examples-mobile.png" });
  await context.close();
});
