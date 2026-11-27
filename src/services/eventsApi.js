import { apiRequest, isMockMode } from './apiClient';
import { mockEvents } from './mockEvents';

// "18:00" -> "18:00:00" so every event has the same time format
function normalizeTime(time) {
  if (!time) return null;
  return time.length === 5 ? `${time}:00` : time;
}

// API event (name, start_date, venue, price, ...) -> the shape the
// components already use (name, startDate, venueName, priceMin, ...).
export function mapApiEvent(e) {
  const price = e.price ?? null;

  return {
    id: e.id,
    name: e.name,
    description: e.description ?? '',
    imageUrl: e.image_url ?? null,
    startDate: e.start_date ?? null,
    startTime: normalizeTime(e.start_time),
    venueName: e.venue ?? '',
    city: e.city ?? '',
    country: 'Kenya',
    lat: null,
    lng: null,
    priceMin: price,
    priceMax: price,
    currency: price == null ? null : 'KES',
    category: e.category ?? null,
    ticketUrl: null,
    clubId: e.club_id ?? e.club?.id ?? null,
    clubName: e.club?.name ?? null,
    universityName: e.university ?? null,
  };
}

function searchMock({ keyword }) {
  const k = keyword?.toLowerCase();
  return mockEvents.filter(
    (e) =>
      !k ||
      e.name.toLowerCase().includes(k) ||
      e.description.toLowerCase().includes(k) ||
      e.venueName.toLowerCase().includes(k)
  );
}

// keyword -> ?q=, university -> ?university=, clubId -> ?club_id=
// Category, free-only and sorting are done in the Browse page.
export async function searchEvents({ keyword, university, clubId } = {}) {
  if (isMockMode()) return searchMock({ keyword });

  const data = await apiRequest('/api/events', {
    params: { q: keyword, university, club_id: clubId },
  });
  return (Array.isArray(data) ? data : (data?.items ?? [])).map(mapApiEvent);
}

export async function getEventById(id) {
  if (isMockMode()) {
    const found = mockEvents.find((e) => e.id === id);
    if (!found) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    return found;
  }

  const data = await apiRequest(`/api/events/${encodeURIComponent(id)}`);
  return mapApiEvent(data);
}