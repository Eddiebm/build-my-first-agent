import { afterEach, describe, expect, it, vi } from "vitest";
import { reportFailure } from "./report-failure";

afterEach(() => vi.restoreAllMocks());

describe("reportFailure", () => {
  it("logs what failed and the error instead of swallowing it", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const boom = new Error("Resend is down");
    await Promise.reject(boom).catch(reportFailure("lead notification email"));
    expect(log).toHaveBeenCalledWith("[failed] lead notification email", boom);
  });

  it("settles the promise, so a failed email never fails the request", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(Promise.reject(new Error("x")).catch(reportFailure("anything"))).resolves.toBeUndefined();
  });
});
