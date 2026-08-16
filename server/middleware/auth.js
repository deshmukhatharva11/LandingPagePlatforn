import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mrt-super-secret-jwt-2026-mrtrades';

/**
 * Authentication middleware — verifies JWT and validates user is still active.
 * Enriches req.user with userId, role, name, email, employeeId.
 * Also extracts client IP for audit logging.
 */
export function authMiddleware(req, res, next) {
  // Extract client IP
  req.clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || req.ip;

  const token = req.cookies?.mrt_token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Session validation: verify user still exists and is active in DB
    const db = getDb();
    const user = db.prepare('SELECT id, role, is_active, employee_id, name, email FROM users WHERE id = ?').get(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User account not found. Please login again.' });
    }
    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated. Contact your administrator.' });
    }

    // Enrich req.user with latest data from DB (not stale JWT data)
    req.user = {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      employeeId: user.employee_id,
    };

    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
  }
}

/**
 * Create JWT token with user payload.
 * Token includes userId, role, name, email, employeeId.
 */
export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}
