import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("dialog initial focus and Escape remain scoped inside an ancestor disclosure", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/audit");
  await page.locator("summary").filter({ hasText: "Open composition menu" }).focus();
  await page.keyboard.press("Enter");
  const opener = page.getByRole("button", { name: "Open composed modal", exact: true });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Composed form", exact: true });
  await expect(dialog.getByRole("textbox", { name: "Initial note" })).toBeFocused();
  await dialog.getByRole("button", { name: "Last form action" }).focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close Composed form" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Last form action" })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Dialog composition" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Dialog composition" })).toBeHidden();
});

test("enlarged text and a short viewport keep dialog controls reachable", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 400 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/audit");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Open long drawer" }).click();
  const field = page.getByRole("textbox", { name: "Long drawer note" });
  await field.fill("Enlarged reading");
  await expect(field).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
