import { useCallback, useEffect, useState } from "react";
import { getAuditLogs } from "../../services/auditLogs";
import { getUsers } from "../../services/users";

const MODULES  = ["products", "customers", "orders", "users"];
const ACTIONS  = ["created", "updated", "deleted", "roles_updated"];

const ACTION_CLASS = {
  created:       "badge badge-active",
  updated:       "badge badge-inactive",
  deleted:       "badge badge-draft",
  roles_updated: "badge badge-inactive",
};

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString();
}

export default function AuditLogPage() {
  const [logs, setLogs]       = useState([]);
  const [meta, setMeta]       = useState(null);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [search,  setSearch]  = useState("");
  const [module,  setModule]  = useState("");
  const [userId,  setUserId]  = useState("");
  const [action,  setAction]  = useState("");
  const [from,    setFrom]    = useState("");
  const [to,      setTo]      = useState("");

  const [users, setUsers] = useState([]);

  // Expanded row for old/new values
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getUsers({ per_page: 100 })
      .then((res) => setUsers(res.data ?? []))
      .catch(() => {});
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAuditLogs({ page, search, module, user_id: userId, action, from, to });
      setLogs(res.data);
      setMeta(res.meta);
    } catch {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page, search, module, userId, action, from, to]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  function resetFilters() {
    setSearch(""); setModule(""); setUserId(""); setAction(""); setFrom(""); setTo(""); setPage(1);
  }

  const hasFilters = search || module || userId || action || from || to;

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Audit Log</h1>
          <p>Full history of create, update, and delete actions across all modules.</p>
        </div>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {/* ── Filters ── */}
      <div className="toolbar" style={{ flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.25rem" }}>
        <input
          className="search-input"
          type="search"
          placeholder="Search action, module, record ID…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="filter-select"
          value={module}
          onChange={(e) => { setModule(e.target.value); setPage(1); }}
        >
          <option value="">All modules</option>
          {MODULES.map((m) => (
            <option key={m} value={m} style={{ textTransform: "capitalize" }}>{m}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
        >
          <option value="">All actions</option>
          {ACTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={userId}
          onChange={(e) => { setUserId(e.target.value); setPage(1); }}
        >
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <input
          className="filter-select"
          type="date"
          value={from}
          onChange={(e) => { setFrom(e.target.value); setPage(1); }}
          title="From date"
          style={{ cursor: "pointer" }}
        />
        <input
          className="filter-select"
          type="date"
          value={to}
          onChange={(e) => { setTo(e.target.value); setPage(1); }}
          title="To date"
          style={{ cursor: "pointer" }}
        />
        {hasFilters && (
          <button className="btn-secondary btn-sm" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* ── Table ── */}
      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : logs.length === 0 ? (
        <div className="empty-state"><p>No audit log entries found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>When</th>
                <th>User</th>
                <th>Module</th>
                <th>Action</th>
                <th>Record</th>
                <th>IP</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <>
                  <tr key={log.id}>
                    <td style={{ color: "var(--color-muted)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                      {fmt(log.created_at)}
                    </td>
                    <td style={{ fontSize: "0.875rem" }}>
                      {log.user ? log.user.name : <span style={{ color: "var(--color-muted)" }}>System</span>}
                    </td>
                    <td>
                      <span className="badge badge-inactive" style={{ textTransform: "capitalize" }}>
                        {log.module}
                      </span>
                    </td>
                    <td>
                      <span className={ACTION_CLASS[log.action] ?? "badge"}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: "var(--color-muted)", fontSize: "0.82rem" }}>
                      {log.record_id ?? "—"}
                    </td>
                    <td style={{ color: "var(--color-muted)", fontSize: "0.78rem" }}>
                      {log.ip_address ?? "—"}
                    </td>
                    <td>
                      {(log.old_values || log.new_values) && (
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                        >
                          {expanded === log.id ? "▲" : "▼"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expanded === log.id && (
                    <tr key={`${log.id}-detail`}>
                      <td colSpan={7} style={{ padding: "0 1rem 1rem", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", paddingTop: "0.75rem" }}>
                          <div>
                            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                              Before
                            </p>
                            <pre style={{ fontSize: "0.78rem", color: "var(--color-muted)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                              {log.old_values ? JSON.stringify(log.old_values, null, 2) : "—"}
                            </pre>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                              After
                            </p>
                            <pre style={{ fontSize: "0.78rem", color: "var(--color-text)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                              {log.new_values ? JSON.stringify(log.new_values, null, 2) : "—"}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <span>Page {meta.current_page} of {meta.last_page} &mdash; {meta.total} entries</span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>&larr; Prev</button>
            <button className="page-btn" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>Next &rarr;</button>
          </div>
        </div>
      )}
    </div>
  );
}
