import { useState } from "react";
import { Link } from "react-router-dom";

const STATUSES = ["draft", "active", "inactive"];

const EMPTY = {
  sku: "",
  name: "",
  description: "",
  price: "",
  status: "draft",
};

export default function ProductForm({
  initialValues = {},
  onSubmit,
  loading = false,
  errors = {},
  submitLabel = "Save",
  cancelTo = "/products",
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });

  function set(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...values,
      price: values.price === "" ? "" : Number(values.price),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="pf-sku">SKU</label>
          <input
            id="pf-sku"
            value={values.sku}
            onChange={set("sku")}
            placeholder="e.g. PROD-001"
            required
          />
          {errors.sku && <p className="field-error">{errors.sku[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="pf-name">Name</label>
          <input
            id="pf-name"
            value={values.name}
            onChange={set("name")}
            placeholder="Product name"
            required
          />
          {errors.name && <p className="field-error">{errors.name[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="pf-price">Price</label>
          <input
            id="pf-price"
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={set("price")}
            placeholder="0.00"
            required
          />
          {errors.price && <p className="field-error">{errors.price[0]}</p>}
        </div>

        <div className="field">
          <label htmlFor="pf-status">Status</label>
          <select id="pf-status" value={values.status} onChange={set("status")}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && <p className="field-error">{errors.status[0]}</p>}
        </div>

        <div className="field field-full">
          <label htmlFor="pf-description">Description</label>
          <textarea
            id="pf-description"
            value={values.description}
            onChange={set("description")}
            placeholder="Optional product description"
          />
          {errors.description && (
            <p className="field-error">{errors.description[0]}</p>
          )}
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
