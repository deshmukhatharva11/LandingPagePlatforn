// Legacy wrapper — delegates to the new permissions.js system.
// Kept for backward compatibility with existing route imports.
export { requireRole, requirePermission, checkOwnership } from './permissions.js';
