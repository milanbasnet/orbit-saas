import { useState } from "react";
import { Link } from "react-router-dom";
import OrderItemsEditor from "./OrderItemsEditor";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const EMPTY = {
  customer_id: "",
  status: "pending",
  notes: "",
  items: [{ product_id: "", quantity: 1 }],
};

export default function OrderForm({
  initialValues = {},
  onSubmit,
  loading = false,
  errors = {},
  submitLabel = "Save",
  cancelTo = "/orders",
  customers = [],
  products = [],
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });

  function set(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function handleItemsChange(items) {
    setValues((v) => ({ ...v, items }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      customer_id: values.customer_id,
      status:      values.status,
      notes:       values.notes,
      items:       values.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity:   Number(item.quantity),
      })),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Header fields ── */}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="of-customer">Customer</label>
          <select
            id="of-customer"
            value={values.customer_id}
            onChange={set("customer_id")}
            required
          >
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.company ? ` — ${c.company}` : ""}
              </option>
            ))}
          </select>
          {errors.customer_id && (
            <p className="field-error">{errors.customer_id[0]}</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="of-status">Status</label>
          <select id="of-status" value={values.status} onChange={set("status")}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && <p className="field-error">{errors.status[0]}</p>}
        </div>

        <div className="field field-full">
          <label htmlFor="of-notes">Notes</label>
          <textarea
            id="of-notes"
            value={values.notes}
            onChange={set("notes")}
            placeholder="Optional notes about this order"
          />
          {errors.notes && <p className="field-error">{errors.notes[0]}</p>}
        </div>
      </div>

      {/* ── Line items ── */}
      <OrderItemsEditor
        items={values.items}
        products={products}
        errors={errors}
        onChange={handleItemsChange}
      />

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
