import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { starterScene } from "../lib/scene";
test("Studio edits, scrubs, preserves projects and exports React", async ({ page }) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: /Main card/ }).click();
  await page.getByRole("textbox", { name: "Text", exact: true }).fill("Hello studio");
  await expect(page.locator(".studio-object")).toContainText([
    "",
    "Hello studio",
    "A little momentum ↗",
  ]);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Text", exact: true })).toHaveValue(
    "Make it move.",
  );
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Text", exact: true })).toHaveValue(
    "Hello studio",
  );
  await page.getByRole("button", { name: "Save project", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Restore saved", exact: true }).click();
  await page.getByRole("button", { name: /Main card/ }).click();
  await expect(page.getByRole("textbox", { name: "Text", exact: true })).toHaveValue(
    "Hello studio",
  );
  const scrub = page.getByRole("slider", { name: "Timeline position" });
  await scrub.fill("0.5");
  await expect(page.locator(".studio-transport output")).toContainText("0.50s");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toHaveAttribute(
    "aria-pressed",
    "false",
    { timeout: 4000 },
  );
  await expect(page.getByLabel("Generated React code")).toContainText("Hello studio");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download React" }).click();
  expect((await download).suggestedFilename()).toBe("MotionScene.tsx");
  await page
    .getByLabel("Project JSON", { exact: true })
    .fill('{"version":1,"name":"bad","layers":[]}');
  await page.getByRole("button", { name: "Import JSON", exact: true }).click();
  await expect(page.locator(".tool-status")).toContainText("1–6");
  await expect(page.getByRole("textbox", { name: "Text", exact: true })).toHaveValue(
    "Hello studio",
  );
});
test("AI Kit honestly reports setup and transfers validated scenes to Studio", async ({ page }) => {
  await page.goto("/ai-kit");
  await expect(page.getByRole("button", { name: "Generate with AI" })).toBeDisabled();
  await expect(page.locator(".tool-status")).toContainText("not AI output");
  await page.getByLabel("Your animation brief").fill("Gentle welcome card entrance");
  await expect(page.getByLabel("Agent prompt pack")).toContainText("Gentle welcome");
  const scene = starterScene();
  scene.name = "AI import test";
  await page.getByLabel("Generated project JSON").fill(JSON.stringify(scene));
  await page.getByRole("button", { name: "Validate and preview" }).click();
  await expect(page.getByRole("heading", { name: "AI import test" })).toBeVisible();
  await page.getByRole("button", { name: "Send draft to Studio" }).click();
  await page.getByRole("link", { name: "Open Studio", exact: false }).click();
  await page.getByRole("button", { name: "Load AI draft" }).click();
  await expect(page.getByLabel("Scene name")).toHaveValue("AI import test");
});
for (const reduced of [false, true])
  test(`authoring tools fit widths and pass axe reduced=${reduced}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
    for (const route of ["/studio", "/ai-kit"]) {
      await page.goto(route);
      for (const width of [320, 360, 375, 390, 430, 768, 834, 1024, 1280, 1440, 1600, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
          .toBe(true);
      }
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const scan = await new AxeBuilder({ page }).analyze();
        expect(scan.violations).toEqual([]);
      }
      if (route === "/studio" && reduced) {
        await expect(page.getByRole("button", { name: "Play", exact: true })).toBeDisabled();
        await expect(page.getByRole("slider", { name: "Timeline position" })).toBeDisabled();
      }
      await page.screenshot({
        path: `../../artifacts/tools-${route.slice(1)}-${reduced ? "reduced" : "desktop"}.png`,
        fullPage: true,
      });
    }
  });
test("Studio is usable with touch and reduction can interrupt playback", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3100/studio");
  await page.getByRole("button", { name: /Main card/ }).tap();
  await page.getByRole("textbox", { name: "Text", exact: true }).fill("Touch works");
  await page.getByRole("button", { name: "Play", exact: true }).tap();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("slider", { name: "Timeline position" })).toBeDisabled();
  await expect(page.locator(".studio-object").nth(1)).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "../../artifacts/tools-studio-mobile.png", fullPage: true });
  await context.close();
});
