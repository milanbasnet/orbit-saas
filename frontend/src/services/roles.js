import { apiFetch } from "./http";

export function getRoles() {
  return apiFetch("/roles");
}

export function getRole(id) {
  return apiFetch(`/roles/${id}`);
}

export function getAllPermissions() {
  return apiFetch("/roles/permissions");
}

export function createRole(data) {
  return apiFetch("/roles", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateRole(id, data) {
  return apiFetch(`/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteRole(id) {
  return apiFetch(`/roles/${id}`, { method: "DELETE" });
}
