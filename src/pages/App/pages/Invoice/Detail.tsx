import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../api/client';
import InvoiceTemplate from '../../pdf/InvoiceTemplate';
import { downloadInvoicePDF } from '../../utils/downloadPDF';
import { Download, ArrowLeft, CheckCircle, Edit, History } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function fmt(n: number) { return `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`; }
function fmtDate(d: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdminOrAbove } = useAuth();

  // ── All hooks must be BEFORE any early returns ──
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [revisions, setRevisions] = useState<any[]>([]);

  useEffect(() => {
    client.get(`/invoices/${id}`)
      .then(r => setInvoice(r.data.data))
      .catch(() => setInvoice(null))
      .finally(() => setLoading(false));
  }, [id]);

  const markPaid = async () => {
    await client.patch(`/invoices/${id}/status`, { status: 'paid' });
    setInvoice((v: any) => ({ ...v, status: 'paid' }));
  };

  // Fetch revision history
  useEffect(() => {
    if (invoice?.revision_count > 0) {
      client.get(`/audit/invoice/${id}/revisions`).then(r => setRevisions(r.data.data)).catch(() => {});
    }
  }, [id, invoice?.revision_count]);

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setPdfError('');
    setPdfLoading(true);
    try {
      await downloadInvoicePDF(invoice.id, invoice.invoice_number);
    } catch (e: any) {
      console.error('PDF error:', e);
      setPdfError('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // ── Early returns AFTER all hooks ──
  if (loading) return <div className="page-loader"><div className="app-spinner" /></div>;
  if (!invoice) return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate('/app/invoices')}>
        <ArrowLeft size={16} /> All Invoices
      </button>
      <p style={{ marginTop: 24, color: 'var(--text-muted)' }}>Invoice not found.</p>
    </div>
  );

  const c = invoice.customer_snapshot || {};
  const statusColors: Record<string, string> = {
    generated: 'status-blue',
    paid: 'status-green',
    cancelled: 'status-red',
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/app/invoices')}>
            <ArrowLeft size={16} /> All Invoices
          </button>
          <h1 className="page-title">{invoice.invoice_number}</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            <span className={`status-badge ${statusColors[invoice.status] || ''}`}>
              {invoice.status}
            </span>
            <span className="text-muted">
              {fmtDate(invoice.invoice_date)} · by {invoice.created_by_name}
              {invoice.updated_by_name && ` · Last edited by ${invoice.updated_by_name}`}
            </span>
            {invoice.revision_count > 0 && (
              <span className="badge badge-small badge-orange" style={{ marginLeft: 8 }}>R{invoice.revision_count}</span>
            )}
          </div>
        </div>
        <div className="action-btns" style={{ display: 'flex', gap: 8 }}>
          {invoice.status !== 'cancelled' && invoice.status !== 'finalized' && (
            <button className="btn btn-secondary" onClick={() => navigate(`/app/invoices/${id}/edit`)}>
              <Edit size={16} /> Edit
            </button>
          )}
          {isAdminOrAbove && invoice.status === 'generated' && (
            <button className="btn-secondary" onClick={markPaid}>
              <CheckCircle size={16} /> Mark Paid
            </button>
          )}
          <button className="btn-primary" disabled={pdfLoading} onClick={handleDownloadPDF}>
            <Download size={16} />
            {pdfLoading ? 'Generating PDF...' : `Download ${invoice.invoice_number}.pdf`}
          </button>
        </div>
      </div>

      {pdfError && (
        <div className="form-error" style={{ marginBottom: 16 }}>{pdfError}</div>
      )}

      {/* Customer + Invoice Info Grid */}
      <div className="invoice-detail-grid">
        <div className="detail-card">
          <h3 className="detail-card-title">Customer Details</h3>
          <p className="detail-name">{c.name}</p>
          {c.company && <p className="text-muted">{c.company}</p>}
          {c.phone && <p className="text-muted">📞 {c.phone}</p>}
          {c.email && <p className="text-muted">✉ {c.email}</p>}
          {c.billing_address && <p className="text-muted">📍 {c.billing_address}</p>}
          {c.city && <p className="text-muted">🏙 {c.city}, {c.state}</p>}
          {c.gstin && <p className="text-muted">GSTIN: {c.gstin}</p>}
        </div>

        <div className="detail-card">
          <h3 className="detail-card-title">Invoice Summary</h3>
          <div className="summary-row"><span>Invoice No.</span><span>{invoice.invoice_number}</span></div>
          <div className="summary-row"><span>Date</span><span>{fmtDate(invoice.invoice_date)}</span></div>
          <div className="summary-row"><span>Sub Total</span><span>{fmt(invoice.subtotal)}</span></div>
          {invoice.discount_amount > 0 && (
            <div className="summary-row discount"><span>Discount</span><span>- {fmt(invoice.discount_amount)}</span></div>
          )}
          {invoice.transport_hamali > 0 && (
            <div className="summary-row"><span>Transport / Hamali</span><span>{fmt(invoice.transport_hamali)}</span></div>
          )}
          <div className="summary-row">
            <span>GST ({invoice.gst_percentage ?? 18}%)</span>
            <span>{fmt(invoice.gst_amount)}</span>
          </div>
          <div className="summary-row grand">
            <span>Grand Total</span>
            <span>{fmt(invoice.grand_total)}</span>
          </div>
          <p className="amount-words">{invoice.amount_in_words}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="table-card">
        <h3 className="detail-card-title" style={{ padding: '14px 18px 0' }}>Line Items</h3>
        <table className="app-table invoice-table">
          <thead>
            <tr>
              <th>SR</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Unit</th>
              <th className="text-right">Rate</th>
              <th className="text-right">QTY</th>
              <th className="text-right">Disc %</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item: any, idx: number) => (
              <tr key={item.id || idx}>
                <td className="text-muted">{idx + 1}</td>
                <td className="font-medium">{item.product_name}</td>
                <td className="text-muted">{item.product_sku}</td>
                <td className="text-muted">{item.unit}</td>
                <td className="text-right">₹{Number(item.unit_price).toLocaleString('en-IN')}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">{item.discount_percent > 0 ? `${item.discount_percent}%` : '-'}</td>
                <td className="text-right font-medium">{fmt(item.line_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoice.notes && (
        <div className="detail-card" style={{ marginTop: 16 }}>
          <h3 className="detail-card-title">Notes</h3>
          <p className="text-muted">{invoice.notes}</p>
        </div>
      )}

      {/* Revision History */}
      {revisions.length > 0 && (
        <div className="detail-card" style={{ marginTop: 16 }}>
          <h3 className="detail-card-title"><History size={16} style={{ marginRight: 6 }} /> Revision History</h3>
          <div className="revision-timeline">
            {revisions.map((r: any) => (
              <div key={r.id} className="revision-entry">
                <div className="revision-header">
                  <span className="badge badge-small badge-orange">R{r.revision_number}</span>
                  <span className="font-semibold">{r.change_type.replace(/_/g, ' ')}</span>
                  <span className="text-muted">by {r.changed_by_name}</span>
                  <span className="text-muted">{new Date(r.created_at + 'Z').toLocaleString('en-IN')}</span>
                </div>
                {r.field_name && (
                  <div className="revision-detail">
                    <span className="change-field">{r.field_name}:</span>
                    {r.old_value && <span className="change-old">{r.old_value}</span>}
                    {r.old_value && r.new_value && <span className="change-arrow">→</span>}
                    {r.new_value && <span className="change-new">{r.new_value}</span>}
                  </div>
                )}
                {r.reason && <div className="revision-reason">Reason: {r.reason}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
