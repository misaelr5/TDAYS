import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The public site is fully prerendered with no revalidation, so prerendered pages are
// read from Workers Static Assets. No R2/KV resources are needed. Revisit this when a
// future portal adds dynamic or revalidated routes.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
