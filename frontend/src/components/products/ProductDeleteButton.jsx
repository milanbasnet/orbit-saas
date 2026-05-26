import { useState } from "react";
import { deleteProduct } from "../../services/products";

export default function ProductDeleteButton({ productId, productName, onDeleted }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteProduct(productId);
      onDeleted(productId);
    } catch {
      setError("Delete failed. Please try again.");
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="table-actions">
        <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
          Delete &ldquo;{productName}&rdquo;?
        </span>
        <button
          className="btn-danger btn-sm"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "…" : "Yes"}
        </button>
        <button
          className="btn-secondary btn-sm"
          onClick={() => setConfirming(false)}
          disabled={loading}
        >
          No
        </button>
        {error && <span className="field-error">{error}</span>}
      </span>
    );
  }

  return (
    <button
      className="btn-danger btn-sm"
      onClick={() => setConfirming(true)}
    >
      Delete
    </button>
  );
}
