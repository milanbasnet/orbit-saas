import { Link } from "react-router-dom";
import ProductDeleteButton from "./ProductDeleteButton";

const STATUS_CLASS = {
  active:   "badge badge-active",
  inactive: "badge badge-inactive",
  draft:    "badge badge-draft",
};

export default function ProductTable({ products, onDeleted }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <code style={{ fontSize: "0.82rem", color: "var(--color-muted)" }}>
                  {product.sku}
                </code>
              </td>
              <td>{product.name}</td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>
                <span className={STATUS_CLASS[product.status] ?? "badge"}>
                  {product.status}
                </span>
              </td>
              <td style={{ color: "var(--color-muted)", fontSize: "0.82rem" }}>
                {new Date(product.created_at).toLocaleDateString()}
              </td>
              <td>
                <span className="table-actions">
                  <Link
                    to={`/products/${product.id}/edit`}
                    className="btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                  <ProductDeleteButton
                    productId={product.id}
                    productName={product.name}
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
