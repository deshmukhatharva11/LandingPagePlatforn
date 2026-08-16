// ─────────────────────────────────────────────────────────────────────
// AUTH ROUTES — Login/Logout with activity logging, change password
// ─────────────────────────────────────────────────────────────────────
import express from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { authMiddleware, createToken } from '../middleware/auth.js';
import { createLoginLog, createAuditLog } from '../middleware/permissions.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || req.ip;
  const userAgent = req.headers['user-agent'] || '';

  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

  // User not found
  if (!user) {
    createLoginLog({
      email: email.toLowerCase().trim(),
      action: 'LOGIN_FAILED',
      status: 'failed',
      failureReason: 'User not found',
      ip, userAgent,
    });
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // Account deactivated
  if (!user.is_active) {
    createLoginLog({
      userId: user.id, userName: user.name, employeeId: user.employee_id,
      email: user.email, action: 'LOGIN_FAILED', status: 'failed',
      failureReason: 'Account deactivated', ip, userAgent,
    });
    return res.status(401).json({ success: false, message: 'Your account has been deactivated. Contact your administrator.' });
  }

  // Wrong password
  if (!bcrypt.compareSync(password, user.password_hash)) {
    createLoginLog({
      userId: user.id, userName: user.name, employeeId: user.employee_id,
      email: user.email, action: 'LOGIN_FAILED', status: 'failed',
      failureReason: 'Invalid password', ip, userAgent,
    });
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // Success
  const token = createToken({ userId: user.id, role: user.role, name: user.name, email: user.email, employeeId: user.employee_id });

  // Update last_login
  db.prepare("UPDATE users SET last_login = datetime('now') WHERE id = ?").run(user.id);

  // Log successful login
  createLoginLog({
    userId: user.id, userName: user.name, employeeId: user.employee_id,
    email: user.email, action: 'LOGIN_SUCCESS', status: 'success',
    ip, userAgent,
  });

  res.cookie('mrt_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24h
  });

  res.json({
    success: true,
    user: {
      id: user.id,
      employee_id: user.employee_id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req, res) => {
  const ip = req.clientIp || req.ip;
  const userAgent = req.headers['user-agent'] || '';

  createLoginLog({
    userId: req.user.userId, userName: req.user.name, employeeId: req.user.employeeId,
    email: req.user.email, action: 'LOGOUT', status: 'success',
    ip, userAgent,
  });

  res.clearCookie('mrt_token');
  res.json({ success: true, message: 'Logged out.' });
});

// GET /api/auth/me — Get current user info
router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, employee_id, name, email, role, mobile, department FROM users WHERE id = ?').get(req.user.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user });
});

// POST /api/auth/change-password — Change own password
router.post('/change-password', authMiddleware, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  if (!bcrypt.compareSync(current_password, user.password_hash)) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
  }

  const hash = bcrypt.hashSync(new_password, 12);
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(hash, req.user.userId);

  createLoginLog({
    userId: user.id, userName: user.name, employeeId: user.employee_id,
    email: user.email, action: 'PASSWORD_CHANGED', status: 'success',
    ip: req.clientIp || req.ip,
    userAgent: req.headers['user-agent'] || '',
  });

  createAuditLog(req, {
    action: 'PASSWORD_CHANGE',
    entityType: 'user',
    entityId: user.id,
    module: 'Authentication',
    details: { changed_by_self: true },
  });

  res.json({ success: true, message: 'Password changed successfully.' });
});

export default router;
