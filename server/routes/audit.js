// ─────────────────────────────────────────────────────────────────────
// AUDIT ROUTES — System logs, login activity, security events
// ─────────────────────────────────────────────────────────────────────
import express from 'express';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/audit/logs — Activity timeline
router.get('/logs', requirePermission('audit', 'read'), (req, res) => {
  const db = getDb();
  const { search, action, user_id, entity_type, module, from, to, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = ['1=1'];
  const params = [];

  // Admin: limited view (no security events, no user management logs)
  if (req.user.role === 'admin') {
    where.push("a.action NOT IN ('UNAUTHORIZED_ACCESS', 'USER_CREATE', 'USER_UPDATE', 'USER_ACTIVATE', 'USER_DEACTIVATE', 'PASSWORD_RESET')");
  }

  if (search) {
    where.push('(a.user_name LIKE ? OR a.employee_id LIKE ? OR a.details LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (action) { where.push('a.action = ?'); params.push(action); }
  if (user_id) { where.push('a.user_id = ?'); params.push(user_id); }
  if (entity_type) { where.push('a.entity_type = ?'); params.push(entity_type); }
  if (module) { where.push('a.module = ?'); params.push(module); }
  if (from) { where.push('a.created_at >= ?'); params.push(from); }
  if (to) { where.push('a.created_at <= ?'); params.push(to + ' 23:59:59'); }

  const whereStr = where.join(' AND ');
  const logs = db.prepare(`
    SELECT a.id, a.user_id, a.user_name, a.employee_id, a.action, a.entity_type, a.entity_id,
      a.module, a.details, a.old_values, a.new_values, a.ip_address, a.created_at
    FROM audit_logs a
    WHERE ${whereStr}
    ORDER BY a.created_at DESC LIMIT ? OFFSET ?
  `).all([...params, parseInt(limit), offset]);

  const total = db.prepare(`SELECT COUNT(*) as cnt FROM audit_logs a WHERE ${whereStr}`).get(params).cnt;

  // Get unique action types for filters
  const actionTypes = db.prepare("SELECT DISTINCT action FROM audit_logs ORDER BY action").all().map(r => r.action);

  res.json({ success: true, data: logs, total, actionTypes, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/audit/logins — Login activity (Super Admin only)
router.get('/logins', requirePermission('audit', 'read_logins'), (req, res) => {
  const db = getDb();
  const { user_id, status, from, to, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const where = ['1=1'];
  const params = [];

  if (user_id) { where.push('l.user_id = ?'); params.push(user_id); }
  if (status) { where.push('l.status = ?'); params.push(status); }
  if (from) { where.push('l.created_at >= ?'); params.push(from); }
  if (to) { where.push('l.created_at <= ?'); params.push(to + ' 23:59:59'); }

  const whereStr = where.join(' AND ');
  const logs = db.prepare(`
    SELECT l.id, l.user_id, l.user_name, l.employee_id, l.email, l.action, l.status,
      l.ip_address, l.failure_reason, l.created_at
    FROM login_logs l
    WHERE ${whereStr}
    ORDER BY l.created_at DESC LIMIT ? OFFSET ?
  `).all([...params, parseInt(limit), offset]);

  const total = db.prepare(`SELECT COUNT(*) as cnt FROM login_logs l WHERE ${whereStr}`).get(params).cnt;

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const stats = {
    totalLogins: db.prepare("SELECT COUNT(*) as cnt FROM login_logs WHERE action = 'LOGIN_SUCCESS'").get().cnt,
    todayLogins: db.prepare("SELECT COUNT(*) as cnt FROM login_logs WHERE action = 'LOGIN_SUCCESS' AND created_at >= ?").get(today).cnt,
    failedAttempts: db.prepare("SELECT COUNT(*) as cnt FROM login_logs WHERE action = 'LOGIN_FAILED'").get().cnt,
    todayFailed: db.prepare("SELECT COUNT(*) as cnt FROM login_logs WHERE action = 'LOGIN_FAILED' AND created_at >= ?").get(today).cnt,
  };

  res.json({ success: true, data: logs, total, stats, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/audit/security — Security events (Super Admin only)
router.get('/security', requirePermission('audit', 'read_security'), (req, res) => {
  const db = getDb();
  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const events = db.prepare(`
    SELECT a.id, a.user_id, a.user_name, a.employee_id, a.action, a.module,
      a.details, a.ip_address, a.user_agent, a.created_at
    FROM audit_logs a
    WHERE a.action = 'UNAUTHORIZED_ACCESS'
    ORDER BY a.created_at DESC LIMIT ? OFFSET ?
  `).all(parseInt(limit), offset);

  const total = db.prepare("SELECT COUNT(*) as cnt FROM audit_logs WHERE action = 'UNAUTHORIZED_ACCESS'").get().cnt;

  res.json({ success: true, data: events, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/audit/invoice/:id/revisions — Invoice revision history
router.get('/invoice/:id/revisions', requirePermission('audit', 'read'), (req, res) => {
  const db = getDb();

  const revisions = db.prepare(`
    SELECT r.id, r.revision_number, r.changed_by, r.changed_by_name, r.change_type,
      r.field_name, r.old_value, r.new_value, r.reason, r.created_at
    FROM invoice_revisions r
    WHERE r.invoice_id = ?
    ORDER BY r.revision_number DESC, r.created_at DESC
  `).all(req.params.id);

  res.json({ success: true, data: revisions });
});

export default router;
