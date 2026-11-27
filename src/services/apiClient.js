// Small fetch wrapper for the UniVent Flask API.
// In development, Vite proxies /api to the Flask server (see vite.config.js),
// so VITE_API_URL can stay empty. In production set it to the deployed API URL.
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status, fieldErrors = {} } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// The UniVent API sends every error as
//   { "error": { "status": 400, "message": "...", "fields": { "title": "Title is required" } } }
// (see backend/app/errors.py). We also accept a flat { "errors": {...} } shape just in case.
function readErrorBody(body) {
  if (!body || typeof body !== "object") return { message: null, fieldErrors: {} };

  const err = body.error && typeof body.error === "object" ? body.error : body;
  const raw = err.fields ?? err.errors ?? body.errors ?? {};

  const fieldErrors = {};
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    for (const [field, value] of Object.entries(raw)) {
      fieldErrors[field] = Array.isArray(value) ? value.join(" ") : String(value);
    }
  }

  const message =
    typeof err.message === "string"
      ? err.message
      : typeof body.error === "string"
      ? body.error
      : null;

  return { message, fieldErrors };
}

export async function apiRequest(path, { method = "GET", body, params } = {}) {
  const url = new URL(`${API_URL}${path}`, window.location.origin);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("We could not reach the server.", { status: 0 });
  }

  // 204 No Content (e.g. DELETE) has no body.
  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const { message, fieldErrors } = readErrorBody(data);
    throw new ApiError(message ?? `Request failed (${res.status}).`, {
      status: res.status,
      fieldErrors,
    });
  }

  return data;
}
