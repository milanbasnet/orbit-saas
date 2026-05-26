import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getRoles } from "../../services/roles";
import { createUser, getUsers, syncUserRoles } from "../../services/users";

const EMPTY_FORM = { name: "", email: "", password: "", password_confirmation: "", roles: [] };

export default function UserListPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("Admin");

  const [users, setUsers]       = useState([]);
  const [meta, setMeta]         = useState(null);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [roles, setRoles]         = useState([]);
  const [assigning, setAssigning] = useState(null);   // user for role assignment modal
  const [selected, setSelected]   = useState([]);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Create user form
  const [showCreate, setShowCreate]   = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]   = useState({});
  const [creating, setCreating]       = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({ page, search });
      setUsers(res.data);
      setMeta(res.meta);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    getRoles()
      .then((res) => setRoles(res.data ?? res))
      .catch(() => {});
  }, []);

  function handleSearch(e) { setSearch(e.target.value); setPage(1); }

  // ── Create user ──────────────────────────────────────────────────────────
  function openCreate() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowCreate(true);
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFormRole(name) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(name)
        ? prev.roles.filter((r) => r !== name)
        : [...prev.roles, name],
    }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setFormErrors({});
    try {
      const created = await createUser(form);
      setUsers((prev) => [created.data, ...prev]);
      setShowCreate(false);
    } catch (err) {
      setFormErrors(err.errors ?? { general: err.message });
    } finally {
      setCreating(false);
    }
  }

  // ── Assign roles ─────────────────────────────────────────────────────────
  function openAssign(user) {
    setAssigning(user);
    setSelected(user.roles ?? []);
    setSaveError(null);
  }

  function toggleRole(name) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await syncUserRoles(assigning.id, selected);
      setUsers((prev) => prev.map((u) => (u.id === updated.data.id ? updated.data : u)));
      setAssigning(null);
    } catch (err) {
      setSaveError(err.message ?? "Failed to update roles.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage user accounts and role assignments.</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={openCreate}>+ New User</button>
        )}
      </div>

      {error && <p className="alert-error">{error}</p>}

      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : users.length === 0 ? (
        <div className="empty-state"><p>No users found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                {isAdmin && <th style={{ width: 80 }}></th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>{user.email}</td>
                  <td>
                    {(user.roles ?? []).length === 0
                      ? <span className="badge badge-draft">No role</span>
                      : (user.roles ?? []).map((r) => (
                          <span key={r} className="badge badge-active" style={{ marginRight: 4 }}>{r}</span>
                        ))}
                  </td>
                  {isAdmin && (
                    <td>
                      <span className="table-actions">
                        <button className="btn-secondary btn-sm" onClick={() => openAssign(user)}>Roles</button>
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <span>Page {meta.current_page} of {meta.last_page} &mdash; {meta.total} users</span>
          <div className="pagination-controls">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>&larr; Prev</button>
            <button className="page-btn" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>Next &rarr;</button>
          </div>
        </div>
      )}

      {/* ── Create user modal ── */}
      {showCreate && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>New User</h2>
            {formErrors.general && <p className="alert-error">{formErrors.general}</p>}
            <form onSubmit={handleCreate}>
              <div className="field" style={{ marginBottom: "1rem" }}>
                <label>Name</label>
                <input value={form.name} onChange={(e) => setField("name", e.target.value)} required />
                {formErrors.name && <p className="field-error">{formErrors.name[0]}</p>}
              </div>
              <div className="field" style={{ marginBottom: "1rem" }}>
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
                {formErrors.email && <p className="field-error">{formErrors.email[0]}</p>}
              </div>
              <div className="field" style={{ marginBottom: "1rem" }}>
                <label>Password</label>
                <input type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} required minLength={8} />
                {formErrors.password && <p className="field-error">{formErrors.password[0]}</p>}
              </div>
              <div className="field" style={{ marginBottom: "1.5rem" }}>
                <label>Confirm Password</label>
                <input type="password" value={form.password_confirmation} onChange={(e) => setField("password_confirmation", e.target.value)} required />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Assign Roles</p>
                <div className="role-check-list">
                  {roles.map((role) => (
                    <label key={role.id} className="role-check">
                      <input type="checkbox" checked={form.roles.includes(role.name)} onChange={() => toggleFormRole(role.name)} />
                      <strong>{role.name}</strong>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)} disabled={creating}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={creating} style={{ marginTop: 0 }}>
                  {creating ? "Creating…" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign roles modal ── */}
      {assigning && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Assign Roles</h2>
            <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              {assigning.name} &mdash; {assigning.email}
            </p>
            {saveError && <p className="alert-error">{saveError}</p>}
            <div className="role-check-list">
              {roles.map((role) => (
                <label key={role.id} className="role-check">
                  <input type="checkbox" checked={selected.includes(role.name)} onChange={() => toggleRole(role.name)} />
                  <strong>{role.name}</strong>
                </label>
              ))}
            </div>
            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setAssigning(null)} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 0 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

