import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { Search, Eye, Edit, Download } from 'lucide-react';
import { downloadInvoicePDF } from '../../utils/downloadPDF';

function fmt(n: number) { return `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`; }
function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }

export default function InvoiceHistory() {
  const { user, isAdminOrAbove } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    setLoading(true);
    const params: any = { search, page, limit: 20 };
    if (statusFilter) params.status = statusFilter;
    const r = await client.get('/invoices', { params });
    setInvoices(r.data.data);
    setTotal(r.data.total);
    setLoading(false);
  };

  useEffect(() => { fetchInvoices(); }, [search, statusFilter, page]);

  const statusColors: Record<string, string> = {
    draft: 'status-gray', generated: 'status-blue', modified: 'status-orange',
    finalized: 'status-green', cancelled: 'status-red',
  };

  const handleDownload = async (id: number) => {
    try { await downloadInvoicePDF(id); } catch { /* handled */ }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{user?.role === 'employee' ? 'My Invoices' : 'Invoice History'}</h1>
          <p className="page-subtitle">{total} invoices</p>
        </div>
        <Link to="/app/invoices/create" className="btn btn-primary">+ New Invoice</Link>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={16} />
          <input placeholder="Search by invoice no, customer, phone..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="generated">Generated</option>
          <option value="modified">Modified</option>
          <option value="finalized">Finalized</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-wrap">
        {loading ? <div className="table-loading">Loading...</div> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No</th><th>Customer</th><th>Phone</th>
                <th>Date</th><th className="text-right">Amount</th>
                <th>Status</th><th>Created By</th>
                {isAdminOrAbove && <th>Modified By</th>}
                <th>Rev</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td><Link to={`/app/invoices/${inv.id}`} className="table-link">{inv.invoice_number}</Link></td>
                  <td>{inv.customer_name}</td>
                  <td className="text-muted">{inv.customer_phone || '—'}</td>
                  <td>{fmtDate(inv.invoice_date)}</td>
                  <td className="text-right font-semibold">{fmt(inv.grand_total)}</td>
                  <td><span className={`status-badge ${statusColors[inv.status] || ''}`}>{inv.status}</span></td>
                  <td className="text-muted">{inv.created_by_name}{inv.created_by_emp_id ? ` [${inv.created_by_emp_id}]` : ''}</td>
                  {isAdminOrAbove && <td className="text-muted">{inv.updated_by_name || '—'}</td>}
                  <td className="text-center">{inv.revision_count > 0 ? <span className="badge badge-small badge-orange">R{inv.revision_count}</span> : '—'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" title="View" onClick={() => navigate(`/app/invoices/${inv.id}`)}><Eye size={14} /></button>
                      {inv.status !== 'cancelled' && inv.status !== 'finalized' && (
                        <button className="btn-icon" title="Edit" onClick={() => navigate(`/app/invoices/${inv.id}/edit`)}><Edit size={14} /></button>
                      )}
                      <button className="btn-icon" title="Download PDF" onClick={() => handleDownload(inv.id)}><Download size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!invoices.length && <tr><td colSpan={isAdminOrAbove ? 10 : 9} className="table-empty">No invoices found</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {total > 20 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
