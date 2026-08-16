import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import {
  LayoutDashboard, Users, Package, FileText, IndianRupee,
  TrendingUp, Shield, AlertTriangle, Clock, PlusCircle
} from 'lucide-react';

function fmtCurrency(n: number) {
  const val = Number(n || 0);
  return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: val % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: string) {
  return d ? new Date(d + 'Z').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}

export default function Dashboard() {
  const { user, isSuperAdmin, isAdminOrAbove } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/dashboard/summary').then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="app-loading"><div className="app-spinner" /></div>;
  if (!data) return <div className="page-container"><p>Failed to load dashboard.</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><LayoutDashboard size={24} /> Dashboard</h1>
          <p className="page-subtitle">Welcome, {user?.name} • {user?.employee_id}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/invoices/create')}>
          <PlusCircle size={16} /> New Invoice
        </button>
      </div>

      {/* ─── SUPER ADMIN DASHBOARD ─── */}
      {data.role === 'super_admin' && <SuperAdminDashboard data={data} navigate={navigate} />}

      {/* ─── ADMIN DASHBOARD ─── */}
      {data.role === 'admin' && <AdminDashboard data={data} navigate={navigate} />}

      {/* ─── EMPLOYEE DASHBOARD ─── */}
      {data.role === 'employee' && <EmployeeDashboard data={data} navigate={navigate} />}
    </div>
  );
}

