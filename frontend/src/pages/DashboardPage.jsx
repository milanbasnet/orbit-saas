import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/app";

const STATUS_CLASS = {
  pending:    "badge badge-draft",
  confirmed:  "badge badge-active",
  processing: "badge badge-active",
  shipped:    "badge badge-active",
  delivered:  "badge badge-inactive",
  cancelled:  "badge badge-inactive",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style:    "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function DashboardPage() {
  const { user }              = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const stats  = data?.stats  ?? {};
  const orders = data?.recent_orders ?? [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong>.</p>
        </div>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {/* ── Metric cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Products</span>
          <span className="stat-value">
            {loading ? "—" : (stats.total_products ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Customers</span>
          <span className="stat-value">
            {loading ? "—" : (stats.total_customers ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">
            {loading ? "—" : (stats.total_orders ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Orders This Month</span>
          <span className="stat-value">
            {loading ? "—" : (stats.orders_this_month ?? 0).toLocaleString()}
          </span>
        </div>
        <div className="stat-card stat-card--highlight">
          <span className="stat-label">Revenue This Month</span>
          <span className="stat-value stat-value--currency">
            {loading ? "—" : formatCurrency(stats.revenue_this_month)}
          </span>
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="section-header">
        <h2 className="section-title">Recent Orders</h2>
        <Link to="/orders" className="section-link">View all &rarr;</Link>
      </div>

      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link
                      to={`/orders/${order.id}`}
                      style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td>
                    {order.customer?.name ?? "—"}
                    {order.customer?.company && (
                      <span style={{ display: "block", fontSize: "0.78rem", color: "var(--color-muted)" }}>
                        {order.customer.company}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={STATUS_CLASS[order.status] ?? "badge"}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td style={{ color: "var(--color-muted)", fontSize: "0.82rem" }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

