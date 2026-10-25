import { defineConfig } from "@playwright/test";

const port = Number(process.env.RECREAR_TEST_PORT ?? 3211);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  outputDir: "output/playwright/results",
  reporter: [
    ["list"],
    ["html", { outputFolder: "output/playwright/report", open: "never" }],
    ["json", { outputFile: "output/playwright/results.json" }],
  ],
  updateSnapshots: "none",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  expect: { toHaveScreenshot: { animations: "disabled", maxDiffPixels: 0 } },
  use: {
    baseURL,
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
    locale: "es-AR",
    timezoneId: "America/Argentina/Cordoba",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    serviceWorkers: "block",
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "node scripts/qa.mjs serve",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
    env: { RECREAR_QA: "1", RECREAR_TEST_PORT: String(port) },
  },
});
