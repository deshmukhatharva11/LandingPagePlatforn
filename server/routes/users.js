// ─────────────────────────────────────────────────────────────────────
// USER MANAGEMENT ROUTES — Super Admin only
// ─────────────────────────────────────────────────────────────────────
import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb, generateEmployeeId } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission, createAuditLog } from '../middleware/permissions.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/users — List all users (Super Admin only)
router.get('/', requirePermission('users', 'read'), (req, res) => {
  const db = getDb();
  const { search, role, status, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = ['1=1'];
  const params = [];

  if (search) {
    where.push('(u.name LIKE ? OR u.email LIKE ? OR u.employee_id LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (role) { where.push('u.role = ?'); params.push(role); }
  if (status === 'active') { where.push('u.is_active = 1'); }
  else if (status === 'inactive') { where.push('u.is_active = 0'); }

  const whereStr = where.join(' AND ');
  const users = db.prepare(`
    SELECT u.id, u.employee_id, u.name, u.email, u.role, u.mobile, u.department,
      u.is_active, u.last_login, u.created_at, u.updated_at,
      c.name as created_by_name
    FROM users u
    LEFT JOIN users c ON u.created_by = c.id
    WHERE ${whereStr}
    ORDER BY u.created_at DESC LIMIT ? OFFSET ?
  `).all([...params, parseInt(limit), offset]);

  const total = db.prepare(`SELECT COUNT(*) as cnt FROM users u WHERE ${whereStr}`).get(params).cnt;

  // Count by role
  const roleCounts = {
    super_admin: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'super_admin'").get().cnt,
    admin: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'admin'").get().cnt,
    employee: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role = 'employee'").get().cnt,
    active: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE is_active = 1").get().cnt,
    inactive: db.prepare("SELECT COUNT(*) as cnt FROM users WHERE is_active = 0").get().cnt,
  };

  res.json({ success: true, data: users, total, roleCounts, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/users/:id — Get user detail (Super Admin only)
router.get('/:id', requirePermission('users', 'read'), (req, res) => {
  const db = getDb();
  const user = db.prepare(`
    SELECT u.id, u.employee_id, u.name, u.email, u.role, u.mobile, u.department,
      u.is_active, u.last_login, u.created_at, u.updated_at,
      c.name as created_by_name
    FROM users u LEFT JOIN users c ON u.created_by = c.id
    WHERE u.id = ?
  `).get(req.params.id);

  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  // Get recent activity
  const recentActivity = db.prepare(`
    SELECT action, entity_type, entity_id, module, details, created_at
    FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
  `).all(req.params.id);

  // Get login history
  const loginHistory = db.prepare(`
    SELECT action, status, ip_address, failure_reason, created_at
    FROM login_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 10
  `).all(req.params.id);

  // Invoice stats
  const invoiceStats = db.prepare(`
    SELECT COUNT(*) as count, COALESCE(SUM(grand_total), 0) as total
    FROM invoices WHERE created_by = ?
  `).get(req.params.id);

  res.json({ success: true, data: { ...user, recentActivity, loginHistory, invoiceStats } });
});

// POST /api/users — Create Admin or Employee (Super Admin only)
router.post('/', requirePermission('users', 'create'), (req, res) => {
  const db = getDb();
  // Whitelist allowed fields — mass assignment protection
  const { name, email, password, role, mobile, department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  // Validate role
  if (req.user.role === 'admin' && role !== 'employee') {
    return res.status(403).json({ success: false, message: 'Admins can only create Employee accounts.' });
  }
  const allowedRoles = ['super_admin', 'admin', 'employee'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role specified.' });
  }

  // Check unique email
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) return res.status(409).json({ success: false, message: 'Email already in use.' });

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  const hash = bcrypt.hashSync(password, 12);
  const employeeId = generateEmployeeId(role);

  const result = db.prepare(`
    INSERT INTO users (employee_id, name, email, password_hash, role, mobile, department, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(employeeId, name.trim(), email.toLowerCase().trim(), hash, role, mobile || null, department || null, req.user.userId);

  createAuditLog(req, {
    action: 'USER_CREATE',
    entityType: 'user',
    entityId: result.lastInsertRowid,
    module: 'User Management',
    details: { employee_id: employeeId, name, email, role },
  });

  res.status(201).json({
    success: true,
    message: `${role === 'admin' ? 'Admin' : 'Employee'} created successfully.`,
    id: result.lastInsertRowid,
    employee_id: employeeId,
  });
});

// PUT /api/users/:id — Edit user (Super Admin only)
router.put('/:id', requirePermission('users', 'update'), (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  // Whitelist allowed fields
  const { name, email, mobile, department, role } = req.body;

  // Cannot edit super_admin or admin unless super_admin
  if (req.user.role === 'admin') {
    if (user.role === 'super_admin' || user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admins cannot edit Admin or Super Admin accounts.' });
    }
    if (role && role !== 'employee') {
      return res.status(403).json({ success: false, message: 'Admins can only assign the Employee role.' });
    }
  } else if (user.role === 'super_admin' && req.user.userId !== user.id) {
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
  }
  const oldValues = { name: user.name, email: user.email, mobile: user.mobile, department: user.department, role: user.role };

  // If changing role, validate
  if (role && role !== user.role) {
    if (!['admin', 'employee'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be admin or employee.' });
    }
    // Generate new employee_id if role changed
    const newEmpId = generateEmployeeId(role);
    db.prepare("UPDATE users SET employee_id = ? WHERE id = ?").run(newEmpId, req.params.id);
  }

  if (email && email.toLowerCase().trim() !== user.email) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email.toLowerCase().trim(), req.params.id);
    if (existing) return res.status(409).json({ success: false, message: 'Email already in use.' });
  }

  db.prepare(`
    UPDATE users SET name=?, email=?, mobile=?, department=?, role=?, updated_at=datetime('now')
    WHERE id=?
  `).run(
    name ?? user.name,
    email ? email.toLowerCase().trim() : user.email,
    mobile ?? user.mobile,
    department ?? user.department,
    role ?? user.role,
    req.params.id
  );

  const newValues = { name: name ?? user.name, email: email ?? user.email, mobile: mobile ?? user.mobile, department: department ?? user.department, role: role ?? user.role };

  createAuditLog(req, {
    action: 'USER_UPDATE',
    entityType: 'user',
    entityId: parseInt(req.params.id),
    module: 'User Management',
    details: { employee_id: user.employee_id },
    oldValues,
    newValues,
  });

  res.json({ success: true, message: 'User updated successfully.' });
});

// PATCH /api/users/:id/status — Activate/Deactivate (Super Admin only)
router.patch('/:id/status', requirePermission('users', 'activate'), (req, res) => {
  const db = getDb();
  const { is_active } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  // Cannot deactivate yourself
  if (req.user.userId === user.id) {
    return res.status(400).json({ success: false, message: 'You cannot deactivate your own account.' });
  }
  // Cannot change status of admin or super_admin if admin
  if (req.user.role === 'admin' && (user.role === 'super_admin' || user.role === 'admin')) {
    return res.status(403).json({ success: false, message: 'Admins cannot change status of Admin or Super Admin accounts.' });
  }
  if (user.role === 'super_admin') {
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
  }

  const newStatus = is_active ? 1 : 0;
  db.prepare("UPDATE users SET is_active=?, updated_at=datetime('now') WHERE id=?").run(newStatus, req.params.id);

  createAuditLog(req, {
    action: newStatus ? 'USER_ACTIVATE' : 'USER_DEACTIVATE',
    entityType: 'user',
    entityId: parseInt(req.params.id),
    module: 'User Management',
    details: { employee_id: user.employee_id, name: user.name },
    oldValues: { is_active: user.is_active },
    newValues: { is_active: newStatus },
  });

  res.json({ success: true, message: `User ${newStatus ? 'activated' : 'deactivated'} successfully.` });
});

// POST /api/users/:id/reset-password — Reset password (Super Admin only)
router.post('/:id/reset-password', requirePermission('users', 'reset_password'), (req, res) => {
  const db = getDb();
  const { new_password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  if (!new_password || new_password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  const hash = bcrypt.hashSync(new_password, 12);
  db.prepare("UPDATE users SET password_hash=?, updated_at=datetime('now') WHERE id=?").run(hash, req.params.id);

  createAuditLog(req, {
    action: 'PASSWORD_RESET',
    entityType: 'user',
    entityId: parseInt(req.params.id),
    module: 'User Management',
    details: { employee_id: user.employee_id, name: user.name, reset_by: req.user.name },
  });

  res.json({ success: true, message: 'Password reset successfully.' });
});

// GET /api/users/:id/activity — User activity timeline (Super Admin only)
router.get('/:id/activity', requirePermission('users', 'view_activity'), (req, res) => {
  const db = getDb();
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const logs = db.prepare(`
    SELECT action, entity_type, entity_id, module, details, old_values, new_values, created_at
    FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(req.params.id, parseInt(limit), offset);

  const total = db.prepare('SELECT COUNT(*) as cnt FROM audit_logs WHERE user_id = ?').get(req.params.id).cnt;

  res.json({ success: true, data: logs, total, page: parseInt(page), limit: parseInt(limit) });
});

export default router;
