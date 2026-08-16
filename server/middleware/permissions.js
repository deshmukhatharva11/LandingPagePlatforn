// ─────────────────────────────────────────────────────────────────────
// CENTRALIZED PERMISSION MATRIX & AUTHORIZATION MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────
// Every API route uses this instead of simple role checks.
// Permissions are enforced at the backend — frontend is only UI sugar.
// ─────────────────────────────────────────────────────────────────────

import { getDb } from '../db.js';

// ═══ PERMISSION MATRIX ═══
// Maps role → module → allowed actions
const PERMISSIONS = {
  super_admin: {
    dashboard:  ['view', 'view_full'],
    users:      ['create', 'read', 'update', 'delete', 'activate', 'deactivate', 'reset_password', 'view_activity'],
    products:   ['create', 'read', 'update', 'delete', 'change_price', 'activate', 'deactivate'],
    invoices:   ['create', 'read', 'read_all', 'update', 'delete', 'download', 'print', 'change_status', 'finalize'],
    customers:  ['create', 'read', 'update', 'delete'],
    categories: ['create', 'read', 'update', 'delete'],
    audit:      ['read', 'read_full', 'read_logins', 'read_security'],
    settings:   ['read', 'update'],
  },
  admin: {
    dashboard:  ['view'],
    users:      ['create', 'read', 'update', 'activate', 'deactivate', 'reset_password'],
    products:   ['create', 'read', 'update', 'delete', 'change_price', 'activate', 'deactivate'],
    invoices:   ['create', 'read', 'read_all', 'update', 'download', 'print', 'change_status'],
    customers:  ['create', 'read', 'update'],
    categories: ['create', 'read', 'update'],
    audit:      ['read'],
    settings:   [],
  },
  employee: {
    dashboard:  ['view'],
    users:      [],
    products:   ['read_active'],
    invoices:   ['create', 'read_own', 'update_own', 'download_own', 'print_own'],
    customers:  ['create', 'read'],
    categories: ['read'],
    audit:      [],
    settings:   [],
  },
};

// Role hierarchy: higher index = higher privilege
const ROLE_HIERARCHY = ['employee', 'admin', 'super_admin'];

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role, module, action) {
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;
  const modulePerms = rolePerms[module];
  if (!modulePerms) return false;
  // Wildcard: if the role has '*' for the module, allow everything
  if (modulePerms.includes('*')) return true;
  return modulePerms.includes(action);
}

/**
 * Check if roleA is higher than roleB in the hierarchy
 */
export function isHigherRole(roleA, roleB) {
  return ROLE_HIERARCHY.indexOf(roleA) > ROLE_HIERARCHY.indexOf(roleB);
}

/**
 * Get the permission set for a role
 */
export function getPermissions(role) {
  return PERMISSIONS[role] || {};
}

// ─────────────────────────────────────────────────────────────────────
// MIDDLEWARE: requirePermission(module, action)
// Checks the role-based permission matrix before allowing access.
// ─────────────────────────────────────────────────────────────────────
export function requirePermission(module, action) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRole = req.user.role;
    if (!hasPermission(userRole, module, action)) {
      // Log unauthorized attempt
      logSecurityEvent(req, module, action);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      });
    }

    next();
  };
}

// ─────────────────────────────────────────────────────────────────────
// MIDDLEWARE: requireRole(...roles)
// Simple role check — backward compatible with existing code.
// ─────────────────────────────────────────────────────────────────────
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      logSecurityEvent(req, 'general', 'role_check_failed');
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      });
    }
    next();
  };
}

// ─────────────────────────────────────────────────────────────────────
// MIDDLEWARE: requireOwnership(entityType)
// Object-level authorization — employees can only access own resources.
// Must be used AFTER the resource is fetched and placed on req.resource.
// ─────────────────────────────────────────────────────────────────────
export function checkOwnership(req, resource, ownerField = 'created_by') {
  const role = req.user.role;

  // Super Admin and Admin can access all resources
  if (role === 'super_admin' || role === 'admin') return true;

  // Employee: check ownership
  if (role === 'employee') {
    return resource[ownerField] === req.user.userId;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────
// AUDIT LOGGER — Records every sensitive action
// ─────────────────────────────────────────────────────────────────────
export function createAuditLog(req, {
  action,
  entityType,
  entityId,
  module: moduleName,
  details,
  oldValues,
  newValues,
}) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, employee_id, action, entity_type, entity_id, module, details, old_values, new_values, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user?.userId || null,
      req.user?.name || null,
      req.user?.employeeId || null,
      action,
      entityType || null,
      entityId || null,
      moduleName || null,
      details ? JSON.stringify(details) : null,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null,
      req.clientIp || req.ip || null,
      req.headers?.['user-agent'] || null,
    );
  } catch (err) {
    console.error('[AUDIT LOG ERROR]', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────
// LOGIN LOGGER
// ─────────────────────────────────────────────────────────────────────
export function createLoginLog({
  userId,
  userName,
  employeeId,
  email,
  action,
  status,
  failureReason,
  ip,
  userAgent,
}) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO login_logs (user_id, user_name, employee_id, email, action, status, failure_reason, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId || null,
      userName || null,
      employeeId || null,
      email || null,
      action,
      status,
      failureReason || null,
      ip || null,
      userAgent || null,
    );
  } catch (err) {
    console.error('[LOGIN LOG ERROR]', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────
// SECURITY EVENT LOGGER
// ─────────────────────────────────────────────────────────────────────
function logSecurityEvent(req, module, action) {
  try {
    const db = getDb();
    db.prepare(`
      INSERT INTO audit_logs (user_id, user_name, employee_id, action, module, details, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user?.userId || null,
      req.user?.name || null,
      req.user?.employeeId || null,
      'UNAUTHORIZED_ACCESS',
      module,
      JSON.stringify({
        attempted_action: action,
        attempted_url: req.originalUrl,
        method: req.method,
        role: req.user?.role || 'unknown',
      }),
      req.clientIp || req.ip || null,
      req.headers?.['user-agent'] || null,
    );
  } catch (err) {
    console.error('[SECURITY LOG ERROR]', err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────
// HELPER: Get system setting value
// ─────────────────────────────────────────────────────────────────────
export function getSetting(key) {
  const db = getDb();
  const row = db.prepare("SELECT value FROM system_settings WHERE key = ?").get(key);
  return row?.value || null;
}

export function getSettingBool(key) {
  const val = getSetting(key);
  return val === 'true' || val === '1';
}
