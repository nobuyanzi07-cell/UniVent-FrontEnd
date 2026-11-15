import { mockEvents } from './mockEvents';

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TM_API_KEY;
const USE_MOCK = !API_KEY;


async function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('apikey', KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  const res = await fetch(url);
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
    return mockEvents.filter((e) => !k || e.name.toLowerCase().includes(k));
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