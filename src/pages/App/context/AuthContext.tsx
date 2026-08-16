import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import client from '../api/client';

type Role = 'super_admin' | 'admin' | 'employee';

interface User {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  role: Role;
  mobile?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isAdminOrAbove: boolean;
  hasPermission: (module: string, action: string) => boolean;
}

// Client-side permission mirror (must match server permissions.js)
const PERMISSIONS: Record<string, Record<string, string[]>> = {
  super_admin: {
    dashboard: ['view', 'view_full'],
    users: ['create', 'read', 'update', 'delete', 'activate', 'deactivate', 'reset_password', 'view_activity'],
    products: ['create', 'read', 'update', 'delete', 'change_price', 'activate', 'deactivate'],
    invoices: ['create', 'read', 'read_all', 'update', 'delete', 'download', 'print', 'change_status', 'finalize'],
    customers: ['create', 'read', 'update', 'delete'],
    categories: ['create', 'read', 'update', 'delete'],
    audit: ['read', 'read_full', 'read_logins', 'read_security'],
    settings: ['read', 'update'],
  },
  admin: {
    dashboard: ['view'],
    users: ['create', 'read', 'update', 'activate', 'deactivate', 'reset_password'],
    products: ['create', 'read', 'update', 'delete', 'change_price', 'activate', 'deactivate'],
    invoices: ['create', 'read', 'read_all', 'update', 'download', 'print', 'change_status'],
    customers: ['create', 'read', 'update'],
    categories: ['create', 'read', 'update'],
    audit: ['read'],
    settings: [],
  },
  employee: {
    dashboard: ['view'],
    users: [],
    products: ['read_active'],
    invoices: ['create', 'read_own', 'update_own', 'download_own', 'print_own'],
    customers: ['create', 'read'],
    categories: ['read'],
    audit: [],
    settings: [],
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('mrt_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/auth/me')
      .then(r => { setUser(r.data.user); localStorage.setItem('mrt_user', JSON.stringify(r.data.user)); })
      .catch(() => { setUser(null); localStorage.removeItem('mrt_user'); localStorage.removeItem('mrt_token'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await client.post('/auth/login', { email, password });
    localStorage.setItem('mrt_token', r.data.token);
    localStorage.setItem('mrt_user', JSON.stringify(r.data.user));
    setUser(r.data.user);
  };

  const logout = async () => {
    await client.post('/auth/logout').catch(() => {});
    localStorage.removeItem('mrt_token');
    localStorage.removeItem('mrt_user');
    setUser(null);
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isAdminOrAbove = isSuperAdmin || isAdmin;

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    const rolePerms = PERMISSIONS[user.role];
    if (!rolePerms) return false;
    const modulePerms = rolePerms[module];
    if (!modulePerms) return false;
    return modulePerms.includes(action);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSuperAdmin, isAdmin, isEmployee, isAdminOrAbove, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
