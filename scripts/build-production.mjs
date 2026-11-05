import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

// Metadata and robots are prerendered: production must be identified at build time.
const env = { ...process.env, SITE_INDEXING: "true", SITE_ENV: "production" };
if (env.VERCEL === "1" || env.VERCEL_ENV) {
  throw new Error("Este comando es para Cloudflare. En Vercel se respeta VERCEL_ENV.");
}
const { status } = spawnSync(process.execPath, [resolve("node_modules/next/dist/bin/next"), "build"], {
  env, stdio: "inherit", windowsHide: true,
});
if (status !== 0) process.exit(status ?? 1);
await import("./verify-production-seo.mjs");
