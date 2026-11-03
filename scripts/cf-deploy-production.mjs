import { spawnSync } from "node:child_process";

// Production build: indexing on and SITE_ENV marks this build as production (see src/config/seo.ts).
// A fresh build is mandatory; a review build never carries these flags.
const env = { ...process.env, SITE_INDEXING: "true", SITE_ENV: "production" };
for (const args of [["opennextjs-cloudflare", "build"], ["opennextjs-cloudflare", "deploy", "--env", "production"]]) {
  const { status } = spawnSync("npx", args, { env, stdio: "inherit", shell: true });
  if (status !== 0) process.exit(status ?? 1);
}
