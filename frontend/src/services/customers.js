import { apiFetch } from "./http";

export function getCustomers({ page = 1, search = "", status = "", per_page = "" } = {}) {
  const params = new URLSearchParams({ page });
  if (search)   params.set("search", search);
  if (status)   params.set("status", status);
  if (per_page) params.set("per_page", per_page);
  return apiFetch(`/customers?${params}`);
}

export function getAllCustomers() {
  return getCustomers({ per_page: 100 });
}

export function getCustomer(id) {
  return apiFetch(`/customers/${id}`);
}

export function createCustomer(data) {
  return apiFetch("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCustomer(id, data) {
  return apiFetch(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCustomer(id) {
  return apiFetch(`/customers/${id}`, { method: "DELETE" });
}
