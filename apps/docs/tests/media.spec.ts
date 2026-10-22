import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("film playhead and thumbnails select frames with keyboard", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  await expect(page.getByRole("region", { name: "Studio film thumbnails", exact: true })).toHaveCSS(
    "scroll-snap-type",
    "x mandatory",
  );
  const playhead = page.getByRole("slider", { name: "Studio film playhead" });
  await playhead.focus();
  await expect(playhead).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(playhead).toHaveAttribute("aria-valuetext", "Frame 2: Compose");
  await expect(
    page
      .getByRole("region", { name: "Studio film selected frame" })
      .getByRole("img", { name: "Geometric study for compose" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Select frame 3: Respond" }).click();
  await expect(playhead).toHaveValue("2");
});
test("carousels navigate actual native positions and cyclic controls wrap", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  const region = page.getByRole("region", { name: "SnapCarousel", exact: true });
  await page.getByRole("button", { name: "Next SnapCarousel" }).click();
  await expect.poll(() => region.evaluate((node) => node.scrollLeft)).toBeGreaterThan(100);
  await region.focus();
  await page.keyboard.press("End");
  await expect(page.getByRole("button", { name: "Next SnapCarousel" })).toBeDisabled();
  const cyclic = page.getByRole("region", { name: "InfiniteCarousel", exact: true });
  await page.getByRole("button", { name: "Previous InfiniteCarousel" }).click();
  await expect.poll(() => cyclic.evaluate((node) => node.scrollLeft)).toBeGreaterThan(100);
  await page.getByRole("button", { name: "Next InfiniteCarousel" }).click();
  await expect.poll(() => cyclic.evaluate((node) => node.scrollLeft)).toBeLessThan(1);
});
test("comparison range updates descriptions and crop by keyboard", async ({ page }) => {
  await page.goto("/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  const slider = page.getByRole("slider", { name: "Compare geometric studies" });
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("100");
  await expect(slider).toHaveAttribute("aria-valuetext", "100% Accent frame");
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("0");
});
test("preview Escape restores its trigger and gallery order stays semantic", async ({ page }) => {
  await page.goto("/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  const trigger = page.getByRole("button", { name: "Preview a studio frame" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const link = page.getByRole("link", { name: "Preview reference", exact: true });
  await link.focus();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Reverse gallery order" }).click();
  await expect(page.getByRole("img", { name: "Gallery study: Respond" })).toBeVisible();
});
test("opt-in video preview plays locally and cancels with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  const video = page.getByLabel("Silent studio video");
  const supported = await video.evaluate((node) =>
    (node as HTMLVideoElement).canPlayType('video/webm; codecs="vp8"'),
  );
  test.skip(
    !supported,
    "This browser/platform has no WebM VP8 playback codec; native media controls are tested separately.",
  );
  await expect(video).toHaveAttribute("preload", "none");
  expect(await video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(true);
  await page.getByRole("checkbox", { name: "Enable hover video preview" }).check();
  await video.hover();
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(true);
});
test("film thumbnail rail supports mouse momentum and interruption", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  const rail = page.getByRole("region", { name: "Studio film thumbnails", exact: true });
  await rail.scrollIntoViewIfNeeded();
  const box = await rail.boundingBox();
  if (!box) throw new Error("No film bounds");
  await page.mouse.move(box.x + 200, box.y + 30);
  await page.mouse.down();
  await page.mouse.move(box.x + 70, box.y + 30, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => rail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(40);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(rail).toHaveCSS("scroll-snap-type", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("hover preserves already playing native video through leave and live reduction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  const video = page.getByLabel("Silent studio video");
  const supported = await video.evaluate((node) =>
    (node as HTMLVideoElement).canPlayType('video/webm; codecs="vp8"'),
  );
  test.skip(!supported, "This browser/platform has no WebM VP8 playback codec.");
  await page.getByRole("checkbox", { name: "Enable hover video preview" }).check();
  await video.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await video.evaluate(async (node) => {
    const player = node as HTMLVideoElement;
    player.loop = true;
    await player.play();
  });
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
  await video.hover();
  await page.mouse.move(0, 0);
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).paused)).toBe(false);
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`media fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/media", { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
    await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/media-top-${width}.png` });
      await page.getByRole("slider", { name: "Studio film playhead" }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/media-film-${width}.png` });
    }
  });
}
test("touch film selection and playhead work with native controls", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/media", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
  await page.getByRole("button", { name: "Select frame 4: Refine" }).tap();
  await expect(page.getByRole("slider", { name: "Studio film playhead" })).toHaveValue("3");
  const slider = page.getByRole("slider", { name: "Compare geometric studies" });
  await slider.tap();
  await expect(slider).toHaveAttribute("aria-valuetext", /Accent frame/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
