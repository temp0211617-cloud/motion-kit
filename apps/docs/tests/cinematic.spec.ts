import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Observe in the browser before activation so protocol latency cannot miss a short replay.
const curtainOpening = (page: Page) =>
  page.waitForFunction(
    () => {
      const panel = document.querySelector(".curtain-stage > [aria-hidden=true]");
      return panel !== null && new DOMMatrix(getComputedStyle(panel).transform).m11 > 0.01;
    },
    undefined,
    { polling: "raf", timeout: 5000 },
  );
test("Curtains replay uses two panels and focused content completes immediately", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/cinematic");
  const stage = page.locator(".curtain-stage"),
    panels = stage.locator(":scope > [aria-hidden=true]");
  await stage.scrollIntoViewIfNeeded();
  await expect(panels).toHaveCount(2);
  await expect(panels.first()).toHaveAttribute("inert", "");
  const input = page.getByRole("textbox", { name: "Scene draft" });
  await input.fill("A persistent idea");
  const replay = page.getByRole("button", { name: "Replay Curtains", exact: true });
  await replay.focus();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toBeInViewport();
  await Promise.all([curtainOpening(page), page.keyboard.press("Enter")]);
  await input.focus();
  await expect
    .poll(() =>
      panels.first().evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m11),
    )
    .toBe(0);
  await expect(input).toHaveValue("A persistent idea");
  await expect(input).toBeFocused();
  await expect(stage.getByRole("heading", { name: "Let the scene breathe." })).toHaveCount(1);
  await page.screenshot({ path: "test-results/curtains-focused.png" });
});
test("Curtains finishes on live reduction and replay remains static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/cinematic");
  const stage = page.locator(".curtain-stage"),
    panel = stage.locator(":scope > [aria-hidden=true]").first();
  await stage.scrollIntoViewIfNeeded();
  await expect
    .poll(() => panel.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m11))
    .toBe(0);
  await Promise.all([
    curtainOpening(page),
    page.getByRole("button", { name: "Replay Curtains", exact: true }).click(),
  ]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() => panel.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m11))
    .toBe(0);
  await page.getByRole("button", { name: "Replay Curtains", exact: true }).click();
  await expect
    .poll(() => panel.evaluate((node) => new DOMMatrix(getComputedStyle(node).transform).m11))
    .toBe(0);
});
test("lazy depth stays flat on focus and preserves drafts across layout and preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/cinematic");
  const input = page.getByRole("textbox", { name: "Depth draft" });
  await input.fill("Still here");
  const inner = input.locator("../../..");
  await expect(inner).toHaveCSS("transform", "none");
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(input).toHaveValue("Still here");
  await expect(inner).toHaveCSS("transform", "none");
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`cinematic fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/cinematic");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.locator(".curtain-stage").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/curtains-${width}.png` });
    }
  });
}
test("touch replay preserves a usable static scene and safe local media", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:3100/")) external.push(request.url());
  });
  await page.goto("http://127.0.0.1:3100/cinematic");
  await page.getByRole("button", { name: "Replay Curtains", exact: true }).tap();
  const input = page.getByRole("textbox", { name: "Scene draft" });
  await input.fill("Touch idea");
  await expect(input).toHaveValue("Touch idea");
  await expect(input).toBeFocused();
  await page.getByRole("link", { name: "Explore the Curtains API", exact: true }).tap();
  await expect(page).toHaveURL(/#reference$/);
  await expect(
    page.getByRole("heading", { name: "Cinematic reference", exact: true }),
  ).toBeInViewport();
  expect(external).toEqual([]);
  await context.close();
});
