import { test, expect } from "./fixtures";

for (const level of ["primaria", "secundaria"]) for (const width of [390, 1440]) {
  test(`${level}: reproducción, pausa y movimiento reducido a ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");
    const card = page.locator(`#egresados [data-level="${level}"]`);
    const video = card.locator("video");
    await video.scrollIntoViewIfNeeded();
    const frame = await video.boundingBox();
    expect(frame!.width / frame!.height).toBeCloseTo(3 / 2, 2);
    await expect(video).toHaveAttribute("src", new RegExp(`${level === "primaria" ? "primaria-tio-joe" : "secundaria-loop"}-${width < 768 ? "mobile" : "desktop"}\\.mp4$`));
    // Cold WebKit decoding can outlast the default 5 s while the poster remains visible.
    await expect.poll(() => video.evaluate(v => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).currentTime > 0), { timeout: 15_000 }).toBe(true);
    expect(await video.evaluate(v => (v as HTMLVideoElement).videoWidth / (v as HTMLVideoElement).videoHeight)).toBeCloseTo(3 / 2, 2);
    expect(await video.evaluate(v => (v as HTMLVideoElement).muted && (v as HTMLVideoElement).loop && (v as HTMLVideoElement).playsInline)).toBe(true);
    await card.getByRole("button", { name: "Pausar video de fondo" }).click();
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
    await page.locator("h1").scrollIntoViewIfNeeded();
    await video.scrollIntoViewIfNeeded();
    expect(await video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
    await card.screenshot({ path: testInfo.outputPath(`${level}-${width}.png`) });
    await card.getByRole("button", { name: "Reproducir video de fondo" }).click();
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(false);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(video).not.toHaveAttribute("src");
    await expect(card.getByRole("button")).toHaveCount(0);
    await expect.poll(() => card.locator("picture img").evaluate(i => (i as HTMLImageElement).naturalWidth > 0)).toBe(true);
  });
}
