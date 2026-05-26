import { apiFetch, blobFetch } from "./http";

export function getFiles({ page = 1, search = "", mime = "", per_page = 20 } = {}) {
  const params = new URLSearchParams({ page, per_page });
  if (search) params.set("search", search);
  if (mime)   params.set("mime", mime);
  return apiFetch(`/files?${params}`);
}

export function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  return apiFetch("/files", { method: "POST", body: form });
}

export async function downloadFile(id, filename) {
  const blob = await blobFetch(`/files/${id}/download`);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function deleteFile(id) {
  return apiFetch(`/files/${id}`, { method: "DELETE" });
}
