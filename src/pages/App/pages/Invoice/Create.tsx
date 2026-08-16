import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import InvoiceTemplate from '../../pdf/InvoiceTemplate';
import { downloadInvoicePDF } from '../../utils/downloadPDF';
import { Search, Trash2, CheckCircle, Download, User, Package, IndianRupee } from 'lucide-react';

function fmtCurrency(n: number) {
  return `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

interface CartItem {
  product_id: number; product_name: string; product_sku: string;
  unit: string; unit_price: number; quantity: number; discount_percent: number;
  line_amount: number;
}
const emptyCustomer = {
  name: '', company: '', phone: '', email: '',
  billing_address: '', gstin: '', city: '', state: 'Maharashtra', pincode: '',
};

function toWords(amount: number): string {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function conv(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + conv(n % 100) : '');
    if (n < 100000) return conv(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + conv(n % 1000) : '');
    if (n < 10000000) return conv(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + conv(n % 100000) : '');
    return conv(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + conv(n % 10000000) : '');
  }
  const r = Math.floor(amount);
  return 'Rupees ' + (r > 0 ? conv(r) : 'Zero') + ' Only';
}

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'customer' | 'products'>('customer');
  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [transportHamali, setTransportHamali] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saved, setSaved] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/products', { params: { status: 'active', limit: 300 } })
      .then(r => setProducts(r.data.data));
  }, []);

  const filteredProducts = products.filter(p =>
    !productSearch ||
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku?.toLowerCase().includes(productSearch.toLowerCase())
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

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const r = await client.post('/invoices', {
        customer,
        items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, discount_percent: i.discount_percent })),
        invoice_discount: invoiceDiscount,
        transport_hamali: transportHamali,
        gst_percentage: gstPercentage,
        notes,
      });
      const inv = await client.get(`/invoices/${r.data.id}`);
      setSaved(inv.data.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate invoice.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!saved) return;
    setPdfLoading(true);
    try {
      await downloadInvoicePDF(saved.id, saved.invoice_number);
    } catch (e) {
      console.error('PDF error:', e);
      setError('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // SUCCESS STATE
  if (saved) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Invoice Generated ✓</h1>
        </div>
        <div className="success-card">
          <CheckCircle size={56} className="success-icon" />
          <h2>Invoice Created Successfully!</h2>
          <p className="success-inv-num">{saved.invoice_number}</p>
          <p className="success-amount">{fmtCurrency(saved.grand_total)}</p>
          <p className="success-customer">for {saved.customer_snapshot?.name}</p>
          <p className="success-words">{saved.amount_in_words}</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={handleDownloadPDF} disabled={pdfLoading}>
              <Download size={18} />
              {pdfLoading ? 'Preparing PDF...' : `Download ${saved.invoice_number}.pdf`}
            </button>
            <button className="btn-secondary" onClick={() => navigate(`/app/invoices/${saved.id}`)}>View Invoice</button>
            <button className="btn-ghost" onClick={() => { setCart([]); setCustomer({ ...emptyCustomer }); setSaved(null); setStep('customer'); }}>
              + New Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Create Invoice</h1>
      </div>

      {/* Step Tabs */}
      <div className="step-tabs">
        <button className={`step-tab ${step === 'customer' ? 'active' : ''}`}
          onClick={() => setStep('customer')}>
          <User size={15} /> Customer Details
        </button>
        <button className={`step-tab ${step === 'products' ? 'active' : ''}`}
          onClick={() => { if (!customer.name) { setError('Enter customer name first.'); return; } setError(''); setStep('products'); }}>
          <Package size={15} /> Add Products
        </button>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* ── STEP 1: Customer ── */}
      {step === 'customer' && (
        <div className="form-card">
          <h2 className="form-section-title">Customer Information</h2>
          <div className="form-grid-2">
            {([
              ['name',            'Client Name *',         false, true ],
              ['company',         'Company Name',          false, false],
              ['phone',           'Mobile No.',            false, false],
              ['email',           'Email ID',              false, false],
              ['billing_address', 'Address',               true,  false],
              ['gstin',           'GSTIN (if applicable)', false, false],
              ['city',            'City',                  false, false],
              ['pincode',         'Pincode',               false, false],
            ] as [string, string, boolean, boolean][]).map(([field, label, isArea, required]) => (
              <div key={field} className={`form-group ${isArea ? 'col-span-2' : ''}`}>
                <label className="form-label">{label}</label>
                {isArea
                  ? <textarea className="form-input" rows={2} value={(customer as any)[field]}
                      onChange={e => setCustomer(c => ({ ...c, [field]: e.target.value }))} />
                  : <input className="form-input" required={required} value={(customer as any)[field]}
                      onChange={e => setCustomer(c => ({ ...c, [field]: e.target.value }))} />
                }
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={() => {
              if (!customer.name.trim()) { setError('Client name is required.'); return; }
              setError(''); setStep('products');
            }}>
              Next: Add Products →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Products ── */}
      {step === 'products' && (
        <div className="invoice-builder">
          {/* Product search */}
          <div className="form-card" style={{ marginBottom: 16 }}>
            <h2 className="form-section-title">Search & Add Products</h2>
            <div className="search-wrap" style={{ marginBottom: productSearch ? 0 : 0 }}>
              <Search size={16} className="search-icon" />
              <input className="search-input" placeholder="Search by name or SKU (e.g. Kitchen, Wardrobe, KT-001)..."
                value={productSearch} onChange={e => setProductSearch(e.target.value)} autoFocus />
            </div>
            {productSearch && (
              <div className="product-dropdown">
                {filteredProducts.slice(0, 12).map(p => (
                  <button key={p.id} className="product-option" onClick={() => addToCart(p)}>
                    <div>
                      <span className="product-opt-name">{p.name}</span>
                      <span className="product-opt-sku"> · {p.sku}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="product-opt-price">₹{Number(p.selling_price).toLocaleString('en-IN')}</span>
                      <span className="product-opt-gst"> / {p.unit}</span>
                    </div>
                  </button>
                ))}
                {filteredProducts.length === 0 && <p className="product-opt-empty">No products found</p>}
              </div>
            )}
          </div>

          {/* Cart table */}
          {cart.length > 0 && (
            <div className="table-card" style={{ marginBottom: 16 }}>
              <table className="app-table invoice-table">
                <thead>
                  <tr>
                    <th>SR</th><th>Description</th><th>Unit</th>
                    <th className="text-right">Rate</th><th>QTY</th>
                    <th>Disc%</th><th className="text-right">Amount</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td className="text-muted">{idx + 1}</td>
                      <td>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-muted text-xs">{item.product_sku}</div>
                      </td>
                      <td className="text-muted">{item.unit}</td>
                      <td className="text-right">₹{Number(item.unit_price).toLocaleString('en-IN')}</td>
                      <td>
                        <input type="number" min="0.01" step="0.01" className="qty-input"
                          value={item.quantity}
                          onChange={e => updateCartItem(idx, 'quantity', parseFloat(e.target.value) || 1)} />
                      </td>
                      <td>
                        <input type="number" min="0" max="100" step="0.5" className="qty-input"
                          value={item.discount_percent}
                          onChange={e => updateCartItem(idx, 'discount_percent', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="text-right font-medium">{fmtCurrency(item.line_amount)}</td>
                      <td>
                        <button className="icon-btn danger" onClick={() => removeItem(idx)}><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals + Settings */}
          {cart.length > 0 && (
            <div className="invoice-totals-card">
              <div className="totals-left">
                <div className="form-group">
                  <label className="form-label">Invoice Discount (₹)</label>
                  <input type="number" min="0" className="form-input" value={invoiceDiscount}
                    onChange={e => setInvoiceDiscount(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Transport / Hamali (₹)</label>
                  <input type="number" min="0" className="form-input" value={transportHamali}
                    onChange={e => setTransportHamali(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IndianRupee size={13} /> GST % (Applied on Whole Invoice)
                  </label>
                  <select className="form-input" value={gstPercentage}
                    onChange={e => setGstPercentage(parseFloat(e.target.value))}>
                    <option value={0}>0% (No GST)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes / Special Instructions</label>
                  <textarea className="form-input" rows={2} value={notes}
                    onChange={e => setNotes(e.target.value)} placeholder="Any special notes..." />
                </div>
              </div>
              <div className="totals-right">
                <div className="total-row"><span>Sub Total</span><span>{fmtCurrency(subtotal)}</span></div>
                {invoiceDiscount > 0 && <div className="total-row discount"><span>Discount</span><span>- {fmtCurrency(invoiceDiscount)}</span></div>}
                {transportHamali > 0 && <div className="total-row"><span>Transport / Hamali</span><span>{fmtCurrency(transportHamali)}</span></div>}
                <div className="total-row"><span>GST ({gstPercentage}%)</span><span>{fmtCurrency(gstAmt)}</span></div>
                <div className="total-row grand"><span>Grand Total</span><span>{fmtCurrency(grandTotal)}</span></div>
                <div className="total-words">{toWords(grandTotal)}</div>
              </div>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: 16 }}>
            <button className="btn-secondary" onClick={() => setStep('customer')}>← Back</button>
            {cart.length > 0 && (
              <button className="btn-primary" disabled={loading} onClick={handleSubmit}>
                {loading ? <span className="btn-spinner" /> : '✓ Generate Invoice'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
