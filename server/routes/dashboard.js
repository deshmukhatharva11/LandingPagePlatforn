// ─────────────────────────────────────────────────────────────────────
// DASHBOARD ROUTES — Role-specific dashboards
// ─────────────────────────────────────────────────────────────────────
import express from 'express';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/dashboard/summary — Returns different data based on role
router.get('/summary', (req, res) => {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];
  const monthStart = today.slice(0, 7) + '-01';
  const role = req.user.role;

  if (role === 'super_admin') {
    return res.json({ success: true, data: getSuperAdminDashboard(db, today, monthStart) });
  } else if (role === 'admin') {
    return res.json({ success: true, data: getAdminDashboard(db, today, monthStart) });
  } else {
    return res.json({ success: true, data: getEmployeeDashboard(db, today, monthStart, req.user.userId) });
  }
});

// GET /api/dashboard/revenue — Revenue chart (Admin/Super Admin)
router.get('/revenue', (req, res) => {
  if (req.user.role === 'employee') {
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
  }

  const db = getDb();
  const months = db.prepare(`
    SELECT strftime('%Y-%m', invoice_date) as month,
      COUNT(*) as count, COALESCE(SUM(grand_total),0) as revenue
    FROM invoices WHERE status != 'cancelled'
    GROUP BY month ORDER BY month DESC LIMIT 12
  `).all();
  res.json({ success: true, data: months.reverse() });
});

// ─── SUPER ADMIN DASHBOARD ───
function getSuperAdminDashboard(db, today, monthStart) {
  // User stats
  const userStats = {
    totalSuperAdmins: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'super_admin'").get().cnt,
    totalAdmins: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'admin'").get().cnt,
    totalEmployees: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'employee'").get().cnt,
    activeUsers: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE is_active = 1").get().cnt,
    inactiveUsers: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE is_active = 0").get().cnt,
    recentUsers: db.prepare(`
      SELECT id, employee_id, name, email, role, is_active, created_at
      FROM users ORDER BY created_at DESC LIMIT 5
    `).all(),
  };

  // Product stats
  const productStats = {
    totalProducts: db.prepare("SELECT COUNT(*) as cnt FROM products WHERE status != 'archived'").get().cnt,
    activeProducts: db.prepare("SELECT COUNT(*) as cnt FROM products WHERE status = 'active'").get().cnt,
    inactiveProducts: db.prepare("SELECT COUNT(*) as cnt FROM products WHERE status = 'inactive'").get().cnt,
    recentProducts: db.prepare(`
      SELECT p.id, p.name, p.sku, p.selling_price, p.status, c.name as category_name, p.created_at
      FROM products p LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC LIMIT 5
    `).all(),
    recentPriceChanges: db.prepare(`
      SELECT ph.*, p.name as product_name, p.sku
      FROM product_price_history ph
      LEFT JOIN products p ON ph.product_id = p.id
      ORDER BY ph.created_at DESC LIMIT 5
    `).all(),
  };

  // Invoice stats
  const invoiceStats = {
    totalInvoices: db.prepare("SELECT COUNT(*) as cnt FROM invoices").get().cnt,
    todayInvoices: db.prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(grand_total),0) as total FROM invoices WHERE invoice_date = ?").get(today),
    monthInvoices: db.prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(grand_total),0) as total FROM invoices WHERE invoice_date >= ?").get(monthStart),
    totalRevenue: db.prepare("SELECT COALESCE(SUM(grand_total),0) as total FROM invoices WHERE status != 'cancelled'").get().total,
    recentInvoices: db.prepare(`
      SELECT i.id, i.invoice_number, i.invoice_date, i.grand_total, i.status, i.revision_count,
        u.name as created_by_name, u.employee_id as created_by_emp_id,
        json_extract(i.customer_snapshot,'$.name') as customer_name
      FROM invoices i LEFT JOIN users u ON i.created_by = u.id
      ORDER BY i.created_at DESC LIMIT 5
    `).all(),
  };

  // Employee activity stats
  const employeeActivity = db.prepare(`
    SELECT u.id, u.employee_id, u.name, u.role, u.last_login,
      COUNT(i.id) as invoice_count, COALESCE(SUM(i.grand_total), 0) as invoice_total
    FROM users u
    LEFT JOIN invoices i ON u.id = i.created_by
    WHERE u.role IN ('admin', 'employee') AND u.is_active = 1
    GROUP BY u.id
    ORDER BY invoice_count DESC LIMIT 10
  `).all();

  // Recent system activity
  const recentActivity = db.prepare(`
    SELECT a.action, a.user_name, a.employee_id, a.entity_type, a.entity_id, a.module, a.details, a.created_at
    FROM audit_logs a ORDER BY a.created_at DESC LIMIT 15
  `).all();

  // Security events
  const securityEvents = db.prepare(`
    SELECT COUNT(*) as cnt FROM audit_logs WHERE action = 'UNAUTHORIZED_ACCESS'
  `).get().cnt;

  const recentLoginFailures = db.prepare(`
    SELECT COUNT(*) as cnt FROM login_logs WHERE action = 'LOGIN_FAILED' AND created_at >= ?
  `).get(today).cnt;

  return {
    role: 'super_admin',
    userStats,
    productStats,
    invoiceStats,
    employeeActivity,
    recentActivity,
    securitySummary: { unauthorizedAttempts: securityEvents, todayFailedLogins: recentLoginFailures },
  };
}

