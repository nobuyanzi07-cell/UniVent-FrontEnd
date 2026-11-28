import { apiRequest, isMockMode } from './apiClient';
import { mockClubs } from './mockClubs';

// API club (contact_email, logo_url, created_at) -> camelCase for the components
export function mapApiClub(c) {
  return {
    id: c.id,
    name: c.name,
    university: c.university ?? '',
    description: c.description ?? '',
    contactEmail: c.contact_email ?? null,
    logoUrl: c.logo_url ?? null,
    createdAt: c.created_at ?? null,
  };
}

export async function getClubs({ university } = {}) {
  if (isMockMode()) {
    return mockClubs.filter((c) => !university || c.university === university);
  }

  const data = await apiRequest('/api/clubs', { params: { university } });
  return (Array.isArray(data) ? data : (data?.items ?? [])).map(mapApiClub);
}

export async function getClubById(id) {
  if (isMockMode()) {
    const found = mockClubs.find((c) => String(c.id) === String(id));
    if (!found) {
      const err = new Error('Club not found.');
      err.status = 404;
      err.fields = {};
      throw err;
    }
    return found;
  }

  const data = await apiRequest(`/api/clubs/${encodeURIComponent(id)}`);
  return mapApiClub(data);
}
