import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.ok) {
      // Return the user to wherever they were trying to go, or fall back to /dashboard
      navigate(location.state?.from ?? "/dashboard", { replace: true });
    } else {
      setErrors(result.errors ?? { email: ["Invalid credentials."] });
    }
  }

  return (
    <>
      <h1 className="auth-title">Sign in to your account</h1>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="field-error">{errors.email[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="field-error">{errors.password[0]}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="auth-link">
        No account? <Link to="/register">Create one</Link>
      </p>
    </>
  );
}
