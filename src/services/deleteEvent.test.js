import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteEvent } from "./eventsApi";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("deleteEvent", () => {
  it("sends DELETE to /api/events/:id", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await deleteEvent(7);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/events/7");
    expect(options.method).toBe("DELETE");
  });

  it("throws with the status when the API says 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 404,
        json: async () => ({ error: "Event not found." }),
      }))
    );

    await expect(deleteEvent(99)).rejects.toMatchObject({ status: 404 });
  });

  it("does not call the API in mock mode", async () => {
    vi.stubEnv("VITE_USE_MOCK", "true");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await deleteEvent(1);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});