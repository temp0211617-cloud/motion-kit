import { expect, test, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const translation = (node: Locator) =>
  node.evaluate((element) => {
    const value = getComputedStyle(element).transform;
    return value === "none" ? 0 : new DOMMatrix(value).m41;
  });

test("native press and long-hold alternatives activate exactly once", async ({ page }) => {
  await page.goto("/gestures");
  const mark = page.getByRole("button", { name: "Mark study", exact: true });
  await mark.focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("Press marks: 1", { exact: true })).toBeVisible();
  const hold = page.getByRole("button", { name: "Hold study", exact: true });
  await hold.focus();
  await page.keyboard.down("Space");
  await page.waitForTimeout(700);
  await page.keyboard.up("Space");
  await expect(page.getByText("Hold marks: 1", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Activate study", exact: true }).click();
  await expect(page.getByText("Hold marks: 2", { exact: true })).toBeVisible();
  await hold.focus();
  await page.keyboard.down("Enter");
  await page.keyboard.up("Enter");
  await page.waitForTimeout(650);
  await expect(page.getByText("Hold marks: 2", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: "Disable interaction effects" }).check();
  await expect(hold).toBeDisabled();
});
test("bounded drag supports keyboard, native controls and focused drafts", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/gestures");
  const group = page.getByRole("group", { name: "Drag study surface", exact: true }),
    track = group.locator(":scope > div");
  await group.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => translation(track)).toBeGreaterThan(12);
  for (let index = 0; index < 6; index++)
    await page.getByRole("button", { name: "Move Drag study right", exact: true }).click();
  await expect.poll(() => translation(track)).toBeGreaterThan(38);
  expect(await translation(track)).toBeLessThanOrEqual(40.5);
  const note = page.getByRole("textbox", { name: "Drag draft", exact: true });
  await note.fill("A steady draft");
  await expect.poll(() => translation(track)).toBe(0);
  await page.getByRole("checkbox", { name: "Reduce interaction motion" }).check();
  await expect(note).toHaveValue("A steady draft");
  await expect(
    page.getByRole("button", { name: "Move Drag study right", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Mark swipe study", exact: true }).click();
  await expect(page.getByText("Swipe marks: 1", { exact: true })).toBeVisible();
});
test("mouse drag ignores child controls and swipe background keeps explicit action", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/gestures");
  const group = page.getByRole("group", { name: "Drag study surface", exact: true }),
    track = group.locator(":scope > div");
  await group.scrollIntoViewIfNeeded();
  const box = await group.boundingBox();
  if (!box) throw new Error("Missing drag surface");
  await page.mouse.move(box.x + 70, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 140, box.y + 20, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => translation(track)).toBeGreaterThan(25);
  const note = page.getByRole("textbox", { name: "Drag draft", exact: true });
  await note.fill("Selected text remains native");
  await expect.poll(() => translation(track)).toBe(0);
  const swipe = page.getByRole("region", { name: "Swipe study", exact: true });
  await swipe.scrollIntoViewIfNeeded();
  const area = await swipe.boundingBox();
  if (!area) throw new Error("Missing swipe surface");
  await page.mouse.move(area.x + 70, area.y + 20);
  await page.mouse.down();
  await page.mouse.move(area.x + 150, area.y + 20, { steps: 12 });
  await page.mouse.up();
  await expect(page.getByText("Swipe marks: 1", { exact: true })).toBeVisible();
});
test("pointer surfaces flatten on focus, live reduction and dynamic disable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/gestures");
  const note = page.getByRole("textbox", { name: "HoverMagnet draft", exact: true }),
    outer = note.locator("../../../..");
  await outer.scrollIntoViewIfNeeded();
  const box = await outer.boundingBox();
  if (!box) throw new Error("Missing pointer surface");
  await page.mouse.move(box.x + box.width - 24, box.y + 24);
  const moving = outer.locator(":scope > div");
  await expect.poll(() => translation(moving)).toBeGreaterThan(1);
  await note.fill("Keep my place");
  await expect.poll(() => translation(moving)).toBe(0);
  await expect(note).toBeFocused();
  await page.getByRole("checkbox", { name: "Reduce interaction motion" }).check();
  await expect(note).toHaveValue("Keep my place");
  await expect.poll(() => translation(moving)).toBe(0);
  await page.getByRole("checkbox", { name: "Disable interaction effects" }).check();
  await expect(note).toHaveValue("Keep my place");
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920])
  test(`interactions fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/gestures");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/gestures-${width}.png` });
      await page
        .getByRole("heading", { name: "Optional gestures", exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/gestures-actions-${width}.png` });
    }
  });
test("touch retains native actions and static pointer content", async ({ browser }) => {
  const context = await browser.newContext({
      hasTouch: true,
      isMobile: browser.browserType().name() !== "firefox",
      viewport: { width: 390, height: 844 },
    }),
    page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/gestures");
  await page.getByRole("button", { name: "Mark swipe study", exact: true }).tap();
  await expect(page.getByText("Swipe marks: 1", { exact: true })).toBeVisible();
  const input = page.getByRole("textbox", { name: "TiltSurface draft", exact: true });
  await input.fill("Touch draft");
  await expect(input.locator("../../..")).toHaveCSS("transform", "none");
  await page.getByRole("button", { name: "Activate study", exact: true }).tap();
  await expect(page.getByText("Hold marks: 1", { exact: true })).toBeVisible();
  await context.close();
});

test("cancelled pointer swipes never activate an action", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/gestures");
  const swipe = page.getByRole("region", { name: "Swipe study", exact: true }),
    track = swipe.locator(":scope > div > div");
  await swipe.scrollIntoViewIfNeeded();
  const box = await swipe.boundingBox();
  if (!box) throw new Error("Missing swipe surface");
  await page.mouse.move(box.x + 70, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 150, box.y + 20, { steps: 12 });
  await track.dispatchEvent("pointercancel", { pointerId: 1, pointerType: "mouse", bubbles: true });
  await page.mouse.up();
  await expect(page.getByText("Swipe marks: 0", { exact: true })).toBeVisible();
  await expect.poll(() => translation(track)).toBe(0);
});