// ─── ADMIN DASHBOARD ───
function getAdminDashboard(db, today, monthStart) {
  const totalProducts = db.prepare("SELECT COUNT(*) as cnt FROM products WHERE status != 'archived'").get().cnt;
  const activeProducts = db.prepare("SELECT COUNT(*) as cnt FROM products WHERE status = 'active'").get().cnt;
  const totalInvoices = db.prepare("SELECT COUNT(*) as cnt FROM invoices").get().cnt;
  const todayInvoices = db.prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(grand_total),0) as total FROM invoices WHERE invoice_date = ?").get(today);
  const monthInvoices = db.prepare("SELECT COUNT(*) as cnt, COALESCE(SUM(grand_total),0) as total FROM invoices WHERE invoice_date >= ?").get(monthStart);
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(grand_total),0) as total FROM invoices WHERE status != 'cancelled'").get().total;

  const recentInvoices = db.prepare(`
    SELECT i.id, i.invoice_number, i.invoice_date, i.grand_total, i.status, i.revision_count,
      u.name as created_by_name, u.employee_id as created_by_emp_id,
      json_extract(i.customer_snapshot,'$.name') as customer_name
    FROM invoices i LEFT JOIN users u ON i.created_by = u.id
    ORDER BY i.created_at DESC LIMIT 5
  `).all();

  const recentProducts = db.prepare(`
    SELECT p.id, p.name, p.sku, p.selling_price, p.status, c.name as category_name
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC LIMIT 5
  `).all();

  return {
    role: 'admin',
    totalProducts, activeProducts,
    totalInvoices, todayInvoices, monthInvoices,
    totalRevenue, recentInvoices, recentProducts,
  };
}

// ─── EMPLOYEE DASHBOARD ───
function getEmployeeDashboard(db, today, monthStart, userId) {
  const myTodayInvoices = db.prepare(
    "SELECT COUNT(*) as cnt, COALESCE(SUM(grand_total),0) as total FROM invoices WHERE created_by = ? AND invoice_date = ?"
  ).get(userId, today);

  const myMonthInvoices = db.prepare(
    "SELECT COUNT(*) as cnt, COALESCE(SUM(grand_total),0) as total FROM invoices WHERE created_by = ? AND invoice_date >= ?"
  ).get(userId, monthStart);

  const myTotalInvoices = db.prepare(
    "SELECT COUNT(*) as cnt, COALESCE(SUM(grand_total),0) as total FROM invoices WHERE created_by = ?"
  ).get(userId);

  const myRecentInvoices = db.prepare(`
    SELECT i.id, i.invoice_number, i.invoice_date, i.grand_total, i.status,
      json_extract(i.customer_snapshot,'$.name') as customer_name
    FROM invoices i WHERE i.created_by = ?
    ORDER BY i.created_at DESC LIMIT 10
  `).all(userId);

  return {
    role: 'employee',
    todayInvoices: myTodayInvoices,
    monthInvoices: myMonthInvoices,
    totalInvoices: myTotalInvoices,
    recentInvoices: myRecentInvoices,
  };
}

export default router;
