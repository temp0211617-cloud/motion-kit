import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mouse trails mount bounded decorations, hide on focus and leave native controls usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/experimental");
  const trail = page.locator(".cursortrail-demo");
  await trail.scrollIntoViewIfNeeded();
  const box = await trail.boundingBox();
  if (!box) throw new Error("No trail bounds");
  await page.mouse.move(box.x + 40, box.y + 50);
  await expect(trail.locator(":scope > [aria-hidden=true] span")).toHaveCount(6);
  expect(await trail.evaluate((node) => getComputedStyle(node).cursor)).not.toBe("none");
  const control = page.getByRole("button", { name: "Mark CursorTrail", exact: true });
  await control.focus();
  await expect(trail.locator(":scope > [aria-hidden=true] span")).toHaveCount(0);
  await page.keyboard.press("Space");
  await expect(page.getByText("CursorTrail marks: 1", { exact: true })).toBeVisible();
  const image = page.locator(".imagetrail-demo");
  await expect(image.locator("img")).toHaveCount(0);
  await image.scrollIntoViewIfNeeded();
  const imageBox = await image.boundingBox();
  if (!imageBox) throw new Error("No image trail bounds");
  await page.mouse.move(imageBox.x + 40, imageBox.y + 50);
  await expect(image.locator("img")).toHaveCount(4);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(image.locator("img")).toHaveCount(0);
});
test("field pulse finishes and live reduction releases the lazy noise filter", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/experimental");
  await expect(page.locator("feTurbulence")).toHaveCount(0);
  const aurora = page.locator(".aurorabackground-demo");
  await aurora.scrollIntoViewIfNeeded();
  const paint = aurora.locator(":scope > [aria-hidden=true] > div");
  await expect
    .poll(() => paint.evaluate((node) => Number(getComputedStyle(node).opacity)))
    .toBeGreaterThan(0.09);
  await expect
    .poll(() => paint.evaluate((node) => Number(getComputedStyle(node).opacity)))
    .toBeCloseTo(0.08, 3);
  const noise = page.locator(".noisefield-demo");
  await noise.scrollIntoViewIfNeeded();
  await expect(noise.locator("feTurbulence")).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(noise.locator("feTurbulence")).toHaveCount(0);
});
test("focused liquid and distortion remain flat with persistent native input", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/experimental");
  const control = page.getByRole("button", { name: "Mark DistortionHover", exact: true });
  await control.focus();
  await expect(page.locator(".distortionhover-demo > div")).toHaveCSS("transform", "none");
  const input = page.getByRole("textbox", { name: "Liquid draft", exact: true });
  await input.fill("One idea");
  await expect(page.locator(".liquidreveal-demo")).toHaveCSS("clip-path", "inset(0% round 0%)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(input).toHaveValue("One idea");
});
test("missing visibility support leaves readable static fields without a noise filter", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "IntersectionObserver", { value: undefined, configurable: true });
  });
  await page.goto("/experimental");
  await page.locator(".noisefield-demo").scrollIntoViewIfNeeded();
  await expect(page.locator("feTurbulence")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "NoiseField", exact: true })).toBeVisible();
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`experimental fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/experimental");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.locator(".cursortrail-demo").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/experimental-${width}.png` });
    }
  });
}
test("touch marks native controls without a cursor trail or external requests", async ({
  browser,
}) => {
  const context = await browser.newContext({
      hasTouch: true,
      isMobile: browser.browserType().name() !== "firefox",
      viewport: { width: 390, height: 844 },
    }),
    page = await context.newPage();
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:3100/")) external.push(request.url());
  });
  await page.goto("http://127.0.0.1:3100/experimental");
  await page.getByRole("button", { name: "Mark CursorTrail", exact: true }).tap();
  await expect(page.getByText("CursorTrail marks: 1", { exact: true })).toBeVisible();
  await expect(page.locator(".cursortrail-demo > [aria-hidden=true] span")).toHaveCount(0);
  expect(external).toEqual([]);
  await context.close();
});
