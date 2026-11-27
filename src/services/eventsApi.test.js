import { afterEach, describe, expect, it, vi } from "vitest";
import { getEventById, mapApiEvent, searchEvents } from "./eventsApi";

const apiEvent = {
  id: 7,
  name: "Hack Night",
  category: "Technology",
  description: "Build something in one evening.",
  start_date: "2026-12-20",
  start_time: "18:00",
  venue: "Main Auditorium",
  city: "Nairobi",
  price: 0,
  image_url: null,
  university: "Strathmore University",
  club_id: 1,
  club: { id: 1, name: "Strathmore Tech Society" },
  created_at: "2026-11-26T09:00:00Z",
};

function mockFetch(status, body) {
  const fn = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("mapApiEvent", () => {
  it("maps the API event to the shape the components use", () => {
    expect(mapApiEvent(apiEvent)).toMatchObject({
      id: 7,
      name: "Hack Night",
      startDate: "2026-12-20",
      startTime: "18:00:00",
      venueName: "Main Auditorium",
      priceMin: 0,
      priceMax: 0,
      currency: "KES",
      category: "Technology",
      clubId: 1,
      clubName: "Strathmore Tech Society",
      universityName: "Strathmore University",
    });
  });

  it("handles a missing time and price", () => {
    const e = mapApiEvent({ id: 1, name: "Bare", start_date: "2026-12-20" });
    expect(e.startTime).toBeNull();
    expect(e.priceMin).toBeNull();
    expect(e.currency).toBeNull();
    expect(e.description).toBe("");
  });
});

describe("API mode", () => {
  it("searchEvents sends q, university and club_id", async () => {
    const fetchMock = mockFetch(200, [apiEvent]);

    const events = await searchEvents({
      keyword: "hack",
      university: "Strathmore University",
      clubId: 1,
    });

    const url = new URL(fetchMock.mock.calls[0][0], "http://localhost");
    expect(url.pathname).toBe("/api/events");
    expect(url.searchParams.get("q")).toBe("hack");
    expect(url.searchParams.get("university")).toBe("Strathmore University");
    expect(url.searchParams.get("club_id")).toBe("1");
    expect(events[0].name).toBe("Hack Night");
  });

  it("prefixes VITE_API_URL when it is set", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.example.com/");
    const fetchMock = mockFetch(200, []);

    await searchEvents();

    expect(fetchMock.mock.calls[0][0]).toBe("https://api.example.com/api/events");
  });

  it("getEventById throws status 404 with the API message", async () => {
    mockFetch(404, { error: "Event not found." });

    await expect(getEventById("999")).rejects.toMatchObject({
      status: 404,
      message: "Event not found.",
    });
  });

  it("puts 400 field errors on err.fields", async () => {
    mockFetch(400, { errors: { name: "Name is required." } });

    await expect(searchEvents()).rejects.toMatchObject({
      status: 400,
      fields: { name: "Name is required." },
    });
  });

  it("turns a network failure into status 0", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));

    await expect(searchEvents()).rejects.toMatchObject({ status: 0 });
  });
});

describe("mock mode", () => {
  it("uses the mock events when VITE_USE_MOCK is true", async () => {
    vi.stubEnv("VITE_USE_MOCK", "true");
    const fetchMock = mockFetch(200, []);

    const events = await searchEvents();

    expect(events.length).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});