// ─────────────────────────────────────────────────────────────────────
// PRODUCT ROUTES — RBAC, price history tracking, permission-based access
// ─────────────────────────────────────────────────────────────────────
import express from 'express';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission, createAuditLog } from '../middleware/permissions.js';

const router = express.Router();
router.use(authMiddleware);

// GET /api/products — List products (role-filtered)
router.get('/', (req, res) => {
  const db = getDb();
  const { search, category, status, page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = ['1=1'];
  const params = [];

  if (search) {
    where.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (category) { where.push('p.category_id = ?'); params.push(category); }

  // Role-based status filtering
  if (status) {
    where.push('p.status = ?'); params.push(status);
  } else if (req.user.role === 'employee') {
    // Employees only see active products
    where.push("p.status = 'active'");
  }

  const whereStr = where.join(' AND ');
  const products = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${whereStr} ORDER BY p.name ASC LIMIT ? OFFSET ?
  `).all([...params, parseInt(limit), offset]);

  const total = db.prepare(`SELECT COUNT(*) as cnt FROM products p WHERE ${whereStr}`).get(params).cnt;

  res.json({ success: true, data: products, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

  // Employee can only see active products
  if (req.user.role === 'employee' && product.status !== 'active') {
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
  }

  // Include price history for admin/super_admin
  let priceHistory = [];
  if (req.user.role !== 'employee') {
    priceHistory = db.prepare(`
      SELECT old_price, new_price, changed_by_name, reason, created_at
      FROM product_price_history WHERE product_id = ? ORDER BY created_at DESC LIMIT 20
    `).all(req.params.id);
  }

  res.json({ success: true, data: { ...product, priceHistory } });
});

// POST /api/products — Admin/Super Admin only
router.post('/', requirePermission('products', 'create'), (req, res) => {
  const db = getDb();
  // Whitelist allowed fields
  const { name, sku, category_id, description, unit, selling_price } = req.body;
  if (!name || !sku || !selling_price) return res.status(400).json({ success: false, message: 'Name, SKU and price are required.' });

  const existing = db.prepare('SELECT id FROM products WHERE sku = ?').get(sku);
  if (existing) return res.status(409).json({ success: false, message: 'SKU already exists.' });

  const result = db.prepare(`
    INSERT INTO products (name, sku, category_id, description, unit, selling_price, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(name, sku, category_id || null, description || null, unit || 'Sq.Ft.', selling_price, req.user.userId);

  createAuditLog(req, {
    action: 'PRODUCT_CREATE',
    entityType: 'product',
    entityId: result.lastInsertRowid,
    module: 'Product Management',
    details: { name, sku, selling_price },
  });

  res.status(201).json({ success: true, message: 'Product created.', id: result.lastInsertRowid });
});

// PUT /api/products/:id — Admin/Super Admin only
router.put('/:id', requirePermission('products', 'update'), (req, res) => {
  const db = getDb();
  // Whitelist allowed fields
  const { name, sku, category_id, description, unit, selling_price } = req.body;

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

  if (sku && sku !== product.sku) {
    const existing = db.prepare('SELECT id FROM products WHERE sku = ? AND id != ?').get(sku, req.params.id);
    if (existing) return res.status(409).json({ success: false, message: 'SKU already in use.' });
  }

  // Track price change in history if price changed
  const newPrice = selling_price ?? product.selling_price;
  if (newPrice !== product.selling_price) {
    db.prepare(`
      INSERT INTO product_price_history (product_id, old_price, new_price, changed_by, changed_by_name, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(parseInt(req.params.id), product.selling_price, newPrice, req.user.userId, req.user.name, req.body.price_change_reason || null);

    createAuditLog(req, {
      action: 'PRICE_CHANGE',
      entityType: 'product',
      entityId: parseInt(req.params.id),
      module: 'Product Management',
      details: { name: product.name, sku: product.sku },
      oldValues: { selling_price: product.selling_price },
      newValues: { selling_price: newPrice },
    });
  }

  const oldValues = { name: product.name, sku: product.sku, unit: product.unit, selling_price: product.selling_price };

  db.prepare(`
    UPDATE products SET name=?, sku=?, category_id=?, description=?, unit=?, selling_price=?, updated_by=?, updated_at=datetime('now')
    WHERE id=?
  `).run(name ?? product.name, sku ?? product.sku, category_id ?? product.category_id, description ?? product.description,
    unit ?? product.unit, newPrice, req.user.userId, req.params.id);

  const newValues = { name: name ?? product.name, sku: sku ?? product.sku, unit: unit ?? product.unit, selling_price: newPrice };

  createAuditLog(req, {
    action: 'PRODUCT_UPDATE',
    entityType: 'product',
    entityId: parseInt(req.params.id),
    module: 'Product Management',
    details: { name: product.name, sku: product.sku },
    oldValues,
    newValues,
  });

  res.json({ success: true, message: 'Product updated.' });
});

// PATCH /api/products/:id/status — Admin/Super Admin only
router.patch('/:id/status', requirePermission('products', 'activate'), (req, res) => {
  const db = getDb();
  const { status } = req.body;
  if (!['active', 'inactive', 'archived'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

  db.prepare("UPDATE products SET status=?, updated_by=?, updated_at=datetime('now') WHERE id=?").run(status, req.user.userId, req.params.id);

  createAuditLog(req, {
    action: status === 'active' ? 'PRODUCT_ACTIVATE' : 'PRODUCT_DEACTIVATE',
    entityType: 'product',
    entityId: parseInt(req.params.id),
    module: 'Product Management',
    details: { name: product.name, sku: product.sku },
    oldValues: { status: product.status },
    newValues: { status },
  });

  res.json({ success: true, message: `Product marked as ${status}.` });
});

// DELETE /api/products/:id — Admin/Super Admin only (soft delete)
router.delete('/:id', requirePermission('products', 'delete'), (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

  const usedInInvoice = db.prepare('SELECT id FROM invoice_items WHERE product_id = ? LIMIT 1').get(req.params.id);
  if (usedInInvoice) {
    db.prepare("UPDATE products SET status='archived', updated_by=?, updated_at=datetime('now') WHERE id=?").run(req.user.userId, req.params.id);

    createAuditLog(req, {
      action: 'PRODUCT_ARCHIVE',
      entityType: 'product',
      entityId: parseInt(req.params.id),
      module: 'Product Management',
      details: { name: product.name, sku: product.sku, reason: 'Used in existing invoices' },
    });

    return res.json({ success: true, message: 'Product archived (used in existing invoices).' });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

  createAuditLog(req, {
    action: 'PRODUCT_DELETE',
    entityType: 'product',
    entityId: parseInt(req.params.id),
    module: 'Product Management',
    details: { name: product.name, sku: product.sku },
  });

  res.json({ success: true, message: 'Product deleted.' });
});

// GET /api/products/:id/price-history — Admin/Super Admin only
router.get('/:id/price-history', requirePermission('products', 'read'), (req, res) => {
  const db = getDb();
  if (req.user.role === 'employee') {
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
  }

  const history = db.prepare(`
    SELECT old_price, new_price, changed_by_name, reason, created_at
    FROM product_price_history WHERE product_id = ? ORDER BY created_at DESC
  `).all(req.params.id);

  res.json({ success: true, data: history });
});

export default router;
