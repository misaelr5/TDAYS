import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const hashes = JSON.parse(readFileSync(new URL("../tests/baseline.sha256.json", import.meta.url), "utf8"));
if (Object.keys(hashes).length !== 29) throw new Error("Se esperan las 29 referencias originales de la etapa 1.");
for (const [name, hash] of Object.entries(hashes)) {
  const actual = createHash("sha256").update(readFileSync(new URL(`../tests/__screenshots__/chromium/${name}`, import.meta.url))).digest("hex");
  if (actual !== hash) throw new Error(`Referencia original alterada: ${name}`);
}
console.log("29 referencias originales: hashes intactos.");
