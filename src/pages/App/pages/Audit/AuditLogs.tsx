import { useState, useEffect, useCallback } from 'react';
import client from '../../api/client';
import { Activity, Search, Filter } from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 50 };
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      if (from) params.from = from;
      if (to) params.to = to;
      const r = await client.get('/audit/logs', { params });
      setLogs(r.data.data);
      setTotal(r.data.total);
      setActionTypes(r.data.actionTypes || []);
    } catch { /* handled by interceptor */ }
    setLoading(false);
  }, [search, actionFilter, from, to, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const getActionColor = (action: string) => {
    if (action.includes('CREATE') || action === 'LOGIN_SUCCESS') return 'action-green';
    if (action.includes('UPDATE') || action.includes('CHANGE') || action === 'MODIFIED') return 'action-blue';
    if (action.includes('DELETE') || action.includes('DEACTIVATE') || action === 'UNAUTHORIZED_ACCESS') return 'action-red';
    if (action.includes('DOWNLOAD') || action === 'PDF_DOWNLOAD') return 'action-purple';
    return 'action-gray';
  };

  const formatTime = (d: string) => new Date(d + 'Z').toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const parseDetails = (d: string) => { try { return JSON.parse(d); } catch { return null; } };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title"><Activity size={24} /> Audit Logs</h1>
          <p className="page-subtitle">System activity timeline — {total} total events</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={16} />
          <input type="text" placeholder="Search by user, ID, or details..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}>
          <option value="">All Actions</option>
          {actionTypes.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
        </select>
        <input type="date" value={from} onChange={e => { setFrom(e.target.value); setPage(1); }} title="From date" />
        <input type="date" value={to} onChange={e => { setTo(e.target.value); setPage(1); }} title="To date" />
      </div>

      {/* Activity Timeline */}
      <div className="audit-timeline">
        {loading ? (
          <div className="table-loading">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="table-empty">No audit logs found.</div>
        ) : logs.map(log => {
          const details = parseDetails(log.details);
          const oldVals = parseDetails(log.old_values);
          const newVals = parseDetails(log.new_values);
          return (
            <div key={log.id} className="audit-entry">
              <div className="audit-entry-header">
                <span className={`audit-action-badge ${getActionColor(log.action)}`}>
                  {log.action.replace(/_/g, ' ')}
                </span>
                <span className="audit-time">{formatTime(log.created_at)}</span>
              </div>
              <div className="audit-entry-body">
                <div className="audit-user">
                  <strong>{log.user_name || 'System'}</strong>
                  {log.employee_id && <span className="audit-emp-id">[{log.employee_id}]</span>}
                </div>
                {log.module && <span className="audit-module">{log.module}</span>}
                {details && (
                  <div className="audit-details">
                    {Object.entries(details).map(([k, v]) => (
                      <span key={k} className="audit-detail-item">
                        <span className="audit-detail-key">{k.replace(/_/g, ' ')}:</span> {String(v)}
                      </span>
                    ))}
                  </div>
                )}
                {oldVals && newVals && (
                  <div className="audit-changes">
                    {Object.keys(newVals).map(k => {
                      const ov = (oldVals as any)[k];
                      const nv = (newVals as any)[k];
                      if (ov === nv) return null;
                      return (
                        <div key={k} className="audit-change-row">
                          <span className="change-field">{k.replace(/_/g, ' ')}:</span>
                          <span className="change-old">{String(ov ?? '—')}</span>
                          <span className="change-arrow">→</span>
                          <span className="change-new">{String(nv ?? '—')}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
