import { apiFetch, tokenStorage } from "./http";

// Re-export so AuthContext can import tokenStorage from one place
export { tokenStorage };

export function register(name, email, password, passwordConfirmation) {
  return apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
}

export function login(email, password) {
  return apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  if (!tokenStorage.get()) return Promise.resolve(null);
  return apiFetch("/me");
}

export async function logout() {
  // Best-effort: inform the server, but always clear locally regardless of outcome
  await apiFetch("/logout", { method: "POST" }).catch(() => {});
  tokenStorage.clear();
}
