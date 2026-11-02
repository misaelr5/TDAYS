import { test, expect } from "./fixtures";

test("Inter carga la cara reducida y conserva la original para otros alfabetos", async ({ page }) => {
  const fonts: string[] = [];
  page.on("request", request => {
    if (request.resourceType() === "font") fonts.push(request.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe("loaded");
  // The Chinese content must still use system fallback, without fetching Inter
  // glyphs that were absent from the original face as well.
  expect(fonts).toHaveLength(1);
  expect(fonts[0]).toContain("InterLatin");
  await expect(page.locator('link[rel="preload"][as="font"]')).toHaveCount(1);

  await page.goto("/contacto", { waitUntil: "networkidle" });
  const name = "Ωμέγα Жанна Łódź";
  await page.getByLabel("Tu nombre", { exact: true }).fill(name);
  await expect(page.getByLabel("Tu nombre", { exact: true })).toHaveValue(name);
  await expect.poll(() => fonts.filter(url => url.includes("InterVariable")).length).toBe(1);
  // Await the requested face itself; the document-wide state also reflects
  // unrelated pending layout/font work (notably in Gecko after editing input).
  expect(await page.evaluate(async () => {
    const face = [...document.fonts].find(font => font.family.replace(/["']/g, "") === "interExtended");
    if (!face) throw new Error("No se registró la fuente de respaldo");
    await face.loaded;
    return face.status;
  })).toBe("loaded");
});
