import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout, hasAnyRole } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const navItems = [
    { to: "/dashboard", label: "Dashboard",  roles: null },
    { to: "/products",  label: "Products",   roles: null },
    { to: "/customers", label: "Customers",  roles: null },
    { to: "/orders",    label: "Orders",     roles: null },
    { to: "/users",      label: "Users",       roles: ["Admin", "Manager"] },
    { to: "/roles",      label: "Roles",       roles: ["Admin"] },
    { to: "/audit-logs", label: "Audit Log",   roles: ["Admin"] },
    { to: "/files",      label: "Files",       roles: null },
  ].filter(({ roles }) => !roles || hasAnyRole(...roles));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/dashboard">Orbit</Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="user-name">{user?.name}</span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </aside>
  );
}
