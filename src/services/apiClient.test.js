import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "./apiClient";

function mockFetch(status, body) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: status < 400, status, json: async () => body }))
  );
}

describe("apiRequest", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reads field errors from the API's error shape", async () => {
    mockFetch(400, {
      error: { status: 400, message: "Please fix the highlighted fields.", fields: { name: "Name is required" } },
    });

    await expect(apiRequest("/api/clubs", { method: "POST", body: {} })).rejects.toMatchObject({
      status: 400,
      message: "Please fix the highlighted fields.",
      fieldErrors: { name: "Name is required" },
    });
  });

  it("returns JSON on success", async () => {
    mockFetch(200, [{ id: 1 }]);
    await expect(apiRequest("/api/clubs")).resolves.toEqual([{ id: 1 }]);
  });
});
