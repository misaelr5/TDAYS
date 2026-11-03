import AxeBuilder from "@axe-core/playwright";
import { renderToStaticMarkup } from "react-dom/server";
import { approvedMedia, mediaManifest, type VideoAsset } from "../src/config/media";
import { resolveMedia } from "../src/features/media/files";
import { MediaContent } from "../src/features/media/approved-media";
import { test, expect } from "./fixtures";

async function decodedAudio(element: HTMLElement | SVGElement) {
  const v = element as HTMLVideoElement & { qaAudio?: { context: AudioContext; analyser: AnalyserNode } };
  const AudioContextConstructor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  const media = { muted: v.muted, controls: v.controls, loop: v.loop, width: v.videoWidth, height: v.videoHeight, duration: v.duration };
  // The Windows WebKit test port may omit Web Audio. Keep all real playback
  // assertions, but report this measurement as unavailable rather than fake PCM.
  if (!AudioContextConstructor) return { ...media, peak: null, pcmSupported: false, volume: v.volume };
  if (!v.qaAudio) {
    const context = new AudioContextConstructor();
    const source = context.createMediaElementSource(v);
    const analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
    v.qaAudio = { context, analyser };
  }
  await v.qaAudio.context.resume();
  const samples = new Float32Array(v.qaAudio.analyser.fftSize);
  let peak = 0;
  // Measure decoded PCM, rather than only a declared AAC track or muted flag.
  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    v.qaAudio.analyser.getFloatTimeDomainData(samples);
    peak = Math.max(peak, ...samples.map(Math.abs));
  }
  v.volume = 0.35;
  return { ...media, peak, pcmSupported: true, volume: v.volume };
}

test("la autorización de testimonios no habilita reproducción decorativa ni expone evidencias", () => {
  const asset = mediaManifest["testimonial:primaria"] as VideoAsset;
  expect(approvedMedia("testimonial:primaria")).not.toBeNull();
  expect(approvedMedia("hero", { hero: asset })).toBeNull();
  expect(resolveMedia("testimonial:primaria", { "testimonial:primaria": { ...asset, authorization: { status: "pending" } } })).toBeNull();
  const media = resolveMedia("testimonial:primaria")!;
  expect(JSON.stringify(media)).not.toContain("authorization");
  expect(JSON.stringify(media)).not.toContain("provenance");
  const html = renderToStaticMarkup(<MediaContent asset={media} allowVideo />);
  expect(html).toContain("primaria.webp");
  expect(html).not.toContain("<video");
});

