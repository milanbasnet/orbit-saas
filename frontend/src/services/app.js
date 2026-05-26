import { apiFetch } from "./http";

export function getDashboard() {
  return apiFetch("/dashboard");
}
