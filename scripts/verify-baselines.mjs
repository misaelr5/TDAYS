import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const hashes = JSON.parse(readFileSync(new URL("../tests/baseline.sha256.json", import.meta.url), "utf8"));
if (Object.keys(hashes).length !== 29) throw new Error("Se esperan las 29 referencias originales de la etapa 1.");
for (const [name, hash] of Object.entries(hashes)) {
  const actual = createHash("sha256").update(readFileSync(new URL(`../tests/__screenshots__/chromium/${name}`, import.meta.url))).digest("hex");
  if (actual !== hash) throw new Error(`Referencia original alterada: ${name}`);
}
console.log("29 referencias originales: hashes intactos.");
const current = JSON.parse(readFileSync(new URL("../tests/current-visual-reference.json", import.meta.url), "utf8"));
if (Object.keys(current.captures).length !== 36) throw new Error("Se esperan 36 referencias actuales (cinco páginas y menú).");
for (const [name, hash] of Object.entries(current.captures)) {
  const actual = createHash("sha256").update(readFileSync(new URL(`../tests/__screenshots__/chromium/current/${name}`, import.meta.url))).digest("hex");
  if (actual !== hash) throw new Error(`Referencia actual alterada: ${name}`);
}
console.log("36 referencias actuales: hashes intactos y procedencia registrada.");
