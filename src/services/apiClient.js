// Thin wrapper around fetch for the UniVent Flask API (see docs/API.md).
//
// VITE_API_URL  API origin for production, e.g. https://univent-api.onrender.com
//               Leave empty locally: requests go to /api and Vite proxies them.
// VITE_USE_MOCK "true" uses the built-in mock events instead of the API.

export function isMockMode() {
  return import.meta.env.VITE_USE_MOCK === 'true';
}

function buildUrl(path, params = {}) {
  const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });
  const qs = query.toString();
  return `${base}${path}${qs ? `?${qs}` : ''}`;
}

// Error bodies from the API:
//   400  { "errors": { "name": "Name is required." } }
//   else { "error": "Club not found." }
//   or   { "error": { "status": 400, "message": "...", "fields": { ... } } }
// Thrown errors carry .status (read by getErrorInfo), .message and .fields.
function toError(res, data) {
  const err = new Error('Request failed');
  err.status = res.status;
  err.fields = {};

  if (data && typeof data === 'object') {
    if (data.errors && typeof data.errors === 'object') err.fields = data.errors;
    if (typeof data.error === 'string') {
      err.message = data.error;
    } else if (data.error && typeof data.error === 'object') {
      err.message = data.error.message ?? err.message;
      err.fields = data.error.fields ?? err.fields;
    }
  }
  if (res.status === 400 && err.message === 'Request failed') {
    err.message = 'Please fix the highlighted fields.';
  }
  return err;
}

export async function apiRequest(path, { method = 'GET', params, body } = {}) {
  let res;
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error('Network error');
    err.status = 0;
    err.fields = {};
    throw err;
  }

  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) throw toError(res, data);
  return data;
}
