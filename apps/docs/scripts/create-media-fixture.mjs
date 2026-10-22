import { chromium } from "@playwright/test";
import { access, copyFile, mkdir, unlink } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";

const destination = new URL("../public/media-preview.webm", import.meta.url);
if (
  await access(destination).then(
    () => true,
    () => false,
  )
) {
  process.stdout.write("Media fixture already exists.\n");
} else {
  const capture = fileURLToPath(new URL("../test-results/media-fixture/", import.meta.url));
  await mkdir(capture, { recursive: true });
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 400, height: 240 },
      recordVideo: { dir: capture, size: { width: 400, height: 240 } },
    });
    const page = await context.newPage();
    await page.setContent(
      '<!doctype html><html><head><style>body{margin:0;background:#191c19}circle{animation:travel 4s ease-in-out both}@keyframes travel{0%{transform:translateX(-80px)}50%{transform:translateX(80px)}100%{transform:translateX(0)}}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect x="32" y="32" width="336" height="176" rx="16" fill="none" stroke="#b5bcb0"/><circle cx="200" cy="120" r="48" fill="#d3e5aa"/></svg></body></html>',
    );
    await page.waitForTimeout(4200);
    const video = page.video();
    await context.close();
    assert.ok(video);
    const recorded = await video.path();
    assert.equal(dirname(resolve(recorded)), resolve(capture));
    await copyFile(recorded, destination, constants.COPYFILE_EXCL);
    await unlink(recorded);
    process.stdout.write("Created the local silent geometric video fixture.\n");
  } finally {
    await browser.close();
  }
}
