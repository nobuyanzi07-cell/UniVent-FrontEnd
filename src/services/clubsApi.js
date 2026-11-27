import { apiRequest } from "./apiClient";

// Backend (snake_case) -> frontend (camelCase)
export function mapClub(c) {
  return {
    id: c.id,
    name: c.name ?? "",
    universityId: c.university_id ?? c.university?.id ?? null,
    universityName: c.university?.name ?? "",
    description: c.description ?? "",
    contactEmail: c.contact_email ?? "",
    logoUrl: c.logo_url ?? "",
  };
}

// Club form -> backend payload. The form keeps the university id as a string.
export function toClubPayload(form) {
  return {
    name: form.name.trim(),
    university_id: form.universityId ? Number(form.universityId) : null,
    description: form.description.trim() || null,
    contact_email: form.contactEmail.trim() || null,
    logo_url: form.logoUrl.trim() || null,
  };
}

// Backend field name -> form field name, used to place server errors.
export const CLUB_FIELD_MAP = {
  university_id: "universityId",
  contact_email: "contactEmail",
  logo_url: "logoUrl",
};

// GET /api/clubs?university=<id>
export async function listClubs({ universityId } = {}) {
  const data = await apiRequest("/api/clubs", { params: { university: universityId } });
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
