import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">Orbit</div>
        <Outlet />
      </div>
    </div>
  );
}
