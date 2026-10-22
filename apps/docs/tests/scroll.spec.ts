import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("signature story preserves state and stacks for narrow and reduced layouts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/scroll");
  const media = page.getByTestId("observe-media").locator("..");
  const note = page.getByRole("textbox", { name: "Story note" });
  await note.fill("Keep this story draft");
  await expect(media).toHaveCSS("position", "sticky");
  await media.locator("..").evaluate((node) => node.scrollIntoView({ block: "start" }));
  await page.evaluate(() => window.scrollBy(0, 160));
  await expect.poll(async () => (await media.boundingBox())?.y ?? -1).toBeGreaterThanOrEqual(20);
  await expect.poll(async () => (await media.boundingBox())?.y ?? 999).toBeLessThanOrEqual(28);
  await page.screenshot({ path: "test-results/scroll-sticky-desktop.png" });
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(media).toHaveCSS("position", "static");
  await expect(note).toHaveValue("Keep this story draft");
  await note.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/scroll-stacked-mobile.png" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(media).toHaveCSS("position", "sticky");
  await page.getByRole("checkbox", { name: "Reduce scroll motion" }).check();
  await expect(media).toHaveCSS("position", "static");
  await expect(note).toHaveValue("Keep this story draft");
});
test("chapter links use native keyboard navigation and announce the active chapter", async ({
  page,
}) => {
  await page.goto("/scroll");
  const nav = page.getByRole("navigation", { name: "Story chapters" });
  const compose = nav.getByRole("link", { name: "Compose", exact: true });
  await compose.focus();
  await page.keyboard.press("Enter");
  await expect(compose).toHaveAttribute("aria-current", "step");
  await expect(page.getByTestId("compose-media")).toBeInViewport();
});
test("page progress follows scrolling and horizontal rail accepts keyboard input", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/scroll");
  const meter = page.getByRole("progressbar", { name: "Page reading progress", exact: true });
  await expect(meter).toHaveAttribute("aria-valuenow", "0");
  const rail = page.getByRole("region", { name: "Horizontal sample rail" });
  await rail.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => rail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect
    .poll(async () => Number(await meter.getAttribute("aria-valuenow")))
    .toBeGreaterThan(95);
});
test("interactive effects flatten on keyboard focus and live OS reduction", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/scroll");
  const link = page.getByRole("link", { name: "Focus Parallax reference", exact: true });
  await link.focus();
  await expect(link.locator("../..")).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(link.locator("../..")).toHaveCSS("transform", "none");
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`scroll fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/scroll");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/scroll-top-${width}.png` });
      await page.getByTestId("observe-media").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/scroll-story-${width}.png` });
    }
  });
}
test("touch chapter navigation reaches complete stacked content", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/scroll");
  await page
    .getByRole("navigation", { name: "Story chapters" })
    .getByRole("link", { name: "Compose", exact: true })
    .tap();
  await expect(page.getByTestId("compose-media")).toBeInViewport();
  await expect(page.getByTestId("compose-media").locator("..")).toHaveCSS("position", "static");
  await context.close();
});
