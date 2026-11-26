import { apiRequest } from "./apiClient";
import { mockEvents } from "./mockEvents";

// Set VITE_USE_MOCK=true to work on the UI without the Flask API running.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Backend (snake_case) -> the shape the UI components already use.
export function mapEvent(e) {
  const price = e.price ?? null;
  return {
    id: e.id,
    name: e.name ?? "",
    description: e.description ?? "",
    imageUrl: e.image_url ?? null,
    startDate: e.start_date ?? null,
    startTime: e.start_time ?? null,
    venueName: e.venue ?? "",
    city: e.city ?? "",
    country: "Kenya",
    lat: null,
    lng: null,
    priceMin: price,
    priceMax: price,
    currency: price === null ? null : "KES",
    category: e.category ?? null,
    ticketUrl: null,
    university: e.university ?? "",
    clubId: e.club_id ?? null,
    clubName: e.club?.name ?? "",
  };
}

// Create Event form -> backend payload.
export function toEventPayload(form) {
  return {
    name: form.name.trim(),
    category: form.category,
    description: form.description.trim(),
    start_date: form.date,
    start_time: form.time || null,
    venue: form.venue.trim(),
    city: form.city.trim(),
    price: form.price === "" ? 0 : Number(form.price),
    image_url: form.imageUrl.trim() || null,
    university: form.university,
    club_id: form.clubId ? Number(form.clubId) : null,
  };
}

// Backend field name -> Create Event form field name, used to place server errors.
export const EVENT_FIELD_MAP = {
  start_date: "date",
  start_time: "time",
  image_url: "imageUrl",
  club_id: "clubId",
};

// GET /api/events?q=...
export async function searchEvents({ keyword } = {}) {
  if (USE_MOCK) {
    const k = keyword?.toLowerCase();
    return mockEvents.filter(
      (e) =>
        !k ||
        e.name.toLowerCase().includes(k) ||
        e.description.toLowerCase().includes(k) ||
        e.venueName.toLowerCase().includes(k)
    );
  }
  const data = await apiRequest("/api/events", { params: { q: keyword } });
  return (Array.isArray(data) ? data : data?.events ?? []).map(mapEvent);
}

// GET /api/events/<id>
export async function getEventById(id) {
  if (USE_MOCK) {
    const found = mockEvents.find((e) => e.id === id);
    if (!found) {
      const err = new Error("Event not found");
      err.status = 404;
      throw err;
    }
    return found;
  }
  return mapEvent(await apiRequest(`/api/events/${id}`));
}

// POST /api/events
export async function createEvent(form) {
  const data = await apiRequest("/api/events", {
    method: "POST",
    body: toEventPayload(form),
  });
  return mapEvent(data);
}