for (const width of [320, 390, 768, 1440]) {
  test(`testimonios: encuadre, carga diferida, foco y accesibilidad a ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const requests: string[] = [];
    page.on("request", request => { if (/\/testimonials\/.*\.mp4/.test(request.url())) requests.push(request.url()); });
    await page.goto("/");
    const section = page.locator("#testimonios");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { level: 2 })).toHaveText("El viaje, contado por quienes lo vivieron.");
    await expect(section.locator("video")).not.toHaveAttribute("src");
    await expect(section.locator("video")).toHaveAttribute("preload", "none");
    const selection = section.getByRole("button", { name: "Seleccionar testimonio: Voces del viaje" });
    await selection.focus();
    await page.keyboard.press("Enter");
    await expect(selection).toHaveAttribute("aria-pressed", "true");
    await expect(section.locator("video")).not.toHaveAttribute("src");
    await expect(section.locator("[data-testimonial-frame] img")).toHaveAttribute("src", /pasajeros-2024/);
    const poster = section.locator("[data-testimonial-frame] img");
    await poster.scrollIntoViewIfNeeded();
    await expect.poll(() => poster.evaluate(i => (i as HTMLImageElement).naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0);
    expect(requests).toEqual([]);
    const frame = await section.locator("[data-testimonial-frame]").boundingBox();
    expect(frame!.width / frame!.height).toBeCloseTo(9 / 16, 2);
    expect(await selection.evaluate(e => getComputedStyle(e).outlineStyle)).not.toBe("none");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const axe = await new AxeBuilder({ page }).include("#testimonios").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations).toEqual([]);
    const contact = new URL((await section.getByRole("link", { name: "Consultar por mi viaje" }).getAttribute("href"))!);
    expect(contact.origin + contact.pathname).toBe("https://wa.me/5493544312904");
    expect(contact.searchParams.get("text")).toContain("testimonios");
    await section.screenshot({ path: testInfo.outputPath(`testimonios-${width}.png`), animations: "disabled" });
  });
}

test("reproduce ambos videos, mide PCM si el motor lo admite y detiene el anterior al seleccionar", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  const requests: string[] = [];
  page.on("request", request => { if (/\/testimonials\/.*\.mp4/.test(request.url())) requests.push(new URL(request.url()).pathname); });
  await page.goto("/");
  const section = page.locator("#testimonios");
  const video = section.locator("video");
  await section.locator("[data-testimonial-frame]").scrollIntoViewIfNeeded();
  // A second real media element verifies that starting a testimonial stops peers.
  await page.evaluate(async () => {
    const other = document.createElement("video");
    other.dataset.qaPeer = "";
    other.muted = true;
    other.src = "/media/travel-days/trips/maestrazo-termas-mobile.mp4";
    document.body.append(other);
    await other.play();
  });
  const play = section.getByRole("button", { name: "Reproducir testimonio: Viajes de primaria" });
  await play.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => video.evaluate(v => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).currentTime > 0), { timeout: 15_000 }).toBe(true);
  await expect(video).toBeFocused();
  expect(await page.locator("[data-qa-peer]").evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
  const audio = await video.evaluate(decodedAudio);
  if (audio.pcmSupported) expect(audio.peak).toBeGreaterThan(0.0001);
  else testInfo.annotations.push({ type: "limitación", description: "Web Audio no disponible en este motor: señal PCM no medida; se verifica reproducción real y AAC por FFmpeg." });
  expect(audio.muted).toBe(false);
  expect(audio.controls).toBe(true);
  expect(audio.loop).toBe(false);
  if (audio.pcmSupported) expect(audio.volume).toBeCloseTo(0.35);
  expect(audio.width).toBeGreaterThan(0);
  // Some native backends report a downscaled decoded frame. Framing is the
  // browser contract; exact encoded dimensions are checked separately by FFmpeg.
  expect(audio.width / audio.height).toBeCloseTo(480 / 848, 2);
  expect(audio.duration).toBeCloseTo(74.68, 0);
  await testInfo.attach("audio-decodificado-primaria", { body: JSON.stringify(audio), contentType: "application/json" });
  expect(requests.every(path => path.endsWith("/primaria.mp4"))).toBe(true);
  await section.getByRole("button", { name: "Seleccionar testimonio: Voces del viaje" }).click();
  await expect(video).not.toHaveAttribute("src");
  expect(await video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
  expect(requests.every(path => path.endsWith("/primaria.mp4"))).toBe(true);
  await section.getByRole("button", { name: "Reproducir testimonio: Voces del viaje" }).click();
  await expect.poll(() => video.evaluate(v => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).currentTime > 0), { timeout: 15_000 }).toBe(true);
  const secondAudio = await video.evaluate(decodedAudio);
  expect(secondAudio.muted).toBe(false);
  expect(secondAudio.width / secondAudio.height).toBeCloseTo(478 / 850, 2);
  if (secondAudio.pcmSupported) expect(secondAudio.peak).toBeGreaterThan(0.0001);
  expect(secondAudio.duration).toBeCloseTo(123.72, 0);
  await testInfo.attach("audio-decodificado-pasajeros", { body: JSON.stringify(secondAudio), contentType: "application/json" });
  // WebKit's native media backend can fetch without a Playwright request event; the element's own source is authoritative.
  expect(await video.evaluate(v => new URL((v as HTMLVideoElement).currentSrc).pathname)).toMatch(/\/pasajeros-2024\.mp4$/);
  await video.evaluate(v => (v as HTMLVideoElement).pause());
  expect(await video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
  await page.locator("[data-qa-peer]").evaluate(v => v.remove());
});

test("un fallo de carga ofrece reintento y enlace directo", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#testimonios");
  await section.getByRole("button", { name: "Reproducir testimonio: Viajes de primaria" }).click();
  // A real local 404 also works on native media backends whose requests bypass
  // Playwright's HTTP interception. No public corrupt asset is created.
  await section.locator("video").evaluate(async element => {
    const video = element as HTMLVideoElement;
    video.src = "/media/travel-days/testimonials/qa-missing.mp4";
    video.load();
    await video.play().catch(() => {});
  });
  await expect(section.getByRole("status")).toContainText("No pudimos reproducirlo");
  await expect(section.getByRole("button", { name: "Reintentar testimonio: Viajes de primaria" })).toBeVisible();
  await expect(section.getByRole("link", { name: "Abrir video completo en otra pestaña" })).toHaveAttribute("href", /primaria\.mp4$/);
  await section.getByRole("button", { name: "Reintentar testimonio: Viajes de primaria" }).click();
  await expect.poll(() => section.locator("video").evaluate(v => (v as HTMLVideoElement).currentTime), { timeout: 15_000 }).toBeGreaterThan(0);
});

test("sin JavaScript se pueden abrir los dos videos completos", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const section = page.locator("#testimonios");
    await expect(section.getByRole("link", { name: "Viajes de primaria (1:15)", exact: true })).toHaveAttribute("href", /primaria\.mp4$/);
    await expect(section.getByRole("link", { name: "Voces del viaje (2:04)", exact: true })).toHaveAttribute("href", /pasajeros-2024\.mp4$/);
    await expect(section.getByRole("button")).toHaveCount(0);
    await expect(section.getByRole("link", { name: "Consultar por mi viaje" })).toBeVisible();
  } finally { await context.close(); }
});
