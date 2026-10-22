import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("text controls, complete names and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/text");
  await page.getByRole("button", { name: "Update value" }).click();
  const numbers = page.locator("section").filter({
    has: page.getByRole("heading", { name: "AnimatedNumber / NumberTicker", exact: true }),
  });
  await expect(numbers.locator('p > span > span[aria-hidden="true"]')).toHaveText([
    "2,480",
    "2,480",
  ]);
  await expect(page.getByText("2,480").first()).toBeAttached();
  await page.getByRole("button", { name: "Change text" }).click();
  await expect(page.getByText("The next idea.").first()).toBeAttached();
  await expect(page.getByRole("button", { name: "Reduced motion enabled" }).first()).toBeDisabled();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});
test("ticker plays, pauses and stops on a live preference change", async ({ page }) => {
  await page.goto("/text");
  const section = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "TextTicker", exact: true }) });
  const rail = section.locator('div[aria-hidden="true"] > div');
  const initial = await rail.evaluate((node) => getComputedStyle(node).transform);
  await section.getByRole("button", { name: "Play text ticker" }).click();
  await expect
    .poll(() => rail.evaluate((node) => getComputedStyle(node).transform))
    .not.toBe(initial);
  await expect(section.getByRole("button", { name: "Pause text ticker" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await section.getByRole("button", { name: "Pause text ticker" }).click();
  await expect(section.getByRole("button", { name: "Play text ticker" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section.getByRole("button", { name: "Reduced motion enabled" })).toBeDisabled();
  await expect(section.locator('div[aria-hidden="true"] > div')).toHaveCSS("transform", "none");
});

for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`text fits ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/text");
    await expect(page.getByRole("heading", { name: "Text in motion", exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/text-top-${width}.png` });
      await page.getByRole("heading", { name: "TextTicker", exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/text-ticker-${width}.png` });
    }
  });
}
