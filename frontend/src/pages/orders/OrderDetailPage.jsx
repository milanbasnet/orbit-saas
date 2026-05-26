import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../../services/orders";

const STATUS_CLASS = {
  pending:    "badge badge-draft",
  confirmed:  "badge badge-active",
  processing: "badge badge-active",
  shipped:    "badge badge-active",
  delivered:  "badge badge-inactive",
  cancelled:  "badge badge-inactive",
};

export default function OrderDetailPage() {
  const { id }              = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page">
        <p className="alert-error">{error ?? "Order not found."}</p>
        <Link to="/orders" className="btn-secondary" style={{ marginTop: "1rem", display: "inline-block" }}>
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  const items    = order.items ?? [];
  const customer = order.customer ?? {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{order.order_number}</h1>
          <p>
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className="table-actions">
          <Link to={`/orders/${order.id}/edit`} className="btn-secondary">
            Edit Order
          </Link>
          <Link to="/orders" className="btn-secondary">
            &larr; All Orders
          </Link>
        </span>
      </div>

      {/* ── Meta grid ── */}
      <div className="order-detail">
        <div className="detail-card">
          <h3>Order Info</h3>
          <div className="detail-row">
            <span className="detail-label">Order #</span>
            <span>{order.order_number}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={STATUS_CLASS[order.status] ?? "badge"}>{order.status}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <span>{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          {order.notes && (
            <div className="detail-row">
              <span className="detail-label">Notes</span>
              <span style={{ maxWidth: "60%", textAlign: "right" }}>{order.notes}</span>
            </div>
          )}
        </div>

        <div className="detail-card">
          <h3>Customer</h3>
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span>{customer.name ?? "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span style={{ color: "var(--color-muted)", fontSize: "0.87rem" }}>
              {customer.email ?? "—"}
            </span>
          </div>
          {customer.company && (
            <div className="detail-row">
              <span className="detail-label">Company</span>
              <span>{customer.company}</span>
            </div>
          )}
          {customer.phone && (
            <div className="detail-row">
              <span className="detail-label">Phone</span>
              <span>{customer.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Line items ── */}
      <div className="table-wrapper" style={{ marginBottom: "1.25rem" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th style={{ textAlign: "right" }}>Unit Price</th>
              <th style={{ textAlign: "right" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <code style={{ fontSize: "0.82rem", color: "var(--color-muted)" }}>
                    {item.product_sku}
                  </code>
                </td>
                <td>{item.product_name}</td>
                <td style={{ textAlign: "right" }}>
                  ${Number(item.unit_price).toFixed(2)}
                </td>
                <td style={{ textAlign: "right" }}>{item.quantity}</td>
                <td style={{ textAlign: "right", fontWeight: 600 }}>
                  ${Number(item.line_total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Totals ── */}
      <div className="order-totals">
        <div className="order-total-row">
          <span className="order-total-label">Subtotal</span>
          <span className="order-total-value">${Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div className="order-total-row grand-total">
          <span className="order-total-label">Total</span>
          <span className="order-total-value">${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
