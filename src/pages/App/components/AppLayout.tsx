import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
  LayoutDashboard, Package, FileText, PlusCircle, LogOut,
  Menu, X, ChevronRight, Users, History, Shield, Activity, Settings
} from 'lucide-react';

export default function AppLayout() {
  const { user, logout, isSuperAdmin, isAdminOrAbove } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => { await logout(); navigate('/app/login'); };

  // Role label for display
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Administrator';
      case 'employee': return 'Employee';
      default: return 'User';
    }
  };

  // Role badge color
  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case 'super_admin': return 'role-badge-super';
      case 'admin': return 'role-badge-admin';
      case 'employee': return 'role-badge-employee';
      default: return '';
    }
  };

  // ─── SUPER ADMIN NAV ───
  const superAdminNav = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/users', icon: Users, label: 'User Management' },
    { to: '/app/products', icon: Package, label: 'Products' },
    { to: '/app/invoices', icon: History, label: 'All Invoices' },
    { to: '/app/invoices/create', icon: PlusCircle, label: 'New Invoice' },
    { to: '/app/audit', icon: Activity, label: 'Audit Logs' },
    { to: '/app/audit/logins', icon: Shield, label: 'Login Activity' },
  ];

  // ─── ADMIN NAV ───
  const adminNav = [
    { to: '/app/users', icon: Users, label: 'User Management' },
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/products', icon: Package, label: 'Products' },
    { to: '/app/invoices', icon: History, label: 'All Invoices' },
    { to: '/app/invoices/create', icon: PlusCircle, label: 'New Invoice' },
    { to: '/app/audit', icon: Activity, label: 'Activity Log' },
  ];

  // ─── EMPLOYEE NAV ───
  const employeeNav = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/invoices/create', icon: PlusCircle, label: 'New Invoice' },
    { to: '/app/invoices', icon: History, label: 'My Invoices' },
  ];

  const nav = isSuperAdmin ? superAdminNav : isAdminOrAbove ? adminNav : employeeNav;

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <img src="/favicon.png" alt="MR Traders" className="sidebar-logo" />
          {sidebarOpen && (
            <div className="sidebar-brand">
              <span className="sidebar-brand-name">MR Traders</span>
              <span className="sidebar-brand-sub">Business Portal</span>
            </div>
          )}
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={20} className="sidebar-icon" />
              {sidebarOpen && <span>{label}</span>}
              {sidebarOpen && <ChevronRight size={14} className="sidebar-chevron" />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            {sidebarOpen && (
              <div className="sidebar-user-info">
                <p className="sidebar-user-name">{user?.name}</p>
                <div className="sidebar-user-meta">
                  <span className={`sidebar-role-badge ${getRoleBadgeClass(user?.role)}`}>
                    {getRoleLabel(user?.role)}
                  </span>
                  {user?.employee_id && (
                    <span className="sidebar-emp-id">{user.employee_id}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
