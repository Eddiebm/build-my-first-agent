/**
 * Fetching a URL a visitor typed in, without letting it reach places it
 * shouldn't: only http(s) on the standard ports, never localhost or a
 * private/link-local/metadata address, and every redirect hop is checked the
 * same way (a public page can redirect to 169.254.169.254).
 *
 * Runs on the Edge runtime, which has no DNS lookup, so a public hostname that
 * resolves to a private address isn't caught here; the Edge network can't
 * reach private networks anyway.
 */

const MAX_REDIRECTS = 3;

function ipv4Blocked(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224 // multicast and reserved
  );
}

function ipv6Blocked(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::" || lower === "::1") return true;
  if (/^f[cd]/.test(lower) || /^fe[89ab]/.test(lower)) return true; // unique local, link-local
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(lower);
  if (mapped) return ipv4Blocked(mapped[1]);
  const mappedHex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(lower);
  if (mappedHex) {
    const hi = parseInt(mappedHex[1], 16);
    const lo = parseInt(mappedHex[2], 16);
    return ipv4Blocked(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`);
  }
  return false;
}

/** The URL if it's safe to request, otherwise null. */
export function publicUrl(raw: string, base?: string): URL | null {
  let url: URL;
  try {
    url = base ? new URL(raw, base) : new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || /\.(localhost|local|internal)$/.test(host) || !host.includes(".") && !host.includes(":")) return null;
  // URL parsing already turns 2130706433 or 0x7f.1 into 127.0.0.1, so these checks see the dotted form.
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && ipv4Blocked(host)) return null;
  if (host.includes(":") && ipv6Blocked(host)) return null;
  return url;
}

/** GET a visitor-supplied URL, following at most a few redirects, each re-checked. */
export async function fetchPublicUrl(raw: string, init: { headers?: Record<string, string>; timeoutMs: number }): Promise<Response | null> {
  let url = publicUrl(raw);
  const signal = AbortSignal.timeout(init.timeoutMs);
  for (let hop = 0; url && hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url, { headers: init.headers, redirect: "manual", signal });
    const location = res.headers.get("location");
    if (res.status < 300 || res.status >= 400 || !location) return res;
    url = publicUrl(location, url.toString());
  }
  return null;
}