function SuperAdminDashboard({ data, navigate }: { data: any; navigate: any }) {
  return (
    <>
      {/* User Stats */}
      <div className="dashboard-section">
        <h2 className="section-title"><Users size={18} /> System Users</h2>
        <div className="stats-grid stats-grid-5">
          <div className="stat-card" onClick={() => navigate('/app/users?role=super_admin')}><div className="stat-value">{data.userStats.totalSuperAdmins}</div><div className="stat-label">Super Admins</div></div>
          <div className="stat-card" onClick={() => navigate('/app/users?role=admin')}><div className="stat-value">{data.userStats.totalAdmins}</div><div className="stat-label">Admins</div></div>
          <div className="stat-card" onClick={() => navigate('/app/users?role=employee')}><div className="stat-value">{data.userStats.totalEmployees}</div><div className="stat-label">Employees</div></div>
          <div className="stat-card stat-card-green"><div className="stat-value">{data.userStats.activeUsers}</div><div className="stat-label">Active</div></div>
          <div className="stat-card stat-card-red"><div className="stat-value">{data.userStats.inactiveUsers}</div><div className="stat-label">Inactive</div></div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="dashboard-section">
        <h2 className="section-title"><IndianRupee size={18} /> Revenue Overview</h2>
        <div className="stats-grid stats-grid-4">
          <div className="stat-card stat-card-big"><div className="stat-value">{fmtCurrency(data.invoiceStats.totalRevenue)}</div><div className="stat-label">Total Revenue</div></div>
          <div className="stat-card stat-card-green"><div className="stat-value">{fmtCurrency(data.invoiceStats.monthInvoices?.total || 0)}</div><div className="stat-label">This Month ({data.invoiceStats.monthInvoices?.cnt || 0} invoices)</div></div>
          <div className="stat-card"><div className="stat-value">{fmtCurrency(data.invoiceStats.todayInvoices?.total || 0)}</div><div className="stat-label">Today ({data.invoiceStats.todayInvoices?.cnt || 0} invoices)</div></div>
          <div className="stat-card"><div className="stat-value">{data.invoiceStats.totalInvoices}</div><div className="stat-label">Total Invoices</div></div>
        </div>
      </div>

      {/* Security */}
      <div className="dashboard-section">
        <h2 className="section-title"><Shield size={18} /> Security Summary</h2>
        <div className="stats-grid stats-grid-2">
          <div className={`stat-card ${data.securitySummary.unauthorizedAttempts > 0 ? 'stat-card-red' : 'stat-card-green'}`}>
            <div className="stat-value">{data.securitySummary.unauthorizedAttempts}</div>
            <div className="stat-label">Unauthorized Access Attempts</div>
          </div>
          <div className={`stat-card ${data.securitySummary.todayFailedLogins > 0 ? 'stat-card-red' : 'stat-card-green'}`}>
            <div className="stat-value">{data.securitySummary.todayFailedLogins}</div>
            <div className="stat-label">Today's Failed Login Attempts</div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="dashboard-grid-2">
        {/* Recent Invoices */}
        <div className="dashboard-section">
          <h2 className="section-title"><FileText size={18} /> Recent Invoices</h2>
          <div className="dashboard-list">
            {data.invoiceStats.recentInvoices?.map((inv: any) => (
              <div key={inv.id} className="dashboard-list-item" onClick={() => navigate(`/app/invoices/${inv.id}`)}>
                <div><strong>{inv.invoice_number}</strong><br /><small>{inv.customer_name}</small></div>
                <div className="text-right"><strong>{fmtCurrency(inv.grand_total)}</strong><br /><small>{inv.created_by_name}{inv.created_by_emp_id ? ` [${inv.created_by_emp_id}]` : ''}</small></div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Activity */}
        <div className="dashboard-section">
          <h2 className="section-title"><TrendingUp size={18} /> Employee Performance</h2>
          <div className="dashboard-list">
            {data.employeeActivity?.map((emp: any) => (
              <div key={emp.id} className="dashboard-list-item">
                <div><strong>{emp.name}</strong>{emp.employee_id ? <span className="text-muted"> [{emp.employee_id}]</span> : null}</div>
                <div className="text-right"><strong>{emp.invoice_count} invoices</strong><br /><small>{fmtCurrency(emp.invoice_total)}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2 className="section-title"><Clock size={18} /> Recent System Activity</h2>
        <div className="dashboard-list">
          {data.recentActivity?.slice(0, 10).map((a: any, i: number) => (
            <div key={i} className="dashboard-list-item">
              <div>
                <span className="badge badge-small">{a.action.replace(/_/g, ' ')}</span>
                <strong> {a.user_name || 'System'}</strong>{a.employee_id ? <span className="text-muted"> [{a.employee_id}]</span> : null}
                {a.module && <span className="text-muted"> • {a.module}</span>}
              </div>
              <div className="text-muted">{fmtDate(a.created_at)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminDashboard({ data, navigate }: { data: any; navigate: any }) {
  return (
    <>
      <div className="stats-grid stats-grid-4">
        <div className="stat-card stat-card-big"><div className="stat-value">{fmtCurrency(data.totalRevenue)}</div><div className="stat-label">Total Revenue</div></div>
        <div className="stat-card stat-card-green"><div className="stat-value">{fmtCurrency(data.monthInvoices?.total || 0)}</div><div className="stat-label">This Month ({data.monthInvoices?.cnt || 0} invoices)</div></div>
        <div className="stat-card"><div className="stat-value">{data.totalInvoices}</div><div className="stat-label">Total Invoices</div></div>
        <div className="stat-card"><div className="stat-value">{data.activeProducts}</div><div className="stat-label">Active Products</div></div>
      </div>

      <div className="dashboard-grid-2">
        <div className="dashboard-section">
          <h2 className="section-title"><FileText size={18} /> Recent Invoices</h2>
          <div className="dashboard-list">
            {data.recentInvoices?.map((inv: any) => (
              <div key={inv.id} className="dashboard-list-item" onClick={() => navigate(`/app/invoices/${inv.id}`)}>
                <div><strong>{inv.invoice_number}</strong><br /><small>{inv.customer_name}</small></div>
                <div className="text-right"><strong>{fmtCurrency(inv.grand_total)}</strong><br /><small>{fmtDate(inv.invoice_date)}</small></div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title"><Package size={18} /> Recent Products</h2>
          <div className="dashboard-list">
            {data.recentProducts?.map((p: any) => (
              <div key={p.id} className="dashboard-list-item">
                <div><strong>{p.name}</strong><br /><small>{p.sku}</small></div>
                <div className="text-right"><strong>{fmtCurrency(p.selling_price)}</strong></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function EmployeeDashboard({ data, navigate }: { data: any; navigate: any }) {
  return (
    <>
      <div className="stats-grid stats-grid-3">
        <div className="stat-card"><div className="stat-value">{data.todayInvoices?.cnt || 0}</div><div className="stat-label">Today's Invoices ({fmtCurrency(data.todayInvoices?.total || 0)})</div></div>
        <div className="stat-card stat-card-green"><div className="stat-value">{data.monthInvoices?.cnt || 0}</div><div className="stat-label">This Month ({fmtCurrency(data.monthInvoices?.total || 0)})</div></div>
        <div className="stat-card"><div className="stat-value">{data.totalInvoices?.cnt || 0}</div><div className="stat-label">My Total Invoices ({fmtCurrency(data.totalInvoices?.total || 0)})</div></div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title"><FileText size={18} /> My Recent Invoices</h2>
        <div className="dashboard-list">
          {data.recentInvoices?.length === 0 ? (
            <div className="dashboard-empty">No invoices yet. Create your first invoice!</div>
          ) : data.recentInvoices?.map((inv: any) => (
            <div key={inv.id} className="dashboard-list-item" onClick={() => navigate(`/app/invoices/${inv.id}`)}>
              <div><strong>{inv.invoice_number}</strong><br /><small>{inv.customer_name}</small></div>
              <div className="text-right">
                <strong>{fmtCurrency(inv.grand_total)}</strong><br />
                <small>{fmtDate(inv.invoice_date)}</small>
                <span className={`status-dot status-${inv.status}`} style={{ marginLeft: '0.5rem' }}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
