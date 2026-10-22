import { expect, test } from "@playwright/test";
const routes = [
  "/",
  "/core",
  "/text",
  "/buttons",
  "/gestures",
  "/cards",
  "/scroll",
  "/ticker",
  "/media",
  "/editorial",
  "/cinematic",
  "/navigation",
  "/experimental",
];
const widths = [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920];
async function frames(page: import("@playwright/test").Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}
for (const width of widths)
  for (const reducedMotion of ["reduce", "no-preference"] as const) {
    test(`all routes fit ${width}px with ${reducedMotion}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion });
      for (const route of routes) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(page.locator("body")).toHaveCSS("color", "rgb(243, 244, 237)");
        await frames(page);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${route} top`,
        ).toBe(true);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
        await frames(page);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${route} middle`,
        ).toBe(true);
      }
    });
  }
for (const width of widths)
  test(`long content fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/audit");
    await frames(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole("button", { name: "Open long modal", exact: true }).click();
    const modal = page.locator("dialog[open]");
    await expect(modal).toBeVisible();
    expect(await modal.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(modal).toHaveCount(0);
    await page.getByRole("button", { name: "Open long drawer", exact: true }).click();
    const drawer = page.locator("dialog[open]");
    await expect(drawer).toBeVisible();
    expect(await drawer.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    const note = page.getByRole("textbox", { name: "Long drawer note", exact: true });
    await note.fill("A reachable note");
    await expect(note).toBeInViewport();
    if (width === 320 || width === 1440)
      await page.screenshot({ path: `test-results/long-drawer-${width}.png` });
  });
test("drawer entrance avoids an unintended horizontal scroller", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/navigation");
  await page.getByRole("button", { name: "Open notes drawer", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Reading notes", exact: true })).toHaveCSS(
    "overflow-x",
    "hidden",
  );
});
