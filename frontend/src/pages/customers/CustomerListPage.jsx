import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerTable from "../../components/customers/CustomerTable";
import { getCustomers } from "../../services/customers";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [meta, setMeta]           = useState(null);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [status, setStatus]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomers({ page, search, status });
      setCustomers(res.data);
      setMeta(res.meta);
    } catch {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatus(e) {
    setStatus(e.target.value);
    setPage(1);
  }

  function handleDeleted(deletedId) {
    setCustomers((prev) => prev.filter((c) => c.id !== deletedId));
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Customers</h1>
          <p>Manage your customer base.</p>
        </div>
        <Link to="/customers/create" className="btn-primary">
          + New Customer
        </Link>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search by name, email or company…"
          value={search}
          onChange={handleSearch}
        />
        <select className="filter-select" value={status} onChange={handleStatus}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : (
        <CustomerTable customers={customers} onDeleted={handleDeleted} />
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <span>
            Page {meta.current_page} of {meta.last_page} &mdash; {meta.total} customers
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
