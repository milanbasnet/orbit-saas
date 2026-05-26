import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ErrorBoundary from "../ui/ErrorBoundary";

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        {/*
          key={location.pathname} resets the boundary whenever the user navigates,
          so a crash on one page doesn't permanently trap the UI.
        */}
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
