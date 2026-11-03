import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Runs specs against an already deployed URL; it never builds or deploys.
// REMOTE_URL=https://travel-days-preview.travel-days-recrear.workers.dev npm run test:remote -- tests/deployment-smoke.spec.ts
const baseURL = process.env.REMOTE_URL;
if (!baseURL) throw new Error("Definí REMOTE_URL con la URL publicada a probar.");

export default defineConfig({
  ...base,
  outputDir: "output/playwright-remote/results",
  reporter: [["list"]],
  use: { ...base.use, baseURL },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit-mobile", use: { browserName: "webkit", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: undefined,
});
