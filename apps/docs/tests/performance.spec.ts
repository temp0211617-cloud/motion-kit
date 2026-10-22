import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

for (const [path, label] of [
  ["/media", "Native media rail"],
  ["/editorial", "Numbered studies"],
] as const) {
  test(`${label} keeps native navigation without gesture controllers`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    if (path === "/media")
      await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
    const rail = page.getByRole("region", { name: label, exact: true });
    await rail.focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("button", { name: `Next ${label}`, exact: true })).toBeDisabled();
    await expect.poll(() => rail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(40);
    await page.keyboard.press("Home");
    await expect.poll(() => rail.evaluate((node) => node.scrollLeft)).toBeLessThan(1);
    await page.getByRole("button", { name: `Next ${label}`, exact: true }).click();
    await expect.poll(() => rail.evaluate((node) => node.scrollLeft)).toBeGreaterThan(40);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

type ProfileCounters = { bounds: number; observers: number; frames: number; longTasks: number };
type ProfileWindow = Window & { __motionProfile: ProfileCounters };

const signatures = [
  ["LiveTicker", "/ticker", "Live rail"],
  ["DraggableTicker", "/ticker", "Drag rail"],
  ["RulerTicker", "/ticker", "Ruler rail"],
  ["DragCarousel", "/media", "DragCarousel"],
  ["EditorialSlider", "/editorial", "Editorial stories"],
  ["RulerScrollIndicator", "/editorial", "Project ruler"],
  ["StickyStory", "/scroll", "Story chapters"],
  ["FilmStrip", "/media", "Studio film"],
  ["Curtains", "/cinematic", "Curtains"],
] as const;

for (const [component, path, label] of signatures) {
  test(`${component} records active and reduced runtime profiles`, async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      const counters = { bounds: 0, observers: 0, frames: 0, longTasks: 0 };
      (window as unknown as ProfileWindow).__motionProfile = counters;
      const bounds = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        counters.bounds++;
        return bounds.call(this);
      };
      const observer = window.ResizeObserver;
      window.ResizeObserver = class extends observer {
        constructor(callback: ResizeObserverCallback) {
          super(callback);
          counters.observers++;
        }
      };
      const frame = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (callback) =>
        frame((time) => {
          counters.frames++;
          callback(time);
        });
      if (PerformanceObserver.supportedEntryTypes.includes("longtask"))
        new PerformanceObserver((list) => {
          counters.longTasks += list.getEntries().length;
        }).observe({ type: "longtask" });
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(path, { waitUntil: "domcontentloaded" });
    if (path === "/media")
      await expect(page.locator("[data-media-ready]")).toHaveAttribute("data-media-ready", "true");
    const target =
      component === "Curtains"
        ? page.locator(".curtain-stage")
        : component === "StickyStory"
          ? page.getByTestId("observe-media").locator("..")
          : component === "RulerScrollIndicator"
            ? page.getByRole("navigation", { name: label, exact: true })
            : page.getByRole("region", { name: label, exact: true });
    await target.scrollIntoViewIfNeeded();
    // Settle hydration, lazy observers and initial entry motion before measuring.
    await page.waitForTimeout(1200);
    const before = await page.evaluate(() => ({
      ...(window as unknown as ProfileWindow).__motionProfile,
    }));
    if (component.endsWith("Ticker"))
      await page.getByRole("button", { name: `Play ${label}`, exact: true }).click();
    else if (component === "DragCarousel" || component === "EditorialSlider")
      await page.getByRole("button", { name: `Next ${label}`, exact: true }).click();
    else if (component === "RulerScrollIndicator")
      await target.getByRole("link", { name: /Compose/ }).click();
    else if (component === "FilmStrip")
      await page.getByRole("slider", { name: "Studio film playhead" }).fill("2");
    else if (component === "Curtains")
      await page.getByRole("button", { name: "Replay Curtains", exact: true }).click();
    else await page.evaluate(() => window.scrollBy(0, 160));
    await page.waitForTimeout(450);
    const active = await page.evaluate(() => ({
      ...(window as unknown as ProfileWindow).__motionProfile,
    }));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(300);
    const reducedStart = await page.evaluate(() => ({
      ...(window as unknown as ProfileWindow).__motionProfile,
    }));
    await page.waitForTimeout(450);
    const reducedEnd = await page.evaluate(() => ({
      ...(window as unknown as ProfileWindow).__motionProfile,
    }));
    const difference = (end: ProfileCounters, start: ProfileCounters) => ({
      bounds: end.bounds - start.bounds,
      observers: end.observers - start.observers,
      frames: end.frames - start.frames,
      longTasks: end.longTasks - start.longTasks,
    });
    const profile = {
      component,
      scope: "whole docs page; browser instrumentation, not React renders",
      active: difference(active, before),
      reduced: difference(reducedEnd, reducedStart),
    };
    const profilePath = testInfo.outputPath("runtime-profile.json");
    await writeFile(profilePath, JSON.stringify(profile, null, 2));
    await testInfo.attach("runtime-profile", {
      path: profilePath,
      contentType: "application/json",
    });
    // Idle reduced pages must stop layout measurement and observer construction.
    expect(profile.reduced.bounds).toBe(0);
    expect(profile.reduced.observers).toBe(0);
    if (component === "DragCarousel") expect(profile.active.observers).toBe(0);
    if (component.endsWith("Ticker"))
      await expect(target.locator("[data-ticker-track]")).toHaveCSS("transform", "none");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
