import { Link } from "react-router-dom";
import CustomerDeleteButton from "./CustomerDeleteButton";

const STATUS_CLASS = {
  active:   "badge badge-active",
  inactive: "badge badge-inactive",
};

export default function CustomerTable({ customers, onDeleted }) {
  if (customers.length === 0) {
    return (
      <div className="empty-state">
        <p>No customers found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td style={{ color: "var(--color-muted)", fontSize: "0.87rem" }}>
                {customer.email}
              </td>
              <td>{customer.company ?? <span style={{ color: "var(--color-muted)" }}>—</span>}</td>
              <td style={{ color: "var(--color-muted)", fontSize: "0.87rem" }}>
                {customer.phone ?? <span>—</span>}
              </td>
              <td>
                <span className={STATUS_CLASS[customer.status] ?? "badge"}>
                  {customer.status}
                </span>
              </td>
              <td style={{ color: "var(--color-muted)", fontSize: "0.82rem" }}>
                {new Date(customer.created_at).toLocaleDateString()}
              </td>
              <td>
                <span className="table-actions">
                  <Link
                    to={`/customers/${customer.id}/edit`}
                    className="btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                  <CustomerDeleteButton
                    customerId={customer.id}
                    customerName={customer.name}
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
