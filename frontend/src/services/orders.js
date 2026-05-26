import { apiFetch } from "./http";

export function getOrders({ page = 1, search = "", status = "" } = {}) {
  const params = new URLSearchParams({ page });
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return apiFetch(`/orders?${params}`);
}

export function getOrder(id) {
  return apiFetch(`/orders/${id}`);
}

export function createOrder(data) {
  return apiFetch("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOrder(id, data) {
  return apiFetch(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteOrder(id) {
  return apiFetch(`/orders/${id}`, { method: "DELETE" });
}
