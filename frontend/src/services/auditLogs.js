import { apiFetch } from "./http";

export function getAuditLogs({
  page     = 1,
  search   = "",
  module   = "",
  user_id  = "",
  action   = "",
  from     = "",
  to       = "",
  per_page = "",
} = {}) {
  const params = new URLSearchParams({ page });
  if (search)   params.set("search",   search);
  if (module)   params.set("module",   module);
  if (user_id)  params.set("user_id",  user_id);
  if (action)   params.set("action",   action);
  if (from)     params.set("from",     from);
  if (to)       params.set("to",       to);
  if (per_page) params.set("per_page", per_page);
  return apiFetch(`/audit-logs?${params}`);
}
