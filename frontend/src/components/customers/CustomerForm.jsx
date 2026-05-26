import { useState } from "react";
import { Link } from "react-router-dom";

const STATUSES = ["active", "inactive"];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "active",
  notes: "",
};

export default function CustomerForm({
  initialValues = {},
  onSubmit,
  loading = false,
  errors = {},
  submitLabel = "Save",
  cancelTo = "/customers",
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });

  function set(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...values });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            value={values.name}
            onChange={set("name")}
            placeholder="Full name"
            required
          />
          {errors.name && <p className="field-error">{errors.name[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            value={values.email}
            onChange={set("email")}
            placeholder="email@example.com"
            required
          />
          {errors.email && <p className="field-error">{errors.email[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="cf-phone">Phone</label>
          <input
            id="cf-phone"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="+1 555 000 0000"
          />
          {errors.phone && <p className="field-error">{errors.phone[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="cf-company">Company</label>
          <input
            id="cf-company"
            value={values.company}
            onChange={set("company")}
            placeholder="Company name"
          />
          {errors.company && <p className="field-error">{errors.company[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="cf-status">Status</label>
          <select id="cf-status" value={values.status} onChange={set("status")}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && <p className="field-error">{errors.status[0]}</p>}
        </div>

        <div className="field field-full">
          <label htmlFor="cf-notes">Notes</label>
          <textarea
            id="cf-notes"
            value={values.notes}
            onChange={set("notes")}
            placeholder="Optional notes about this customer"
          />
          {errors.notes && <p className="field-error">{errors.notes[0]}</p>}
        </div>
      </div>

      {errors._general && (
        <p className="alert-error" style={{ marginTop: "1rem" }}>
          {errors._general}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving…" : submitLabel}
        </button>
        <Link to={cancelTo} className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
