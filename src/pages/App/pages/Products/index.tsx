import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { PlusCircle, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Filter } from 'lucide-react';

function fmt(n: number) { return `₹${Number(n).toLocaleString('en-IN')}`; }

export default function ProductList() {
  const { user, isAdminOrAbove } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { search, limit: 100 };
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      const r = await client.get('/products', { params });
      setProducts(r.data.data);
      setTotal(r.data.total);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    client.get('/categories').then(r => setCategories(r.data.data));
  }, []);

  useEffect(() => { fetchProducts(); }, [search, categoryFilter, statusFilter]);

  const toggleStatus = async (id: number, current: string) => {
    const next = current === 'active' ? 'inactive' : 'active';
    await client.patch(`/products/${id}/status`, { status: next });
    fetchProducts();
  };

  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? If used in invoices, it will be archived instead.`)) return;
    await client.delete(`/products/${id}`);
    fetchProducts();
  };

  const statusColors: Record<string, string> = { active: 'status-green', inactive: 'status-yellow', archived: 'status-red' };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-subtitle">{total} products</p>
        </div>
        {isAdminOrAbove && (
          <Link to="/app/products/new" className="btn-primary">
            <PlusCircle size={18} /> Add Product
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input className="search-input" placeholder="Search by name, SKU..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {isAdminOrAbove && (
          <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        )}
      </div>

      {/* Table */}
      <div className="table-card">
        {loading ? (
          <div className="page-loader"><div className="app-spinner" /></div>
        ) : (
          <table className="app-table">
            <thead>
              <tr>
                <th>Product</th><th>SKU</th><th>Category</th>
                <th>Unit</th><th className="text-right">Price</th><th>GST</th>
                <th>Status</th>{isAdminOrAbove && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="product-name">{p.name}</div>
                    {p.description && <div className="product-desc">{p.description}</div>}
                  </td>
                  <td className="text-muted mono">{p.sku}</td>
                  <td>{p.category_name || '—'}</td>
                  <td>{p.unit}</td>
                  <td className="text-right font-medium">{fmt(p.selling_price)}</td>
                  <td>{p.gst_percentage}%</td>
                  <td><span className={`status-badge ${statusColors[p.status]}`}>{p.status}</span></td>
                  {isAdminOrAbove && (
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" title="Edit" onClick={() => navigate(`/app/products/${p.id}/edit`)}>
                          <Edit2 size={15} />
                        </button>
                        <button className="icon-btn" title={p.status === 'active' ? 'Deactivate' : 'Activate'}
                          onClick={() => toggleStatus(p.id, p.status)}>
                          {p.status === 'active' ? <ToggleRight size={15} className="text-green" /> : <ToggleLeft size={15} />}
                        </button>
                        <button className="icon-btn danger" title="Delete" onClick={() => deleteProduct(p.id, p.name)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {!products.length && <tr><td colSpan={8} className="empty-row">No products found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
