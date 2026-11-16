import { mockEvents } from './mockEvents';

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TM_API_KEY;
const USE_MOCK = !API_KEY;

function mapEvent(e) {
  const venue = e._embedded?.venues?.[0];
  const price = e.priceRanges?.[0];
  const image =
    e.images?.find((i) => i.ratio === '16_9' && i.width >= 500) ?? e.images?.[0];
  const lat = venue?.location?.latitude;
  const lng = venue?.location?.longitude;

  return {
    id: e.id,
    name: e.name,
    description: e.info ?? e.pleaseNote ?? '',
    imageUrl: image?.url ?? null,
    startDate: e.dates?.start?.localDate ?? null,
    startTime: e.dates?.start?.localTime ?? null,
    venueName: venue?.name ?? '',
    city: venue?.city?.name ?? '',
    country: venue?.country?.name ?? '',
    lat: lat ? Number(lat) : null,
    lng: lng ? Number(lng) : null,
    priceMin: price?.min ?? null,
    priceMax: price?.max ?? null,
    currency: price?.currency ?? null,
    category: e.classifications?.[0]?.segment?.name ?? null,
    ticketUrl: e.url ?? null,
  };
}

async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  let res;
  try {
    res = await fetch(url);
  } catch {
    const err = new Error('Network error');
    err.status = 0;
    throw err;
  }
  if (!res.ok) {
    const err = new Error('Request failed');
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function searchEvents({ keyword, city, page = 0, size = 20 } = {}) {
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
  const data = await request('/events.json', { keyword, city, page, size });
  return (data._embedded?.events ?? []).map(mapEvent);
}

export async function getEventById(id) {
  if (USE_MOCK) {
    const found = mockEvents.find((e) => e.id === id);
    if (!found) {
      const err = new Error('Event not found');
      err.status = 404;
      throw err;
    }
    return found;
  }
  const data = await request(`/events/${id}.json`);
  return mapEvent(data);
}