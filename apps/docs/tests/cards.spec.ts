import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("native disclosure and explicit reveal work by keyboard", async ({ page }) => {
  await page.goto("/cards");
  const summary = page.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("link", { name: "Expanded reference", exact: true })).toBeVisible();
  const toggle = page.getByRole("button", { name: "HoverRevealCard", exact: true });
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Revealed reference", exact: true })).toBeVisible();
});
test("tilt cancels when live reduced motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/cards");
  const card = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "TiltCard", exact: true }) });
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  if (!box) throw new Error("No card bounds");
  await page.mouse.move(box.x + 5, box.y + 5);
  await expect
    .poll(() => card.evaluate((node) => getComputedStyle(node).transform))
    .not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).toHaveCSS("transform", "none");
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`cards fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cards");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/cards-top-${width}.png` });
      await page
        .getByRole("button", { name: "HoverRevealCard", exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/cards-disclosure-${width}.png` });
    }
  });
}
test("parallax keeps child state through viewport and preference changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/cards");
  const note = page.getByRole("textbox", { name: "Parallax note" });
  await note.fill("Keep this draft");
  await page
    .getByRole("heading", { name: "Give content a home.", exact: true })
    .scrollIntoViewIfNeeded();
  await note.scrollIntoViewIfNeeded();
  await expect(note).toHaveValue("Keep this draft");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(note).toHaveValue("Keep this draft");
});
test("touch reveals details while pointer surfaces remain flat", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/cards");
  const toggle = page.getByRole("button", { name: "HoverRevealCard", exact: true });
  await toggle.tap();
  await expect(page.getByRole("link", { name: "Revealed reference", exact: true })).toBeVisible();
  const card = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "TiltCard", exact: true }) });
  await card.tap();
  await expect(card).toHaveCSS("transform", "none");
  await context.close();
});

test("spotlight geometry refreshes after viewport changes without per-move reads", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/cards");
  const card = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "SpotlightCard", exact: true }) });
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  if (!box) throw new Error("No spotlight bounds");
  await page.mouse.move(box.x + 30, box.y + 30);
  const light = card.locator(":scope > [aria-hidden=true]");
  // Native pointer coordinates can round while layout bounds retain fractional pixels.
  const spotlightError = (expected: number) =>
    light.evaluate((node, position) => {
      const center = getComputedStyle(node).backgroundImage.match(
        /circle at ([\d.-]+)px ([\d.-]+)px/,
      );
      if (!center) throw new Error("Missing spotlight center");
      return Math.max(
        Math.abs(Number(center[1]) - position),
        Math.abs(Number(center[2]) - position),
      );
    }, expected);
  await expect.poll(() => spotlightError(30)).toBeLessThan(1);
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await page.mouse.move(box.x + 40, box.y + 40);
  await expect.poll(() => spotlightError(40)).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(light).toHaveCSS("opacity", "0");
});
