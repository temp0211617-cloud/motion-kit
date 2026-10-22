import { expect, test, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function coordinate(track: Locator) {
  return track.evaluate((node) => {
    const value = getComputedStyle(node).transform;
    return value === "none" ? 0 : new DOMMatrix(value).m41;
  });
}

test("hidden documents stop ticker frames and resume without a time jump", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  const track = page
    .getByRole("region", { name: "Live rail", exact: true })
    .locator("[data-ticker-track]");
  await page.getByRole("button", { name: "Play Live rail", exact: true }).click();
  await expect.poll(() => coordinate(track)).toBeLessThan(-1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const paused = await coordinate(track);
  await page.waitForTimeout(180);
  expect(Math.abs((await coordinate(track)) - paused)).toBeLessThan(1);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => coordinate(track)).toBeLessThan(paused - 1);
});
test("LiveTicker moves at true speed, pauses and excludes visual clones", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  const region = page.getByRole("region", { name: "Live rail", exact: true });
  const track = region.locator("[data-ticker-track]");
  await page.getByRole("button", { name: "Play Live rail", exact: true }).click();
  await expect.poll(() => coordinate(track)).toBeLessThan(-1);
  const speed = await track.evaluate(async (node) => {
    const position = () => new DOMMatrix(getComputedStyle(node).transform).m41;
    const start = performance.now();
    const before = position();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return (before - position()) / ((performance.now() - start) / 1000);
  });
  expect(speed).toBeGreaterThan(30);
  expect(speed).toBeLessThan(52);
  await page.getByRole("button", { name: "Pause Live rail", exact: true }).click();
  const paused = await coordinate(track);
  await page.waitForTimeout(150);
  expect(Math.abs((await coordinate(track)) - paused)).toBeLessThan(1);
  await expect(page.locator("#ticker-first-word")).toHaveCount(1);
  const copies = region.locator("[data-ticker-copy]");
  expect(await copies.count()).toBeGreaterThan(1);
  await expect(copies.nth(1)).toHaveAttribute("inert", "");
  await expect(copies.nth(1)).toHaveAttribute("aria-hidden", "true");
});
test("drag rail has keyboard and pointer control with finite momentum", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  const region = page.getByRole("region", { name: "Drag rail", exact: true });
  const track = region.locator("[data-ticker-track]");
  await expect(page.getByRole("button", { name: "Play Drag rail", exact: true })).toBeEnabled();
  await region.focus();
  await expect(region).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => coordinate(track)).toBeLessThan(-30);
  await page.keyboard.press("Home");
  await expect.poll(() => coordinate(track)).toBe(0);
  await region.scrollIntoViewIfNeeded();
  const box = await region.boundingBox();
  if (!box) throw new Error("No drag bounds");
  await page.mouse.move(box.x + 200, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + box.height / 2, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(900);
  const settled = await coordinate(track);
  expect(settled).toBeLessThan(-30);
  await page.waitForTimeout(150);
  expect(Math.abs((await coordinate(track)) - settled)).toBeLessThan(1);
});
test("ruler controls change the center mark and stop on live reduction", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  const region = page.getByRole("region", { name: "Ruler rail", exact: true });
  const wrapper = region.locator("../..");
  await expect(page.getByRole("button", { name: "Play Ruler rail", exact: true })).toBeEnabled();
  await region.focus();
  await expect(region).toBeFocused();
  const before = await wrapper.locator("output").textContent();
  await page.keyboard.press("ArrowRight");
  await expect(wrapper.locator("output")).not.toHaveText(before ?? "");
  await page.getByRole("button", { name: "Play Ruler rail", exact: true }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "Ruler rail: static layout", exact: true }),
  ).toBeDisabled();
  await expect(region.locator("[data-ticker-copy]")).toHaveCount(1);
  await expect(region.locator("[data-ticker-track]")).toHaveCSS("transform", "none");
});
test("resizing a live rail preserves coverage and offscreen pauses frames", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  const region = page.getByRole("region", { name: "Live rail", exact: true });
  const track = region.locator("[data-ticker-track]");
  await page.getByRole("button", { name: "Play Live rail", exact: true }).click();
  await expect.poll(() => coordinate(track)).toBeLessThan(-1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(region.locator("[data-ticker-copy]")).not.toHaveCount(1);
  const coverage = await region.evaluate((node) => {
    const track = node.querySelector("[data-ticker-track]")?.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    return !!track && track.left <= box.left + 1 && track.right >= box.right;
  });
  expect(coverage).toBe(true);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const paused = await coordinate(track);
  await page.waitForTimeout(150);
  expect(Math.abs((await coordinate(track)) - paused)).toBeLessThan(1);
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`tickers fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/ticker");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/ticker-top-${width}.png` });
      await page.getByRole("region", { name: "Ruler rail", exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/ticker-ruler-${width}.png` });
    }
  });
}
test("touch rail supports keyboard fallback and static preference without overflow", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:3100/ticker");
  const region = page.getByRole("region", { name: "Drag rail", exact: true });
  await region.scrollIntoViewIfNeeded();
  const box = await region.boundingBox();
  if (!box) throw new Error("No touch bounds");
  if (browser.browserType().name() === "chromium") {
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + 200, y: box.y + box.height / 2, id: 0 }],
    });
    for (let index = 1; index <= 6; index++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: box.x + 200 - index * 20, y: box.y + box.height / 2, id: 0 }],
      });
      await page.waitForTimeout(20);
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    test.info().annotations.push({
      type: "coverage",
      description:
        "Native touch pan injection requires Chromium CDP; this engine validates touch activation and keyboard movement.",
    });
    await region.focus();
    await page.keyboard.press("ArrowRight");
  }
  await expect.poll(() => coordinate(region.locator("[data-ticker-track]"))).toBeLessThan(-30);
  await page.getByRole("button", { name: "Play Drag rail", exact: true }).tap();
  await expect(page.getByRole("button", { name: "Pause Drag rail", exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: "Reduce ticker motion" }).check();
  await expect(
    page.getByRole("button", { name: "Drag rail: static layout", exact: true }),
  ).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
test("a real loop boundary keeps measured coverage", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  const play = page.getByRole("button", { name: "Play Live rail", exact: true });
  // SSR is static: wait for the demo's client controls before editing controlled input.
  await expect(play).toBeEnabled();
  await page.getByRole("spinbutton", { name: "Live rail speed" }).fill("240");
  await play.click();
  const region = page.getByRole("region", { name: "Live rail", exact: true });
  await region.scrollIntoViewIfNeeded();
  const result = await region.evaluate(async (node) => {
    const track = node.querySelector("[data-ticker-track]");
    const first = node.querySelector('[data-ticker-copy="0"]');
    if (!track || !first) throw new Error("Unmeasured loop");
    const length = first.getBoundingClientRect().width;
    if (length <= 0) throw new Error("Empty loop measurement");
    const coordinate = () => {
      const transform = getComputedStyle(track).transform;
      return transform === "none" ? 0 : new DOMMatrix(transform).m41;
    };
    // A frame count is not elapsed time: engines and displays can run at different rates.
    const started = performance.now(),
      deadline = started + (length / 240) * 1000 + 2000;
    let previous = coordinate(),
      minimum = previous,
      maximum = previous,
      samples = 0,
      crossed = false,
      covered = true;
    while (!crossed && performance.now() < deadline) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const x = coordinate();
      samples++;
      minimum = Math.min(minimum, x);
      maximum = Math.max(maximum, x);
      if (x - previous > length / 2) {
        crossed = true;
        const rect = track.getBoundingClientRect(),
          bounds = node.getBoundingClientRect();
        covered = rect.left <= bounds.left + 1 && rect.right >= bounds.right;
      }
      previous = x;
    }
    return {
      crossed,
      covered,
      length,
      minimum,
      maximum,
      samples,
      elapsed: performance.now() - started,
      hidden: document.hidden,
      bounds: node.getBoundingClientRect().toJSON(),
    };
  });
  expect(result, JSON.stringify(result)).toMatchObject({ crossed: true, covered: true });
});
test("missing observers produce one readable static copy", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "IntersectionObserver", { value: undefined, configurable: true });
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  await expect(
    page.getByRole("button", { name: "Live rail: static layout", exact: true }),
  ).toBeDisabled();
  const region = page.getByRole("region", { name: "Live rail", exact: true });
  await expect(region.locator("[data-ticker-copy]")).toHaveCount(1);
  expect(await region.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
});
test("ruler drag settles on a snap mark", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ticker");
  const region = page.getByRole("region", { name: "Ruler rail", exact: true });
  await region.scrollIntoViewIfNeeded();
  const box = await region.boundingBox();
  if (!box) throw new Error("No ruler bounds");
  await page.mouse.move(box.x + 220, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 20, { steps: 8 });
  await page.mouse.up();
  const track = region.locator("[data-ticker-track]");
  await expect.poll(() => coordinate(track)).toBeLessThan(-40);
  await expect
    .poll(async () => {
      const offset = Math.abs(await coordinate(track));
      const remainder = offset % 40;
      return Math.min(remainder, 40 - remainder);
    })
    .toBeLessThan(0.5);
});
