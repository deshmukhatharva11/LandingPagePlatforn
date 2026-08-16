import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { Users, Plus, Search, Shield, UserCheck, UserX, RotateCcw } from 'lucide-react';

interface User {
  id: number; employee_id: string; name: string; email: string; role: string;
  mobile: string; department: string; is_active: number; last_login: string;
  created_at: string; created_by_name: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [roleCounts, setRoleCounts] = useState<any>({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      const r = await client.get('/users', { params });
      setUsers(r.data.data);
      setTotal(r.data.total);
      setRoleCounts(r.data.roleCounts || {});
    } catch { /* handled by interceptor */ }
    setLoading(false);
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleStatus = async (userId: number, currentActive: number) => {
    if (!confirm(`${currentActive ? 'Deactivate' : 'Activate'} this user?`)) return;
    await client.patch(`/users/${userId}/status`, { is_active: !currentActive });
    fetchUsers();
  };

  const resetPassword = async (userId: number, name: string) => {
    const newPwd = prompt(`Enter new password for ${name} (min 8 chars):`);
    if (!newPwd || newPwd.length < 8) { if (newPwd) alert('Password must be at least 8 characters.'); return; }
    await client.post(`/users/${userId}/reset-password`, { new_password: newPwd });
    alert('Password reset successfully.');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin': return <span className="badge badge-super">Super Admin</span>;
      case 'admin': return <span className="badge badge-admin">Admin</span>;
      case 'employee': return <span className="badge badge-employee">Employee</span>;
      default: return <span className="badge">{role}</span>;
    }
  };

  const formatDate = (d: string) => d ? new Date(d + 'Z').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const formatDateTime = (d: string) => d ? new Date(d + 'Z').toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Users size={24} /> User Management</h1>
          <p className="page-subtitle">Manage admins and employees</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/app/users/new')}>
          <Plus size={16} /> Create User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid stats-grid-5">
        <div className="stat-card"><div className="stat-value">{roleCounts.super_admin || 0}</div><div className="stat-label">Super Admins</div></div>
        <div className="stat-card"><div className="stat-value">{roleCounts.admin || 0}</div><div className="stat-label">Admins</div></div>
        <div className="stat-card"><div className="stat-value">{roleCounts.employee || 0}</div><div className="stat-label">Employees</div></div>
        <div className="stat-card stat-card-green"><div className="stat-value">{roleCounts.active || 0}</div><div className="stat-label">Active</div></div>
        <div className="stat-card stat-card-red"><div className="stat-value">{roleCounts.inactive || 0}</div><div className="stat-label">Inactive</div></div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={16} />
          <input type="text" placeholder="Search by name, email, or ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="table-loading">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="table-empty">No users found.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className={!u.is_active ? 'row-inactive' : ''}>
                <td className="font-mono">{u.employee_id || '—'}</td>
                <td className="font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td>{getRoleBadge(u.role)}</td>
                <td>
                  <span className={`status-dot ${u.is_active ? 'status-active' : 'status-inactive'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{formatDate(u.created_at)}</td>
                <td>{formatDateTime(u.last_login)}</td>
                <td className="actions-cell">
                  <button className="btn-icon" title="Edit" onClick={() => navigate(`/app/users/${u.id}`)}>✏️</button>
                  {u.role !== 'super_admin' && (
                    <>
                      <button className="btn-icon" title={u.is_active ? 'Deactivate' : 'Activate'} onClick={() => toggleStatus(u.id, u.is_active)}>
                        {u.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button className="btn-icon" title="Reset Password" onClick={() => resetPassword(u.id, u.name)}>
                        <RotateCcw size={14} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span>Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
