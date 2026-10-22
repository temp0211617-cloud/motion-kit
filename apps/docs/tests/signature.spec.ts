import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("rolling statistics preserve truthful accessible values and stop for reduction", async ({
  page,
}) => {
  await page.goto("/showcase");
  const stats = page.locator(".rolling-stats");
  await stats.scrollIntoViewIfNeeded();
  await expect(stats.locator("strong .sr-only")).toHaveText(["153", "12", "6", "4"]);
  await expect(stats.locator(".digit-strip")).toHaveCount(7);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(stats.locator(".digit-strip")).toHaveCount(0);
  await expect(stats.locator("strong .sr-only")).toHaveText(["153", "12", "6", "4"]);
});

test("gallery changes arrangements, snaps a drag and supports native keyboard navigation", async ({
  page,
}) => {
  await page.goto("/showcase");
  const gallery = page.getByRole("region", { name: "Spatial product gallery" });
  await gallery.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Pause rotation", exact: true }).click();
  await expect(page.locator(".spatial-card")).toHaveCount(8);
  for (const mode of ["Ring", "Sphere", "Barrel", "Helix"]) {
    await page.getByRole("button", { name: mode, exact: true }).click();
    await expect(gallery).toHaveAttribute("data-layout", mode);
  }
  await page.getByRole("button", { name: "Next artwork" }).click();
  await expect(gallery).toHaveAttribute("data-selected", "1");
  await gallery.focus();
  await page.keyboard.press("ArrowRight");
  await expect(gallery).toHaveAttribute("data-selected", "2");
  const box = await gallery.boundingBox();
  if (!box) throw new Error("Missing gallery bounds");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(gallery).toHaveAttribute("data-selected", "1");
  await page.getByRole("button", { name: "Play rotation", exact: true }).click();
  await expect(gallery).toHaveAttribute("data-running", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(gallery).toHaveAttribute("data-running", "false");
  await expect(page.locator(".spatial-card")).toHaveCount(0);
  await expect(gallery.getByRole("img")).toBeVisible();
  await page.getByRole("button", { name: "Next artwork" }).click();
  await expect(gallery).toHaveAttribute("data-selected", "2");
  await expect(page.getByRole("button", { name: "Play rotation", exact: true })).toBeDisabled();
});

test("rotation pauses offscreen and normal-motion artwork is genuine 3D", async ({ page }) => {
  await page.goto("/showcase");
  const gallery = page.getByRole("region", { name: "Spatial product gallery" });
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-running", "true");
  await expect
    .poll(() =>
      page.locator(".spatial-space").evaluate((element) => getComputedStyle(element).transform),
    )
    .toContain("matrix3d");
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute("data-running", "false");
});

test("rich preview expands without losing focus and nav responds to hover and live reduction", async ({
  page,
}) => {
  await page.goto("/text");
  const nav = page.getByRole("navigation", { name: "Documentation" });
  const link = nav.getByRole("link", { name: "Showcase", exact: true });
  await link.hover();
  await expect
    .poll(() =>
      link
        .locator(".nav-letter-track")
        .first()
        .evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(link.locator(".nav-letter-track").first()).toHaveCSS("transform", "none");
  const tile = page.getByRole("button", { name: "Expand Mango ribbon preview" });
  await tile.click();
  await expect(tile).toHaveAttribute("data-expanded", "true");
  await expect(tile).toBeFocused();
  await tile.press("Enter");
  await expect(tile).toHaveAttribute("data-expanded", "false");
});

test("mobile touch keeps vertical scrolling and accessible gallery controls", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/showcase");
  await page.getByRole("button", { name: "Sphere", exact: true }).tap();
  const gallery = page.getByRole("region", { name: "Spatial product gallery" });
  await expect(gallery).toHaveAttribute("data-layout", "Sphere");
  await page.getByRole("button", { name: "Next artwork" }).tap();
  await expect(gallery).toHaveAttribute("data-selected", "1");
  const tile = page.getByRole("button", { name: "Expand Kiwi spiral preview" });
  await tile.tap();
  await expect(tile).toHaveAttribute("data-expanded", "true");
  await context.close();
});

for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`signature layouts fit ${width}px with accessible artwork`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/showcase");
    const gallery = page.getByRole("region", { name: "Spatial product gallery" });
    await gallery.scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Pause rotation", exact: true }).click();
    for (const mode of ["Helix", "Barrel", "Ring", "Sphere"]) {
      await page.getByRole("button", { name: mode, exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (width === 320 || width === 1440) {
        await gallery.evaluate((element) =>
          element.scrollIntoView({ block: "start", behavior: "instant" }),
        );
        await gallery.screenshot({
          path: `test-results/spatial-${mode.toLowerCase()}-${width}.png`,
        });
      }
    }
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(gallery).toHaveAttribute("data-running", "false");
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  });
}
