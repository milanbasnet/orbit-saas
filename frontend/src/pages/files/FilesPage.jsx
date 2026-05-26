import { useEffect, useState, useCallback } from "react";
import FileUploader from "../../components/files/FileUploader";
import FileList     from "../../components/files/FileList";
import { getFiles } from "../../services/files";

export default function FilesPage() {
  const [files,    setFiles]    = useState([]);
  const [meta,     setMeta]     = useState(null);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const load = useCallback(async (pg = page, q = search) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFiles({ page: pg, search: q });
      setFiles(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err?.message ?? "Failed to load files.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e) {
    const q = e.target.value;
    setSearch(q);
    setPage(1);
    load(1, q);
  }

  function handleUploaded(newFile) {
    setFiles((prev) => [newFile, ...prev]);
  }

  function handleDeleted(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function changePage(pg) {
    setPage(pg);
    load(pg, search);
  }

  return (
    <div>
      <div className="toolbar">
        <h1 className="page-title">Files</h1>
      </div>

      <FileUploader onUploaded={handleUploaded} />

      <div className="toolbar" style={{ marginTop: "1.5rem" }}>
        <input
          type="search"
          className="search-input"
          placeholder="Search by file name…"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {error && <p className="alert-error">{error}</p>}

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading…</p>
      ) : (
        <FileList files={files} onDeleted={handleDeleted} />
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination-controls">
          <span className="pagination">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <div>
            <button
              className="page-btn"
              disabled={meta.current_page === 1}
              onClick={() => changePage(meta.current_page - 1)}
            >
              Prev
            </button>
            <button
              className="page-btn"
              disabled={meta.current_page === meta.last_page}
              onClick={() => changePage(meta.current_page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
