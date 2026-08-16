import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import { downloadInvoicePDF } from '../../utils/downloadPDF';
import { ArrowLeft, Search, Trash2, Save, Download } from 'lucide-react';

function fmtCurrency(n: number) {
  return `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

interface CartItem {
  product_id: number; product_name: string; product_sku: string;
  unit: string; unit_price: number; quantity: number; discount_percent: number;
  line_amount: number;
}

export default function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [transportHamali, setTransportHamali] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [revisionCount, setRevisionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [invRes, prodRes] = await Promise.all([
          client.get(`/invoices/${id}`),
          client.get('/products', { params: { status: 'active', limit: 300 } }),
        ]);
        const inv = invRes.data.data;
        setProducts(prodRes.data.data);
        setCustomer(inv.customer_snapshot);
        setInvoiceNumber(inv.invoice_number);
        setRevisionCount(inv.revision_count);
        setInvoiceDiscount(inv.discount_amount || 0);
        setTransportHamali(inv.transport_hamali || 0);
        setGstPercentage(inv.gst_percentage || 18);
        setNotes(inv.notes || '');
        setCart(inv.items.map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_sku: item.product_sku,
          unit: item.unit,
          unit_price: item.unit_price,
          quantity: item.quantity,
          discount_percent: item.discount_percent,
          line_amount: item.line_amount,
        })));
      } catch {
        navigate('/app/invoices');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const filteredProducts = products.filter(p =>
    productSearch &&
    (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
     p.sku?.toLowerCase().includes(productSearch.toLowerCase()))
  );

  function calcLine(item: Omit<CartItem, 'line_amount'>) {
    const gross = item.unit_price * item.quantity;
    const disc = gross * (item.discount_percent / 100);
    return { line_amount: +(gross - disc).toFixed(2) };
  }

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        return prev.map(i => i.product_id === product.id
          ? { ...i, quantity: i.quantity + 1, ...calcLine({ ...i, quantity: i.quantity + 1 }) }
          : i);
      }
      const item: Omit<CartItem, 'line_amount'> = {
        product_id: product.id, product_name: product.name, product_sku: product.sku,
        unit: product.unit, unit_price: product.selling_price, quantity: 1, discount_percent: 0,
      };
      return [...prev, { ...item, ...calcLine(item) }];
    });
    setProductSearch('');
  };

  const updateCartItem = (idx: number, field: string, value: number) => {
    setCart(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      return { ...updated, ...calcLine(updated) };
    }));
  };

  const removeItem = (idx: number) => setCart(prev => prev.filter((_, i) => i !== idx));

  const subtotal = cart.reduce((s, i) => s + i.line_amount, 0);
  const discountedSubtotal = subtotal - invoiceDiscount;
  const gstAmt = discountedSubtotal * (gstPercentage / 100);
  const grandTotal = discountedSubtotal + gstAmt + transportHamali;

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await client.put(`/invoices/${id}`, {
        customer,
        items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, discount_percent: i.discount_percent })),
        invoice_discount: invoiceDiscount,
        transport_hamali: transportHamali,
        gst_percentage: gstPercentage,
        notes,
        reason,
      });
      setSaved(true);
      setTimeout(() => navigate(`/app/invoices/${id}`), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update invoice.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try { await downloadInvoicePDF(Number(id)); } catch { /* handled */ }
    setPdfLoading(false);
  };

  if (loading) return <div className="app-loading"><div className="app-spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate(`/app/invoices/${id}`)}><ArrowLeft size={16} /> Back to Invoice</button>
          <h1 className="page-title">Edit Invoice: {invoiceNumber}</h1>
          <p className="page-subtitle">Revision {revisionCount} • Invoice number will NOT change</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleDownloadPDF} disabled={pdfLoading}>
            <Download size={16} /> {pdfLoading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="success-banner">
          ✅ Invoice updated successfully! Redirecting...
        </div>
      )}
      {error && <div className="error-banner">{error}</div>}

      {/* Customer Section */}
      <div className="form-card">
        <h3>Customer Details</h3>
        <div className="form-grid">
          <div className="form-group"><label>Name *</label><input value={customer.name || ''} onChange={e => setCustomer((c: any) => ({ ...c, name: e.target.value }))} /></div>
          <div className="form-group"><label>Company</label><input value={customer.company || ''} onChange={e => setCustomer((c: any) => ({ ...c, company: e.target.value }))} /></div>
          <div className="form-group"><label>Phone</label><input value={customer.phone || ''} onChange={e => setCustomer((c: any) => ({ ...c, phone: e.target.value }))} /></div>
          <div className="form-group"><label>Email</label><input value={customer.email || ''} onChange={e => setCustomer((c: any) => ({ ...c, email: e.target.value }))} /></div>
          <div className="form-group form-group-full"><label>Billing Address</label><input value={customer.billing_address || ''} onChange={e => setCustomer((c: any) => ({ ...c, billing_address: e.target.value }))} /></div>
          <div className="form-group"><label>GSTIN</label><input value={customer.gstin || ''} onChange={e => setCustomer((c: any) => ({ ...c, gstin: e.target.value }))} /></div>
          <div className="form-group"><label>City</label><input value={customer.city || ''} onChange={e => setCustomer((c: any) => ({ ...c, city: e.target.value }))} /></div>
          <div className="form-group"><label>State</label><input value={customer.state || ''} onChange={e => setCustomer((c: any) => ({ ...c, state: e.target.value }))} /></div>
        </div>
      </div>

      {/* Product Search & Cart */}
      <div className="form-card">
        <h3>Items</h3>
        <div className="search-wrap" style={{ marginBottom: '1rem' }}>
          <Search size={16} />
          <input type="text" placeholder="Search products to add..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
        </div>
        {filteredProducts.length > 0 && (
          <div className="product-search-results">
            {filteredProducts.slice(0, 8).map(p => (
              <div key={p.id} className="product-search-item" onClick={() => addToCart(p)}>
                <span className="product-sku">{p.sku}</span>
                <span className="product-name">{p.name}</span>
                <span className="product-price">{fmtCurrency(p.selling_price)}/{p.unit}</span>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Product</th><th>Unit Price</th><th>Qty</th><th>Disc %</th><th>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td><strong>{item.product_name}</strong><br /><small className="text-muted">{item.product_sku}</small></td>
                    <td>{fmtCurrency(item.unit_price)}</td>
                    <td><input type="number" className="qty-input" min={0.01} step={0.01} value={item.quantity} onChange={e => updateCartItem(idx, 'quantity', parseFloat(e.target.value) || 0)} /></td>
                    <td><input type="number" className="qty-input" min={0} max={100} value={item.discount_percent} onChange={e => updateCartItem(idx, 'discount_percent', parseFloat(e.target.value) || 0)} /></td>
                    <td className="font-semibold">{fmtCurrency(item.line_amount)}</td>
                    <td><button className="btn-icon btn-icon-danger" onClick={() => removeItem(idx)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Totals & Save */}
      <div className="form-card">
        <div className="form-grid">
          <div className="form-group"><label>Invoice Discount (₹)</label><input type="number" min={0} value={invoiceDiscount} onChange={e => setInvoiceDiscount(parseFloat(e.target.value) || 0)} /></div>
          <div className="form-group"><label>Transport / Hamali (₹)</label><input type="number" min={0} value={transportHamali} onChange={e => setTransportHamali(parseFloat(e.target.value) || 0)} /></div>
          <div className="form-group"><label>GST %</label><input type="number" min={0} max={100} value={gstPercentage} onChange={e => setGstPercentage(parseFloat(e.target.value) || 0)} /></div>
          <div className="form-group form-group-full"><label>Notes</label><textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} /></div>
          <div className="form-group form-group-full">
            <label>Reason for edit (optional)</label>
            <input type="text" placeholder="e.g. Customer requested quantity change" value={reason} onChange={e => setReason(e.target.value)} />
          </div>
        </div>

        <div className="invoice-totals">
          <div className="total-row"><span>Subtotal</span><span>{fmtCurrency(subtotal)}</span></div>
          {invoiceDiscount > 0 && <div className="total-row"><span>Discount</span><span>-{fmtCurrency(invoiceDiscount)}</span></div>}
          {transportHamali > 0 && <div className="total-row"><span>Transport / Hamali</span><span>+{fmtCurrency(transportHamali)}</span></div>}
          <div className="total-row"><span>GST ({gstPercentage}%)</span><span>{fmtCurrency(gstAmt)}</span></div>
          <div className="total-row total-grand"><span>Grand Total</span><span>{fmtCurrency(grandTotal)}</span></div>
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={() => navigate(`/app/invoices/${id}`)}>Cancel</button>
          <button className="btn btn-primary" disabled={saving || cart.length === 0} onClick={handleSave}>
            <Save size={16} /> {saving ? 'Saving...' : `Save Changes (Revision ${revisionCount + 1})`}
          </button>
        </div>
      </div>
    </div>
  );
}
