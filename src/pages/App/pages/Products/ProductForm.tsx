import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import { Save, ArrowLeft } from 'lucide-react';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', sku: '', category_id: '', description: '',
    unit: 'Sq.Ft.', selling_price: '', gst_percentage: '18',
  });

  useEffect(() => {
    client.get('/categories').then(r => setCategories(r.data.data));
    if (isEdit) {
      client.get(`/products/${id}`).then(r => {
        const p = r.data.data;
        setForm({ name: p.name, sku: p.sku, category_id: p.category_id || '', description: p.description || '',
          unit: p.unit, selling_price: p.selling_price, gst_percentage: p.gst_percentage });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await client.put(`/products/${id}`, form);
      } else {
        await client.post('/products', form);
      }
      navigate('/app/products');
    } catch (err: any) {
      setError(err?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  const units = ['Sq.Ft.', 'Nos', 'Set', 'Meter', 'Rft', 'Kg', 'Ltr', 'Box', 'Pair'];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/app/products')}><ArrowLeft size={16} /> Products</button>
          <h1 className="page-title">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {error && <div className="form-error">{error}</div>}
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" required placeholder="e.g. Acrylic Shutter"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">SKU / Product Code *</label>
            <input className="form-input" required placeholder="e.g. MK-001"
              value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value.toUpperCase() }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <select className="form-input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Selling Price (₹) *</label>
            <input className="form-input" required type="number" min="0" step="0.01" placeholder="0.00"
              value={form.selling_price} onChange={e => setForm(f => ({ ...f, selling_price: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">GST %</label>
            <select className="form-input" value={form.gst_percentage} onChange={e => setForm(f => ({ ...f, gst_percentage: e.target.value }))}>
              {['0','5','12','18','28'].map(g => <option key={g} value={g}>{g}%</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} placeholder="Brief product description..."
            value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/app/products')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : <><Save size={16} /> {isEdit ? 'Update Product' : 'Add Product'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
