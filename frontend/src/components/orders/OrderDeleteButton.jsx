import { useState } from "react";
import { deleteOrder } from "../../services/orders";

export default function OrderDeleteButton({ orderId, orderNumber, onDeleted }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteOrder(orderId);
      onDeleted(orderId);
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
          Delete {orderNumber}?
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
    <button className="btn-danger btn-sm" onClick={() => setConfirming(true)}>
      Delete
    </button>
  );
}
