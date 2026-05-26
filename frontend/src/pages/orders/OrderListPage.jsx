import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderTable from "../../components/orders/OrderTable";
import { getOrders } from "../../services/orders";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrderListPage() {
  const [orders, setOrders]   = useState([]);
  const [meta, setMeta]       = useState(null);
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders({ page, search, status });
      setOrders(res.data);
      setMeta(res.meta);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatus(e) {
    setStatus(e.target.value);
    setPage(1);
  }

  function handleDeleted(deletedId) {
    setOrders((prev) => prev.filter((o) => o.id !== deletedId));
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Track and manage customer orders.</p>
        </div>
        <Link to="/orders/create" className="btn-primary">
          + New Order
        </Link>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search by order # or customer…"
          value={search}
          onChange={handleSearch}
        />
        <select className="filter-select" value={status} onChange={handleStatus}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : (
        <OrderTable orders={orders} onDeleted={handleDeleted} />
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <span>
            Page {meta.current_page} of {meta.last_page} &mdash; {meta.total} orders
          </span>
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={meta.current_page === 1}
            >
              &larr; Prev
            </button>
            <button
              className="page-btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.current_page === meta.last_page}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
