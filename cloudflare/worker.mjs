import openNext from "../.open-next/worker.js";

// Workers Static Assets answers Range requests with the full file (200), and Safari on
// iOS will not play video without byte ranges. wrangler.jsonc routes /media/* here first;
// everything else keeps the OpenNext worker and direct static assets untouched.
const MAX_CHUNK = 4 * 1024 * 1024;

/** @param {string | null} header @param {number} size */
export function parseRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header?.trim() ?? "");
  if (!match || (!match[1] && !match[2])) return null;
  let start, end;
  if (!match[1]) {
    start = Math.max(0, size - Number(match[2]));
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  }
  if (start >= size || end < start) return "unsatisfiable";
  // A shorter 206 is valid: the browser requests the rest as it plays.
  return { start, end: Math.min(end, start + MAX_CHUNK - 1) };
}

/** @param {ReadableStream<Uint8Array>} body @param {number} start @param {number} end */
async function slice(body, start, end) {
  const out = new Uint8Array(end - start + 1);
  const reader = body.getReader();
  let offset = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const from = Math.max(start - offset, 0);
    const to = Math.min(end + 1 - offset, value.length);
    if (to > from) out.set(value.subarray(from, to), offset + from - start);
    offset += value.length;
    if (offset > end) break;
  }
  await reader.cancel().catch(() => {});
  return out;
}

/** @param {ReadableStream<Uint8Array>} body */
async function readAll(body) {
  return new Uint8Array(await new Response(body).arrayBuffer());
}

// Static Assets omits Content-Length, so each file's size is learned on its first ranged
// request and kept per isolate (keyed by path and ETag); later ranges stop reading early.
const sizes = new Map();

/** @param {Request} request @param {{ fetch(request: Request): Promise<Response> }} assets */
export async function serveMedia(request, assets) {
  const range = request.method === "GET" ? request.headers.get("range") : null;
  const headers = new Headers(request.headers);
  headers.delete("range");
  const asset = await assets.fetch(new Request(request.url, { method: request.method, headers }));
  if (asset.status !== 200) return asset;
  const response = new Headers(asset.headers);
  response.set("Accept-Ranges", "bytes");
  if (!range || !asset.body) return new Response(asset.body, { status: 200, headers: response });
  const key = `${new URL(request.url).pathname} ${asset.headers.get("etag")}`;
  let size = Number(asset.headers.get("content-length")) || sizes.get(key);
  /** @type {Uint8Array | undefined} */
  let whole;
  if (!size) {
    whole = await readAll(asset.body);
    size = whole.length;
    sizes.set(key, size);
  }
  const parsed = parseRange(range, size);
  if (parsed === null) return new Response(whole ?? asset.body, { status: 200, headers: response });
  if (parsed === "unsatisfiable") {
    if (!whole) await asset.body.cancel();
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  const bytes = whole ? whole.subarray(parsed.start, parsed.end + 1) : await slice(asset.body, parsed.start, parsed.end);
  response.set("Content-Range", `bytes ${parsed.start}-${parsed.end}/${size}`);
  response.set("Content-Length", String(bytes.length));
  return new Response(bytes, { status: 206, headers: response });
}

const worker = {
  /** @param {Request} request @param {{ ASSETS: { fetch(request: Request): Promise<Response> } }} env @param {unknown} ctx */
  fetch(request, env, ctx) {
    if (new URL(request.url).pathname.startsWith("/media/")) return serveMedia(request, env.ASSETS);
    return openNext.fetch(request, env, ctx);
  },
};
export default worker;
