import { useCallback, useEffect, useState } from "react";
import { createRole, deleteRole, getAllPermissions, getRoles, updateRole } from "../../services/roles";

const ALL_GROUPS = ["products", "customers", "orders", "users", "roles"];

export default function RoleListPage() {
  const [roles, setRoles]               = useState([]);
  const [allPerms, setAllPerms]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [editing, setEditing]           = useState(null);       // Role object or null
  const [formName, setFormName]         = useState("");
  const [formPerms, setFormPerms]       = useState([]);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, permsRes] = await Promise.all([getRoles(), getAllPermissions()]);
      setRoles(rolesRes.data ?? rolesRes);
      setAllPerms(permsRes);
    } catch {
      setError("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setFormName("");
    setFormPerms([]);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(role) {
    setEditing(role);
    setFormName(role.name);
    setFormPerms(role.permissions ?? []);
    setFormError(null);
    setShowForm(true);
  }

  function togglePerm(perm) {
    setFormPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        const updated = await updateRole(editing.id, { name: formName, permissions: formPerms });
        setRoles((prev) => prev.map((r) => (r.id === updated.data.id ? updated.data : r)));
      } else {
        const created = await createRole({ name: formName, permissions: formPerms });
        setRoles((prev) => [...prev, created.data]);
      }
      setShowForm(false);
    } catch (err) {
      setFormError(err.message ?? "Failed to save role.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(role) {
    if (!window.confirm(`Delete role "${role.name}"?`)) return;
    try {
      await deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
    } catch {
      alert("Failed to delete role.");
    }
  }

  // Group permissions by resource (e.g. "products.view" → "products")
  function groupedPerms() {
    const map = {};
    allPerms.forEach((p) => {
      const [group] = p.split(".");
      (map[group] ??= []).push(p);
    });
    return map;
  }

  const groups = groupedPerms();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Roles</h1>
          <p>Manage application roles and their permissions.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Role</button>
      </div>

      {error && <p className="alert-error">{error}</p>}

      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading…</p>
      ) : roles.length === 0 ? (
        <div className="empty-state"><p>No roles found.</p></div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 140 }}>Role</th>
                <th>Permissions</th>
                <th style={{ width: 110 }}></th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td><strong>{role.name}</strong></td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {(role.permissions ?? []).length === 0
                        ? <span className="badge badge-draft">No permissions</span>
                        : (role.permissions ?? []).map((p) => (
                            <span key={p} className="badge badge-inactive">{p}</span>
                          ))}
                    </div>
                  </td>
                  <td>
                    <span className="table-actions">
                      <button className="btn-secondary btn-sm" onClick={() => openEdit(role)}>Edit</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(role)}>Delete</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Role form modal ── */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editing ? `Edit "${editing.name}"` : "New Role"}</h2>
            {formError && <p className="alert-error">{formError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="field" style={{ marginBottom: "1.5rem" }}>
                <label>Role Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                  Permissions
                </p>
                {Object.entries(groups).map(([group, perms]) => (
                  <div key={group} className="perm-group">
                    <p className="perm-group-label">{group}</p>
                    <div className="perm-row">
                      {perms.map((p) => (
                        <label key={p} className="perm-check">
                          <input
                            type="checkbox"
                            checked={formPerms.includes(p)}
                            onChange={() => togglePerm(p)}
                          />
                          {p.split(".")[1]}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: 0 }}>
                  {saving ? "Saving…" : editing ? "Update Role" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
