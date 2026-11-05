import { spawnSync } from "node:child_process";

// Production build: indexing on and SITE_ENV marks this build as production (see src/config/seo.ts).
// A fresh build is mandatory; a review build never carries these flags.
const env = { ...process.env, SITE_INDEXING: "true", SITE_ENV: "production" };
if (env.VERCEL === "1" || env.VERCEL_ENV) {
  throw new Error("El despliegue Cloudflare requiere un entorno sin VERCEL_ENV.");
}
for (const args of [["opennextjs-cloudflare", "build"], ["opennextjs-cloudflare", "deploy", "--env", "production"]]) {
  if (args[1] === "deploy") {
    const verification = spawnSync(process.execPath, ["scripts/verify-production-seo.mjs"], { env, stdio: "inherit", windowsHide: true });
    if (verification.status !== 0) process.exit(verification.status ?? 1);
  }
  const { status } = spawnSync("npx", args, { env, stdio: "inherit", shell: true });
  if (status !== 0) process.exit(status ?? 1);
}
