import { apiFetch } from "./http";

export function getUsers({ page = 1, search = "", per_page = "" } = {}) {
  const params = new URLSearchParams({ page });
  if (search)   params.set("search", search);
  if (per_page) params.set("per_page", per_page);
  return apiFetch(`/users?${params}`);
}

export function getUser(id) {
  return apiFetch(`/users/${id}`);
}

export function createUser(data) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function syncUserRoles(id, roles) {
  return apiFetch(`/users/${id}/roles`, {
    method: "PUT",
    body: JSON.stringify({ roles }),
  });
}
