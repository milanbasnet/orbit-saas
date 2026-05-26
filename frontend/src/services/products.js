import { apiFetch } from "./http";

export function getProducts({ page = 1, search = "", status = "", per_page = "" } = {}) {
  const params = new URLSearchParams({ page });
  if (search)   params.set("search", search);
  if (status)   params.set("status", status);
  if (per_page) params.set("per_page", per_page);
  return apiFetch(`/products?${params}`);
}

export function getAllActiveProducts() {
  return getProducts({ per_page: 100, status: "active" });
}

export function getProduct(id) {
  return apiFetch(`/products/${id}`);
}

export function createProduct(data) {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id, data) {
  return apiFetch(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id) {
  return apiFetch(`/products/${id}`, { method: "DELETE" });
}
