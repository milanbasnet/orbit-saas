const BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "orbit_token";

// ─── Token storage ────────────────────────────────────────────────────────────
export const tokenStorage = {
  get:   ()      => localStorage.getItem(TOKEN_KEY),
  set:   (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: ()      => localStorage.removeItem(TOKEN_KEY),
};

// ─── Typed error ──────────────────────────────────────────────────────────────
// Callers can check `err instanceof ApiError` and read `err.status` / `err.errors`.
export class ApiError extends Error {
  constructor(status, data) {
    super(data?.message ?? "Request failed");
    this.name   = "ApiError";
    this.status = status;
    this.errors = data?.errors ?? {};   // Laravel validation errors map
    this.data   = data;
  }
}

// ─── Global 401 event ─────────────────────────────────────────────────────────
// AuthContext listens to this to sign the user out when any request expires mid-session.
export const AUTH_EXPIRED_EVENT = "auth:expired";

// ─── Central fetch wrapper ────────────────────────────────────────────────────
export async function apiFetch(path, options = {}) {
  const token = tokenStorage.get();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,   // allow callers to override individual headers
    },
  });

  // Token is no longer valid — clear it and notify the app globally
  if (res.status === 401) {
    tokenStorage.clear();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    throw new ApiError(401, { message: "Session expired. Please sign in again." });
  }

  // No content — nothing to parse
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data;
}

// ─── Blob fetch (for file downloads) ─────────────────────────────────────────
export async function blobFetch(path) {
  const token = tokenStorage.get();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "*/*",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    tokenStorage.clear();
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    throw new ApiError(401, { message: "Session expired. Please sign in again." });
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, data);
  }

  return res.blob();
}
