// ─────────────────────────────────────────────────────────────────────
// CUSTOMER ROUTES — Role-based access, audit logging
// ─────────────────────────────────────────────────────────────────────
import express from 'express';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission, createAuditLog } from '../middleware/permissions.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const db = getDb();
  const { search, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let where = '1=1', params = [];
  if (search) {
    where = '(name LIKE ? OR phone LIKE ? OR company LIKE ?)';
    params = [`%${search}%`, `%${search}%`, `%${search}%`];
  }
  const data = db.prepare(`SELECT * FROM customers WHERE ${where} ORDER BY name ASC LIMIT ? OFFSET ?`).all([...params, parseInt(limit), offset]);
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM customers WHERE ${where}`).get(params).cnt;
  res.json({ success: true, data, total });
});

router.post('/', (req, res) => {
  const db = getDb();
  const { name, company, phone, email, billing_address, gstin, state, city, pincode } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Customer name is required.' });
  const result = db.prepare(`
    INSERT INTO customers (name, company, phone, email, billing_address, gstin, state, city, pincode, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, company||null, phone||null, email||null, billing_address||null, gstin||null, state||'Maharashtra', city||null, pincode||null, req.user.userId);

  createAuditLog(req, {
    action: 'CUSTOMER_CREATE',
    entityType: 'customer',
    entityId: result.lastInsertRowid,
    module: 'Customer Management',
    details: { name, phone },
  });

  res.status(201).json({ success: true, id: result.lastInsertRowid });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
  res.json({ success: true, data: customer });
});

router.put('/:id', requirePermission('customers', 'update'), (req, res) => {
  const db = getDb();
  const { name, company, phone, email, billing_address, gstin, state, city, pincode } = req.body;
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });

  db.prepare(`UPDATE customers SET name=?,company=?,phone=?,email=?,billing_address=?,gstin=?,state=?,city=?,pincode=? WHERE id=?`)
    .run(name, company||null, phone||null, email||null, billing_address||null, gstin||null, state||'Maharashtra', city||null, pincode||null, req.params.id);

  createAuditLog(req, {
    action: 'CUSTOMER_UPDATE',
    entityType: 'customer',
    entityId: parseInt(req.params.id),
    module: 'Customer Management',
    oldValues: { name: customer.name, phone: customer.phone },
    newValues: { name, phone },
  });

  res.json({ success: true, message: 'Customer updated.' });
});

export default router;
