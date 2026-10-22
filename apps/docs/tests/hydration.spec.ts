import { expect, test } from "@playwright/test";

test("ticker edits wait for hydration when client scripts arrive late", async ({ page }) => {
  let resumeScripts = () => {};
  const scriptsReady = new Promise<void>((resolve) => {
    resumeScripts = resolve;
  });
  await page.route(/\/_next\/static\/.*\.js(?:\?.*)?$/, async (route) => {
    await scriptsReady;
    await route.continue();
  });
  const speed = page.getByRole("spinbutton", { name: "Live rail speed" });
  const reduction = page.getByRole("checkbox", { name: "Reduce ticker motion" });
  try {
    await page.goto("/ticker", { waitUntil: "commit" });
    await expect(speed).toBeDisabled();
    await expect(reduction).toBeDisabled();
  } finally {
    resumeScripts();
  }
  await expect(speed).toBeEnabled();
  await expect(reduction).toBeEnabled();
  await speed.fill("240");
  await expect(speed).toHaveValue("240");
  await reduction.check();
  await expect(reduction).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Live rail: static layout", exact: true }),
  ).toBeDisabled();
});
