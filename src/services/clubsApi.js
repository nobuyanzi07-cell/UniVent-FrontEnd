import { apiRequest } from "./apiClient";

// Backend (snake_case) -> frontend (camelCase)
export function mapClub(c) {
  return {
    id: c.id,
    name: c.name ?? "",
    university: c.university ?? "",
    description: c.description ?? "",
    contactEmail: c.contact_email ?? "",
    logoUrl: c.logo_url ?? "",
  };
}

// Frontend form -> backend payload
export function toClubPayload(form) {
  return {
    name: form.name.trim(),
    university: form.university,
    description: form.description.trim(),
    contact_email: form.contactEmail.trim() || null,
    logo_url: form.logoUrl.trim() || null,
  };
}

// Backend field name -> form field name, used to place server errors.
export const CLUB_FIELD_MAP = {
  contact_email: "contactEmail",
  logo_url: "logoUrl",
};

// GET /api/clubs?university=...
export async function listClubs({ university } = {}) {
  const data = await apiRequest("/api/clubs", { params: { university } });
  return (Array.isArray(data) ? data : data?.clubs ?? []).map(mapClub);
}

// GET /api/clubs/<id>
export async function getClub(id) {
  return mapClub(await apiRequest(`/api/clubs/${id}`));
}

// POST /api/clubs
export async function createClub(form) {
  return mapClub(
    await apiRequest("/api/clubs", { method: "POST", body: toClubPayload(form) })
  );
}

// PATCH /api/clubs/<id>
export async function updateClub(id, form) {
  return mapClub(
    await apiRequest(`/api/clubs/${id}`, {
      method: "PATCH",
      body: toClubPayload(form),
    })
  );
}