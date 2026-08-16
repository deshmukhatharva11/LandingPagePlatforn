import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/index';
import ProductForm from './pages/Products/ProductForm';
import CreateInvoice from './pages/Invoice/Create';
import InvoiceHistory from './pages/Invoice/History';
import InvoiceDetail from './pages/Invoice/Detail';
import UserList from './pages/Users/UserList';
import UserForm from './pages/Users/UserForm';
import AuditLogs from './pages/Audit/AuditLogs';
import LoginActivity from './pages/Audit/LoginActivity';
import EditInvoice from './pages/Invoice/Edit';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app-loading"><div className="app-spinner" /></div>;
  if (!user) return <Navigate to="/app/login" replace />;

  // Role-based protection: if roles specified, user must have one
  if (roles && !roles.includes(user.role)) {
    // Redirect to appropriate default page based on role
    const defaultPath = getDefaultPath(user.role);
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
}

function getDefaultPath(role: string) {
  switch (role) {
    case 'super_admin': return '/app/dashboard';
    case 'admin': return '/app/dashboard';
    case 'employee': return '/app/invoices/create';
    default: return '/app/login';
  }
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="login" element={user ? <Navigate to={getDefaultPath(user.role)} replace /> : <Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Default redirect based on role */}
        <Route index element={<Navigate to={user ? getDefaultPath(user.role).replace('/app/', '') : 'login'} replace />} />

        {/* Dashboard — all roles, content differs by role */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Products — visible to all, admin+ can edit */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProtectedRoute roles={['super_admin', 'admin']}><ProductForm /></ProtectedRoute>} />
        <Route path="products/:id/edit" element={<ProtectedRoute roles={['super_admin', 'admin']}><ProductForm /></ProtectedRoute>} />

        {/* Invoices — all roles */}
        <Route path="invoices/create" element={<CreateInvoice />} />
        <Route path="invoices" element={<InvoiceHistory />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="invoices/:id/edit" element={<EditInvoice />} />

        {/* Users — Super Admin only */}
        <Route path="users" element={<ProtectedRoute roles={['super_admin', 'admin']}><UserList /></ProtectedRoute>} />
        <Route path="users/new" element={<ProtectedRoute roles={['super_admin', 'admin']}><UserForm /></ProtectedRoute>} />
        <Route path="users/:id" element={<ProtectedRoute roles={['super_admin', 'admin']}><UserForm /></ProtectedRoute>} />

        {/* Audit — Super Admin full, Admin limited */}
        <Route path="audit" element={<ProtectedRoute roles={['super_admin', 'admin']}><AuditLogs /></ProtectedRoute>} />
        <Route path="audit/logins" element={<ProtectedRoute roles={['super_admin']}><LoginActivity /></ProtectedRoute>} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to={user ? getDefaultPath(user.role).replace('/app/', '') : 'login'} replace />} />
      </Route>
    </Routes>
  );
}

export default function AppShell() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
