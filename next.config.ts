import type { NextConfig } from "next";
import { indexingEnabled } from "./src/config/seo";
import { productionCsp } from "./src/config/security";
const config: NextConfig = {
  ...(process.env.RECREAR_QA === "1"
    ? { distDir: ".next-qa", typescript: { tsconfigPath: "tsconfig.qa.json" } }
    : {}),
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(process.env.NODE_ENV === "production" ? [{ key: "Content-Security-Policy", value: productionCsp }] : []),
          ...(!indexingEnabled ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default config;
