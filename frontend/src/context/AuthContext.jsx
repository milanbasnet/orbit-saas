import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AUTH_EXPIRED_EVENT } from "../services/http";
import {
  getMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  tokenStorage,
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session on mount
  useEffect(() => {
    getMe()
      .then((data) => setUser(data?.id ? data : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Handle 401s from any in-flight request during an active session.
  // apiFetch dispatches AUTH_EXPIRED_EVENT before throwing, so we catch it here
  // globally without needing to thread logout callbacks through every service call.
  useEffect(() => {
    const handleExpiry = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiry);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiry);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      tokenStorage.set(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, errors: err.errors ?? {}, message: err.message };
    }
  }, []);

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    try {
      const data = await apiRegister(name, email, password, passwordConfirmation);
      tokenStorage.set(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, errors: err.errors ?? {}, message: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      // Always clear local state even if the API call fails
      setUser(null);
    }
  }, []);

  // Role/permission helpers derived from the user object
  const hasRole = useCallback(
    (role) => user?.roles?.includes(role) ?? false,
    [user]
  );

  const hasAnyRole = useCallback(
    (...roles) => roles.some((r) => user?.roles?.includes(r)),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole, hasAnyRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
