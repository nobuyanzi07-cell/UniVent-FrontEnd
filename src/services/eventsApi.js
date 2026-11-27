import { apiRequest } from "./apiClient";
import { mockEvents } from "./mockEvents";

// Set VITE_USE_MOCK=true to work on the UI without the Flask API running.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// "2026-12-05T18:00:00" -> ["2026-12-05", "18:00:00"]
function splitDateTime(value) {
  if (!value) return [null, null];
  const [date, time] = String(value).split("T");
  return [date || null, time ? time.slice(0, 8) : null];
}

// Backend event (see Event.to_dict in backend/app/models.py) -> the shape
// the UI components already use.
export function mapEvent(e) {
  const [startDate, startTime] = splitDateTime(e.start_at);
  const price = e.price_kes ?? null;
  return {
    id: e.id,
    name: e.title ?? "",
    description: e.description ?? "",
    imageUrl: e.image_url ?? null,
    startDate,
    startTime,
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
    capacity: e.capacity ?? null,
    clubId: e.club_id ?? null,
    clubName: e.club?.name ?? "",
    universityId: e.university_id ?? null,
    universityName: e.university?.name ?? "",
  };
}

// Create Event form -> backend payload.
export function toEventPayload(form) {
  return {
    title: form.name.trim(),
    category: form.category,
    description: form.description.trim() || null,
    // The API stores one datetime; time defaults to midnight if left empty.
    start_at: `${form.date}T${form.time || "00:00"}`,
    venue: form.venue.trim(),
    city: form.city.trim(),
    price_kes: form.price === "" ? 0 : Number(form.price),
    image_url: form.imageUrl.trim() || null,
    university_id: form.universityId ? Number(form.universityId) : null,
    club_id: form.clubId ? Number(form.clubId) : null,
  };
}

// Backend field name -> Create Event form field name, used to place server errors.
export const EVENT_FIELD_MAP = {
  title: "name",
  start_at: "date",
  price_kes: "price",
  image_url: "imageUrl",
  university_id: "universityId",
  club_id: "clubId",
};

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

export async function createEvent(form) {
  const data = await apiRequest("/api/events", {
    method: "POST",
    body: toEventPayload(form),
  });
  return mapEvent(data);
}
