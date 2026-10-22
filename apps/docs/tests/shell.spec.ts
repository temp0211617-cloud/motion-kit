import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const widths = [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920];
for (const width of widths) {
  test(`docs shell fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Motion Kit", exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width === 320 || width === 1440) {
      await page.screenshot({ path: `test-results/shell-${width}.png`, fullPage: true });
    }
    await page.goto("/core");
    await expect(page.getByRole("heading", { name: "Core motion", exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    if (width === 320 || width === 1440) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.getByTestId("viewport-demo")).toHaveCSS("opacity", "1");
      await page.screenshot({ path: `test-results/core-${width}.png`, fullPage: true });
      await page.screenshot({ path: `test-results/core-top-${width}.png` });
      await page
        .getByRole("heading", { name: "API reference", exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/core-reference-${width}.png` });
    }
  });
}
test("shell accessibility and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("keyboard navigation and preset controls", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByLabel("Motion preset").selectOption("cinematic");
  await expect(page.getByText("0.55s · 40px entrance")).toBeVisible();
  await page.getByLabel("Reduce motion", { exact: true }).check();
  await page.getByRole("button", { name: "Replay entrance" }).click();
  await expect(page.getByText("Reduced motion · immediate transition")).toBeVisible();
  await expect(page.locator(".preview-mark")).toHaveCSS("transform", "none");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("live OS preference changes and mobile accessibility", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByText("0.32s · 24px entrance")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByText("Reduced motion · immediate transition")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("security headers and local-only network behavior", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:3100/")) external.push(request.url());
  });
  const response = await page.goto("/");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["x-frame-options"]).toBe("DENY");
  await page.getByRole("button", { name: "Replay entrance" }).click();
  expect(external).toEqual([]);
});
