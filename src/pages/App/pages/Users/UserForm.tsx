import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'employee', mobile: '', department: '',
  });
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      client.get('/users/' + id).then(r => {
        const u = r.data.data;
        setForm({ name: u.name, email: u.email, password: '', role: u.role, mobile: u.mobile || '', department: u.department || '' });
        setUserData(u);
      }).catch(() => navigate('/app/users')).finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        const payload: any = { name: form.name, email: form.email, role: currentUser?.role === 'admin' ? 'employee' : form.role, mobile: form.mobile, department: form.department };
        await client.put('/users/' + id, payload);
        alert('User updated successfully.');
      } else {
        if (!form.password || form.password.length < 8) { alert('Password must be at least 8 characters.'); setSaving(false); return; }
        const payload = { ...form, role: currentUser?.role === 'admin' ? 'employee' : form.role };
        await client.post('/users', payload);
        alert('User created successfully.');
      }
      navigate('/app/users');
    } catch (err: any) {
      alert(err.message || err.response?.data?.message || 'Failed to save user.');
    }
    setSaving(false);
  };

  if (loading) return <div className='app-loading'><div className='app-spinner' /></div>;

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div>
          <button className='btn-back' onClick={() => navigate('/app/users')}><ArrowLeft size={16} /> Back to Users</button>
          <h1 className='page-title'><UserPlus size={24} /> {isEdit ? 'Edit User' : 'Create User'}</h1>
          {isEdit && userData && (
            <p className='page-subtitle'>Employee ID: <strong>{userData.employee_id}</strong> • Role: <strong>{userData.role === 'super_admin' ? 'Super Admin' : userData.role === 'admin' ? 'Admin' : 'Employee'}</strong></p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className='form-card'>
        <div className='form-grid'>
          <div className='form-group'>
            <label>Full Name *</label>
            <input type='text' value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className='form-group'>
            <label>Email *</label>
            <input type='email' value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          {!isEdit && (
            <div className='form-group'>
              <label>Password * (min 8 chars)</label>
              <input type='password' value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
            </div>
          )}
          <div className='form-group'>
            <label>Role *</label>
            {currentUser?.role === 'admin' ? (
              <select value='employee' disabled>
                <option value='employee'>Employee</option>
              </select>
            ) : (
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value='employee'>Employee</option>
                <option value='admin'>Admin</option>
                <option value='super_admin'>Super Admin</option>
              </select>
            )}
          </div>
          <div className='form-group'>
            <label>Mobile</label>
            <input type='tel' value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} />
          </div>
          <div className='form-group'>
            <label>Department</label>
            <input type='text' value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          </div>
        </div>

        {isEdit && userData && (
          <div className='info-box'>
            <p><strong>Employee ID:</strong> {userData.employee_id}</p>
            <p><strong>Created:</strong> {new Date(userData.created_at + 'Z').toLocaleString('en-IN')}</p>
            <p><strong>Last Login:</strong> {userData.last_login ? new Date(userData.last_login + 'Z').toLocaleString('en-IN') : 'Never'}</p>
            {userData.invoiceStats && (
              <p><strong>Invoices Created:</strong> {userData.invoiceStats.count} (₹{userData.invoiceStats.total?.toLocaleString('en-IN')})</p>
            )}
          </div>
        )}

        <div className='form-actions'>
          <button type='button' className='btn btn-secondary' onClick={() => navigate('/app/users')}>Cancel</button>
          <button type='submit' className='btn btn-primary' disabled={saving}>{saving ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}</button>
        </div>
      </form>

      {isEdit && userData?.recentActivity?.length > 0 && (
        <div className='activity-section'>
          <h3>Recent Activity</h3>
          <div className='activity-timeline'>
            {userData.recentActivity.map((a: any, i: number) => (
              <div key={i} className='activity-item'>
                <div className='activity-dot' />
                <div className='activity-content'>
                  <span className='activity-action'>{a.action.replace(/_/g, ' ')}</span>
                  {a.module && <span className='activity-module'>{a.module}</span>}
                  <span className='activity-time'>{new Date(a.created_at + 'Z').toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}