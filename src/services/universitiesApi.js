import { apiRequest } from "./apiClient";

// GET /api/universities -> [{ id, name, short_name }]
export async function listUniversities() {
  const data = await apiRequest("/api/universities");
  return (Array.isArray(data) ? data : data?.universities ?? []).map((u) => ({
    id: u.id,
    name: u.name ?? "",
    shortName: u.short_name ?? "",
  }));
}
