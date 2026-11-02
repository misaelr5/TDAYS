import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Runs the same suite against the OpenNext Worker in local workerd.
// Build first with `npm run cf:build`; this config never rebuilds or deploys.
const port = Number(process.env.RECREAR_CF_TEST_PORT ?? 3212);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  ...base,
  outputDir: "output/playwright-cloudflare/results",
  reporter: [
    ["list"],
    ["html", { outputFolder: "output/playwright-cloudflare/report", open: "never" }],
    ["json", { outputFile: "output/playwright-cloudflare/results.json" }],
  ],
  use: { ...base.use, baseURL },
  webServer: {
    command: `npx opennextjs-cloudflare preview --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
