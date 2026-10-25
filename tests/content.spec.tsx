import { renderToStaticMarkup } from "react-dom/server";
import { destinations } from "../src/features/destinations/data";
import { DestinationDetails } from "../src/features/destinations/destination-details";
import { teamMembers } from "../src/features/agency/data";
import { TeamMemberCard } from "../src/features/agency/team-member";
import { test, expect, ready } from "./fixtures";

test("datos comerciales se renderizan solo si están presentes y son válidos", () => {
  const fixture = { ...destinations[0], description: "Descripción sintética para QA", dates: [{ departure: "2027-02-10", return: "2027-02-15" }], price: { amount: 125000.5, currency: "ARS" as const }, services: ["Servicio sintético QA"] };
  const html = renderToStaticMarkup(<DestinationDetails destination={fixture} />);
  expect(html).toContain("Descripción sintética para QA");
  expect(html).toContain('dateTime="2027-02-10"');
  expect(html).toContain('dateTime="2027-02-15"');
  expect(html).toContain("125.000,5");
  expect(html).toContain("ARS");
  expect(html).toContain("Servicio sintético QA");
  expect(renderToStaticMarkup(<DestinationDetails destination={{ ...fixture, description: null, dates: [], price: null, services: [] }} />)).toBe("");
  const invalid = renderToStaticMarkup(<DestinationDetails destination={{ ...fixture, dates: [{ departure: "2027-02-30", return: null }], price: { amount: NaN, currency: "ARS" } }} />);
  expect(invalid).not.toContain("<time");
  expect(invalid).not.toContain("NaN");
});

test("perfiles pendientes y aprobaciones vacías nunca se publican", () => {
  expect(teamMembers).toHaveLength(8);
  for (const member of teamMembers) {
    expect(member.publication.status).toBe("pending");
    expect(renderToStaticMarkup(<TeamMemberCard member={member} />)).toBe("");
    expect(renderToStaticMarkup(<TeamMemberCard member={{ ...member, publication: { status: "approved", evidence: " " } }} />)).toBe("");
  }
  const html = renderToStaticMarkup(<TeamMemberCard member={{ id: "qa", name: "Perfil sintético QA", role: "Rol sintético QA", publication: { status: "approved", evidence: "Fixture únicamente" } }} />);
  expect(html).toContain("Perfil sintético QA");
});

test("Nosotros recupera historia, valores, formación atribuida y áreas sin exponer el inventario", async ({ page, request }) => {
  await page.goto("/nosotros");
  const narrative = page.locator("[data-agency-narrative]");
  await expect(narrative).toContainText("A los 17 años, Javier Garay");
  await expect(narrative).toContainText("23 años de experiencia personal");
  await expect(narrative).toContainText("En 2018 fundó la agencia");
  await expect(narrative.locator("ol li")).toHaveCount(4);
  await expect(page.locator("[data-agency-value]")).toHaveCount(8);
  await expect(page.locator("[data-team-area]")).toHaveCount(3);
  await expect(narrative).toContainText("No se presentan como certificaciones verificadas.");
  await expect(narrative).toContainText("RCP");
  await expect(narrative).toContainText("grooming");
  await expect(page.locator(".agency-team-profile")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Conocé nuestra historia" })).toHaveAttribute("href", "#historia");
  const html = await page.content();
  const privateNames = teamMembers.filter(member => member.id !== "javier-garay").map(member => member.name);
  for (const name of privateNames) expect(html).not.toContain(name);
  for (const src of await page.locator("script[src]").evaluateAll(elements => elements.map(element => (element as HTMLScriptElement).src))) {
    const js = await (await request.get(src)).text();
    for (const name of privateNames) expect(js).not.toContain(name);
  }
  await expect(narrative).not.toContainText(/18904|nivel bronce|primera empresa/i);
});

for (const width of [320, 390, 1440]) {
  test(`narrativa editorial en flujo normal a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/nosotros");
    await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const section of await page.locator("[data-agency-narrative] > section").all()) {
      expect(await section.evaluate(element => getComputedStyle(element).position)).toBe("static");
      const box = (await section.boundingBox())!;
      for (const content of await section.locator("h2,h3,p").all()) {
        const text = (await content.boundingBox())!;
        expect(text.y).toBeGreaterThanOrEqual(box.y - 1);
        expect(text.y + text.height).toBeLessThanOrEqual(box.y + box.height + 1);
      }
    }
  });
}

test("catálogo mantiene postales y consultas, muestra descripciones reales y omite datos ausentes", async ({ page }) => {
  await page.goto("/destinos");
  await expect(page.locator(".destination-card")).toHaveCount(8);
  await expect(page.locator(".destination-card .postcard")).toHaveCount(8);
  await expect(page.locator(".destination-details")).toHaveCount(8);
  for (const destination of destinations) {
    const card = page.getByRole("link", { name: `Consultar por ${destination.name} en WhatsApp`, exact: true });
    await expect(card).toContainText(destination.description!);
    await expect(card.getByRole("heading", { level: 2 })).toHaveText(destination.name!);
  }
  await expect(page.locator(".destination-details time, .destination-price")).toHaveCount(0);
  await expect(page.locator(".destination-grid")).not.toContainText(/disponible|últimos lugares|reservá ahora/i);
  await page.goto("/");
  await expect(page.locator(".destination-details")).toHaveCount(0);
});
