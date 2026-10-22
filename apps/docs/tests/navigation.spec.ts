import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("tabs skip disabled items, support Home/End and keep hidden panel state", async ({ page }) => {
  await page.goto("/navigation");
  const tabs = page.getByRole("tablist", { name: "Animated chapters tabs" });
  await page
    .getByRole("textbox", { name: "AnimatedTabs note Observe", exact: true })
    .fill("Keep this chapter");
  await tabs.getByRole("tab", { name: "Observe", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Compose", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "Respond", exact: true })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("textbox", { name: "AnimatedTabs note Observe", exact: true }),
  ).toHaveValue("Keep this chapter");
  await page.keyboard.press("End");
  await expect(tabs.getByRole("tab", { name: "Respond", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
test("native menu and accordion work by keyboard with Escape restoration", async ({ page }) => {
  await page.goto("/navigation");
  const summary = page.locator("summary").filter({ hasText: "Explore chapters" });
  await summary.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("navigation", { name: "More chapters" });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Chapters", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(summary).toBeFocused();
  await page.locator("summary").filter({ hasText: "How do I move through tabs?" }).focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByText("Use Left and Right arrows, Home, or End. Tab enters the selected panel.", {
      exact: true,
    }),
  ).toBeVisible();
});
test("native modal traps focus, handles Escape and restores scroll styles and opener", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/navigation");
  await page.evaluate(() => {
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "7px";
  });
  const trigger = page.getByRole("button", { name: "Open project modal", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Project details", exact: true });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds?.x).toBeGreaterThan(100);
  expect(bounds?.y).toBeGreaterThan(100);
  await dialog.getByRole("button", { name: "Close Project details", exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Finish native dialog", exact: true }),
  ).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  }
  const beforeWheel = await page.evaluate(() => window.scrollY);
  await page.mouse.move(5, 5);
  await page.mouse.wheel(0, 400);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(beforeWheel);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: "test-results/modal-desktop.png" });
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("auto");
  expect(await page.evaluate(() => document.body.style.paddingRight)).toBe("7px");
});
test("nested overlays retain their lock and restore focus one level at a time", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/navigation");
  await page.getByRole("button", { name: "Open project modal", exact: true }).click();
  const nestedTrigger = page.getByRole("button", { name: "Open nested notes", exact: true });
  await nestedTrigger.click();
  const nested = page.getByRole("dialog", { name: "Nested notes", exact: true });
  await expect(nested).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nested).toBeHidden();
  await expect(nestedTrigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Project details", exact: true })).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
test("focus changes during modal exit do not cancel close cleanup", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/navigation");
  await page.getByRole("button", { name: "Open project modal", exact: true }).click();
  await page.getByRole("button", { name: "Close Project details", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("dialog", { name: "Project details", exact: true })).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
test("native method-dialog close and unmount release scroll locks", async ({ page }) => {
  await page.goto("/navigation");
  const trigger = page.getByRole("button", { name: "Open project modal", exact: true });
  await trigger.click();
  await page.getByRole("button", { name: "Finish native dialog", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Project details", exact: true })).toBeHidden();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  await trigger.click();
  await page.getByRole("button", { name: "Remove modal", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Project details", exact: true })).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
  test(`navigation fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/navigation");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 1440) {
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.getByRole("tablist", { name: "Sliding chapters tabs" }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/navigation-${width}.png` });
      await page.getByRole("button", { name: "Open notes drawer", exact: true }).click();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/drawer-${width}.png` });
      await page.getByRole("button", { name: "Close Reading notes", exact: true }).click();
      await page.getByRole("button", { name: "Open project modal", exact: true }).click();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.screenshot({ path: `test-results/modal-${width}.png` });
    }
  });
}
test("touch drawer controls remain reachable and backdrop closes with focus restoration", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: browser.browserType().name() !== "firefox",
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/navigation");
  const trigger = page.getByRole("button", { name: "Open notes drawer", exact: true });
  await trigger.tap();
  await page.getByRole("textbox", { name: "Reading note", exact: true }).fill("Touch notes");
  await page.touchscreen.tap(5, 300);
  await expect(page.getByRole("dialog", { name: "Reading notes", exact: true })).toBeHidden();
  await expect(trigger).toBeFocused();
  await context.close();
});
