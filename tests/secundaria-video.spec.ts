import { test, expect } from "./fixtures";

for (const width of [390, 1440]) {
  test(`Secundaria: reproducción, pausa y movimiento reducido a ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const card = page.locator('#egresados [data-level="secundaria"]');
    const video = card.locator("video");
    await video.scrollIntoViewIfNeeded();
    await expect(video).toHaveAttribute("src", new RegExp(`secundaria-loop-${width < 768 ? "mobile" : "desktop"}\\.mp4$`));
    await expect.poll(() => video.evaluate(v => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).currentTime > 0)).toBe(true);
    expect(await video.evaluate(v => (v as HTMLVideoElement).muted && (v as HTMLVideoElement).loop && (v as HTMLVideoElement).playsInline)).toBe(true);
    await card.getByRole("button", { name: "Pausar video de fondo" }).click();
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
    await page.locator("h1").scrollIntoViewIfNeeded();
    await video.scrollIntoViewIfNeeded();
    expect(await video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
    await card.screenshot({ path: testInfo.outputPath(`secundaria-${width}.png`) });
    await card.getByRole("button", { name: "Reproducir video de fondo" }).click();
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(false);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(video).not.toHaveAttribute("src");
    await expect(card.getByRole("button")).toHaveCount(0);
    await expect.poll(() => card.locator("picture img").evaluate(i => (i as HTMLImageElement).naturalWidth > 0)).toBe(true);
  });
}
