import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    "output/**",
    ".playwright-cli/**",
    ".next/**",
    ".next-qa/**",
    ".next-qa-*/**",
    ".open-next/**",
    ".wrangler/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
  ]),
]);
