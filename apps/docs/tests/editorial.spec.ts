import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("ruler chapters track native keyboard navigation and progress", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/editorial");
  const nav = page.getByRole("navigation", { name: "Project ruler", exact: true });
  const link = nav.getByRole("link", { name: /Compose/ });
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(link).toHaveAttribute("aria-current", "location");
  const meter = page.getByRole("progressbar", { name: "Project ruler reading progress" });
  await expect
    .poll(async () => Number(await meter.getAttribute("aria-valuenow")))
    .toBeGreaterThan(15);
  await expect(page.getByRole("heading", { name: "Compose", exact: true })).toBeInViewport();
});
test("editorial slider navigates, completes focused entrances and reduces live", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/editorial");
  await page.getByRole("button", { name: "Next Editorial stories" }).click();
  await expect(page.getByRole("heading", { name: "Space to compose.", exact: true })).toBeVisible();
  const link = page.getByRole("link", { name: "Read compose reference", exact: true });
  await link.focus();
  await expect(link.locator("../..")).toHaveCSS("clip-path", "inset(0%)");
  await page.getByRole("button", { name: "Play Editorial stories", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Editorial stories: static playback", exact: true }),
  ).toBeDisabled();
});
test("slider supports keyboard and mouse swipe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/editorial");
  const region = page.getByRole("region", { name: "Editorial stories", exact: true });
  await region.focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("heading", { name: "A clear response.", exact: true })).toBeVisible();
  await page.keyboard.press("Home");
  const image = region.getByRole("img", { name: "Editorial study: Observe", exact: true });
  await image.scrollIntoViewIfNeeded();
  const box = await image.boundingBox();
  if (!box) throw new Error("No slider bounds");
  await page.mouse.move(box.x + 200, box.y + 50);
  await page.mouse.down();
  await page.mouse.move(box.x + 80, box.y + 50, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("heading", { name: "Space to compose.", exact: true })).toBeVisible();
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`editorial fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/editorial");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page
        .getByRole("region", { name: "Editorial stories", exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/editorial-slider-${width}.png` });
      await page
        .getByRole("navigation", { name: "Project ruler", exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/editorial-ruler-${width}.png` });
    }
  });
}
test("touch chapter links and slider controls remain usable", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/editorial");
  await page.getByRole("button", { name: "Next Editorial stories" }).tap();
  await expect(page.getByRole("heading", { name: "Space to compose.", exact: true })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Project ruler", exact: true })
    .getByRole("link", { name: /Respond/ })
    .tap();
  await expect(page.getByRole("heading", { name: "Respond", exact: true })).toBeInViewport();
  await context.close();
});
