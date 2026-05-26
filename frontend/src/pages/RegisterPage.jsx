import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form,    setForm]    = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await register(form.name, form.email, form.password, form.password_confirmation);
    setLoading(false);

    if (result.ok) {
      navigate("/dashboard", { replace: true });
    } else {
      setErrors(result.errors ?? {});
    }
  }

  const fields = [
    { name: "name",                  label: "Full name",        type: "text",     autoComplete: "name" },
    { name: "email",                 label: "Email",            type: "email",    autoComplete: "email" },
    { name: "password",              label: "Password",         type: "password", autoComplete: "new-password" },
    { name: "password_confirmation", label: "Confirm password", type: "password", autoComplete: "new-password" },
  ];

  return (
    <>
      <h1 className="auth-title">Create your account</h1>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {fields.map(({ name, label, type, autoComplete }) => (
          <div className="field" key={name}>
            <label htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              autoComplete={autoComplete}
              value={form[name]}
              onChange={handleChange}
              required
            />
            {errors[name] && <p className="field-error">{errors[name][0]}</p>}
          </div>
        ))}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  );
}
