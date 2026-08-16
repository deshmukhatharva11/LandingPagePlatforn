import { useState, useEffect, useCallback } from 'react';
import client from '../../api/client';
import { Shield, Search } from 'lucide-react';

export default function LoginActivity() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>({});
  const [statusFilter, setStatusFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 50 };
      if (statusFilter) params.status = statusFilter;
      if (from) params.from = from;
      if (to) params.to = to;
      const r = await client.get('/audit/logins', { params });
      setLogs(r.data.data);
      setTotal(r.data.total);
      setStats(r.data.stats || {});
    } catch { /* handled */ }
    setLoading(false);
  }, [statusFilter, from, to, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatTime = (d: string) => new Date(d + 'Z').toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Shield size={24} /> Login Activity</h1>
          <p className="page-subtitle">Authentication history and security events</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid stats-grid-4">
        <div className="stat-card"><div className="stat-value">{stats.totalLogins || 0}</div><div className="stat-label">Total Logins</div></div>
        <div className="stat-card stat-card-green"><div className="stat-value">{stats.todayLogins || 0}</div><div className="stat-label">Today's Logins</div></div>
        <div className="stat-card stat-card-red"><div className="stat-value">{stats.failedAttempts || 0}</div><div className="stat-label">Failed Attempts</div></div>
        <div className="stat-card stat-card-red"><div className="stat-value">{stats.todayFailed || 0}</div><div className="stat-label">Today's Failures</div></div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
        <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} title="From date" />
        <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} title="To date" />
      </div>

      {/* Login Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Action</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>Failure Reason</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="table-loading">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={8} className="table-empty">No login activity found.</td></tr>
            ) : logs.map(l => (
              <tr key={l.id} className={l.status === 'failed' ? 'row-failed' : ''}>
                <td className="font-semibold">{l.user_name || '—'}</td>
                <td className="font-mono">{l.employee_id || '—'}</td>
                <td>{l.email || '—'}</td>
                <td>
                  <span className={`badge ${l.action === 'LOGIN_SUCCESS' ? 'badge-green' : l.action === 'LOGIN_FAILED' ? 'badge-red' : 'badge-gray'}`}>
                    {l.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <span className={`status-dot ${l.status === 'success' ? 'status-active' : 'status-inactive'}`}>
                    {l.status}
                  </span>
                </td>
                <td className="font-mono">{l.ip_address || '—'}</td>
                <td>{l.failure_reason || '—'}</td>
                <td>{formatTime(l.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 50 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
          <span>Page {page} of {Math.ceil(total / 50)}</span>
          <button disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
