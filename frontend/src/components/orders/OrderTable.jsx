import { Link } from "react-router-dom";
import OrderDeleteButton from "./OrderDeleteButton";

const STATUS_CLASS = {
  pending:    "badge badge-draft",
  confirmed:  "badge badge-active",
  processing: "badge badge-active",
  shipped:    "badge badge-active",
  delivered:  "badge badge-inactive",
  cancelled:  "badge badge-inactive",
};

export default function OrderTable({ orders, onDeleted }) {
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Date</th>
            <th></th>
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
                <span>{order.customer?.name ?? "—"}</span>
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
              <td>
                <span className="table-actions">
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn-secondary btn-sm"
                  >
                    View
                  </Link>
                  <Link
                    to={`/orders/${order.id}/edit`}
                    className="btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                  <OrderDeleteButton
                    orderId={order.id}
                    orderNumber={order.order_number}
                    onDeleted={onDeleted}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
