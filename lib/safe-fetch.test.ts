import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchPublicUrl, publicUrl } from "./safe-fetch";

afterEach(() => vi.unstubAllGlobals());

describe("publicUrl", () => {
  it("accepts ordinary websites", () => {
    expect(publicUrl("https://acme.com/about")?.hostname).toBe("acme.com");
    expect(publicUrl("http://www.acme.co.uk")?.hostname).toBe("www.acme.co.uk");
    expect(publicUrl("https://acme.com./")).not.toBeNull();
    expect(publicUrl("http://192.0.78.24/")).not.toBeNull(); // public (WordPress.com), unlike 192.0.0.0/24
  });

  it("rejects localhost, private, link-local and metadata addresses in every spelling", () => {
    for (const bad of [
      "http://localhost:3000",
      "http://app.localhost/",
      "http://127.0.0.1/",
      "http://2130706433/",
      "http://0x7f.1/",
      "http://10.0.0.5/",
      "http://172.20.1.1/",
      "http://192.168.1.1/",
      "http://169.254.169.254/latest/meta-data/",
      "http://100.64.0.1/",
      "http://[::1]/",
      "http://[fd00::1]/",
      "http://[::ffff:127.0.0.1]/",
      "http://intranet/",
      "http://db.internal/",
      "http://localhost./",
      "http://db.internal./",
      "http://intranet../",
      "http://192.0.0.1/",
    ]) {
      expect(publicUrl(bad), bad).toBeNull();
    }
  });

  it("rejects other schemes, embedded credentials and non-web ports", () => {
    expect(publicUrl("file:///etc/passwd")).toBeNull();
    expect(publicUrl("ftp://acme.com/")).toBeNull();
    expect(publicUrl("https://user:pass@acme.com/")).toBeNull();
    expect(publicUrl("https://acme.com:6379/")).toBeNull();
    expect(publicUrl("not a url")).toBeNull();
  });
});

describe("fetchPublicUrl", () => {
  it("re-checks every redirect hop and stops at a private one", async () => {
    const seen: string[] = [];
    vi.stubGlobal("fetch", async (url: URL) => {
      seen.push(url.toString());
      if (url.hostname === "acme.com") return new Response(null, { status: 302, headers: { location: "http://169.254.169.254/latest/meta-data/" } });
      return new Response("secret");
    });
    expect(await fetchPublicUrl("https://acme.com/", { timeoutMs: 1000 })).toBeNull();
    expect(seen).toEqual(["https://acme.com/"]);
  });

  it("follows public redirects and returns the final page", async () => {
    vi.stubGlobal("fetch", async (url: URL) =>
      url.pathname === "/" ? new Response(null, { status: 301, headers: { location: "/home" } }) : new Response("welcome"),
    );
    const res = await fetchPublicUrl("https://acme.com/", { timeoutMs: 1000 });
    expect(await res?.text()).toBe("welcome");
  });

  it("never requests a blocked starting URL", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(await fetchPublicUrl("http://127.0.0.1:3005/api/admin", { timeoutMs: 1000 })).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
