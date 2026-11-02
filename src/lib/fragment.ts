/** A URL fragment is external input; malformed percent encoding is not an ID. */
export function decodeFragment(hash: string): string {
  try {
    return decodeURIComponent(hash.startsWith("#") ? hash.slice(1) : hash);
  } catch {
    return "";
  }
}
