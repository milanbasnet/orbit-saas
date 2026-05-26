import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductTable from "../../components/products/ProductTable";
import { getProducts } from "../../services/products";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta]         = useState(null);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({ page, search, status });
      setProducts(res.data);
      setMeta(res.meta);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 whenever filters change
  function handleSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatus(e) {
    setStatus(e.target.value);
    setPage(1);
  }

  function handleDeleted(deletedId) {
    setProducts((prev) => prev.filter((p) => p.id !== deletedId));
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog.</p>
        </div>
        <Link to="/products/create" className="btn-primary">
          + New Product
        </Link>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search by name or SKU…"
          value={search}
          onChange={handleSearch}
        />
        <select className="filter-select" value={status} onChange={handleStatus}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : (
        <ProductTable products={products} onDeleted={handleDeleted} />
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <span>
            Page {meta.current_page} of {meta.last_page} &mdash; {meta.total} products
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
