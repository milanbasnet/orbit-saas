import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AuthLayout from "./components/layout/AuthLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./router/ProtectedRoute";
import GuestRoute from "./router/GuestRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProductListPage from "./pages/products/ProductListPage";
import CreateProductPage from "./pages/products/CreateProductPage";
import EditProductPage from "./pages/products/EditProductPage";
import CustomerListPage from "./pages/customers/CustomerListPage";
import CreateCustomerPage from "./pages/customers/CreateCustomerPage";
import EditCustomerPage from "./pages/customers/EditCustomerPage";
import OrderListPage from "./pages/orders/OrderListPage";
import CreateOrderPage from "./pages/orders/CreateOrderPage";
import EditOrderPage from "./pages/orders/EditOrderPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import RoleListPage from "./pages/roles/RoleListPage";
import UserListPage from "./pages/users/UserListPage";
import AuditLogPage from "./pages/audit/AuditLogPage";
import FilesPage    from "./pages/files/FilesPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Guest-only routes */}
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Products — /create must come before /:id/edit */}
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/create" element={<CreateProductPage />} />
              <Route path="/products/:id/edit" element={<EditProductPage />} />
              {/* Customers */}
              <Route path="/customers" element={<CustomerListPage />} />
              <Route path="/customers/create" element={<CreateCustomerPage />} />
              <Route path="/customers/:id/edit" element={<EditCustomerPage />} />
              {/* Orders — /create before /:id */}
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/orders/create" element={<CreateOrderPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/orders/:id/edit" element={<EditOrderPage />} />
              {/* Users & Roles */}
              <Route path="/users" element={<UserListPage />} />
              <Route path="/roles" element={<RoleListPage />} />
              <Route path="/audit-logs" element={<AuditLogPage />} />
              <Route path="/files"      element={<FilesPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}