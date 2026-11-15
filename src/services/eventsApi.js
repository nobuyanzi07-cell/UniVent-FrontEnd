const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const KEY = import.meta.env.VITE_TM_API_KEY;

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

export const searchEvents = ({ keyword, city, page = 0, size = 20 }) =>
  request('/events.json', { keyword, city, page, size });

export const getEventById = (id) => request(`/events/${id}.json`);