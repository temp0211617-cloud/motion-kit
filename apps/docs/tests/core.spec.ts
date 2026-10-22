import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("core exits, page transition, viewport focus and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/core");
  await expect(page.getByRole("button", { name: "Present action" })).toBeVisible();
  await page.getByRole("button", { name: "Toggle presence" }).click();
  await expect(page.getByRole("button", { name: "Present action" })).toHaveCount(0);
  await page.getByRole("button", { name: "Toggle presence" }).click();
  await expect(page.getByRole("button", { name: "Present action" })).toBeVisible();
  await page.getByRole("button", { name: "Next chapter" }).click();
  await expect(page.getByRole("heading", { name: "Chapter 2", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Viewport action" }).focus();
  await expect(page.getByRole("button", { name: "Viewport action" })).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});
test("mobile core accessibility and touch-safe controls", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/core");
  await page.getByLabel("Reduce core motion").check();
  await page.getByRole("button", { name: "Replay core demos" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("core server output remains readable with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/core");
  await expect(page.getByText("Move with purpose.").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Viewport action" })).toBeVisible();
  await context.close();
});
