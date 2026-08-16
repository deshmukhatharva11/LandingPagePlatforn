// ─────────────────────────────────────────────────────────────────────
// INVOICE ROUTES — Full RBAC, revision tracking, object-level auth
// ─────────────────────────────────────────────────────────────────────
import express from 'express';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { requirePermission, checkOwnership, createAuditLog, getSettingBool } from '../middleware/permissions.js';
import { calculateInvoice } from '../services/invoiceCalculator.js';
import { generateInvoiceNumber } from '../services/invoiceNumbering.js';
import { generateInvoicePDF } from '../services/pdfGenerator.js';

const router = express.Router();
router.use(authMiddleware);

// ─── Helper: Build WHERE clause based on role ───
function buildInvoiceWhere(req) {
  const where = ['1=1'];
  const params = [];

  if (req.user.role === 'employee') {
    // Employee: only own invoices
    where.push('i.created_by = ?');
    params.push(req.user.userId);
  }
  // Admin and Super Admin: all invoices

  return { where, params };
}

// GET /api/invoices — List invoices (role-filtered)
router.get('/', (req, res) => {
  const db = getDb();
  const { search, page = 1, limit = 20, from, to, status: statusFilter } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const { where, params } = buildInvoiceWhere(req);

  if (search) {
    where.push('(i.invoice_number LIKE ? OR json_extract(i.customer_snapshot, \'$.name\') LIKE ? OR json_extract(i.customer_snapshot, \'$.phone\') LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (from) { where.push('i.invoice_date >= ?'); params.push(from); }
  if (to) { where.push('i.invoice_date <= ?'); params.push(to); }
  if (statusFilter) { where.push('i.status = ?'); params.push(statusFilter); }

  const whereStr = where.join(' AND ');
  const data = db.prepare(`
    SELECT i.*, u.name as created_by_name, u.employee_id as created_by_emp_id,
      m.name as updated_by_name,
      json_extract(i.customer_snapshot,'$.name') as customer_name,
      json_extract(i.customer_snapshot,'$.phone') as customer_phone
    FROM invoices i
    LEFT JOIN users u ON i.created_by = u.id
    LEFT JOIN users m ON i.updated_by = m.id
    WHERE ${whereStr}
    ORDER BY i.created_at DESC LIMIT ? OFFSET ?
  `).all([...params, parseInt(limit), offset]);

  const total = db.prepare(`SELECT COUNT(*) as cnt FROM invoices i WHERE ${whereStr}`).get(params).cnt;
  res.json({ success: true, data, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/invoices/:id — Get single invoice (object-level auth)
router.get('/:id', (req, res) => {
  const db = getDb();
  const invoice = db.prepare(`
    SELECT i.*, u.name as created_by_name, u.employee_id as created_by_emp_id,
      m.name as updated_by_name, m.employee_id as updated_by_emp_id
    FROM invoices i
    LEFT JOIN users u ON i.created_by = u.id
    LEFT JOIN users m ON i.updated_by = m.id
    WHERE i.id = ?
  `).get(req.params.id);

  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

  // Object-level authorization
  if (!checkOwnership(req, invoice, 'created_by')) {
    createAuditLog(req, {
      action: 'UNAUTHORIZED_ACCESS',
      entityType: 'invoice',
      entityId: invoice.id,
      module: 'Invoice Management',
      details: { invoice_number: invoice.invoice_number, attempted_by: req.user.employeeId },
    });
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
  }

  const items = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY sort_order').all(req.params.id);
  const parsed = { ...invoice, customer_snapshot: JSON.parse(invoice.customer_snapshot), items };
  res.json({ success: true, data: parsed });
});

// GET /api/invoices/:id/pdf — Generate & download PDF (object-level auth)
router.get('/:id/pdf', async (req, res) => {
  try {
    const db = getDb();
    const invoice = db.prepare(`SELECT i.*, u.name as created_by_name FROM invoices i LEFT JOIN users u ON i.created_by = u.id WHERE i.id = ?`).get(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

    // Object-level authorization
    if (!checkOwnership(req, invoice, 'created_by')) {
      createAuditLog(req, {
        action: 'UNAUTHORIZED_ACCESS',
        entityType: 'invoice',
        entityId: invoice.id,
        module: 'Invoice Management',
        details: { invoice_number: invoice.invoice_number, action: 'PDF_DOWNLOAD' },
      });
      return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
    }

    const items = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY sort_order').all(req.params.id);
    const parsed = { ...invoice, customer: JSON.parse(invoice.customer_snapshot), items };

    const pdfBuffer = await generateInvoicePDF(parsed);

    // Log PDF download
    createAuditLog(req, {
      action: 'PDF_DOWNLOAD',
      entityType: 'invoice',
      entityId: invoice.id,
      module: 'Invoice Management',
      details: { invoice_number: invoice.invoice_number },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${parsed.invoice_number}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate PDF. Please try again.' });
  }
});

// POST /api/invoices — Create invoice (all authenticated roles)
router.post('/', (req, res) => {
  const db = getDb();
  // Whitelist allowed fields
  const { customer, items, invoice_discount = 0, transport_hamali = 0, gst_percentage = 18, notes } = req.body;

  if (!customer?.name) return res.status(400).json({ success: false, message: 'Customer name is required.' });
  if (!items?.length) return res.status(400).json({ success: false, message: 'At least one item required.' });

  // Invoice number is NEVER accepted from client — generated server-side only
  // This prevents any client from manipulating invoice numbering

  // Enrich items from DB (server-authoritative prices)
  let enrichedItems;
  try {
    enrichedItems = items.map(item => {
      const product = db.prepare('SELECT * FROM products WHERE id = ? AND status = ?').get(item.product_id, 'active');
      if (!product) throw { status: 400, message: `Product ID ${item.product_id} not found or inactive.` };
      return {
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        description: product.description,
        unit: product.unit,
        unit_price: product.selling_price, // Always use server-side price
        quantity: parseFloat(item.quantity) || 1,
        discount_percent: parseFloat(item.discount_percent) || 0,
      };
    });
  } catch (err) {
    return res.status(err.status || 400).json({ success: false, message: err.message });
  }

  const calc = calculateInvoice(enrichedItems, invoice_discount, transport_hamali, gst_percentage);
  const invoiceNumber = generateInvoiceNumber(); // Server-controlled numbering
  const invoiceDate = new Date().toISOString().split('T')[0];

  // Upsert customer
  let customerId = customer.id;
  if (!customerId) {
    const r = db.prepare(`INSERT INTO customers (name, company, phone, email, billing_address, gstin, state, city, pincode, created_by) VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .run(customer.name, customer.company||null, customer.phone||null, customer.email||null,
           customer.billing_address||null, customer.gstin||null, customer.state||'Maharashtra', customer.city||null, customer.pincode||null, req.user.userId);
    customerId = r.lastInsertRowid;
  }

  const createInvoice = db.transaction(() => {
    const invResult = db.prepare(`
      INSERT INTO invoices (invoice_number, customer_id, customer_snapshot, created_by, invoice_date,
        subtotal, discount_amount, transport_hamali, taxable_amount, gst_percentage, gst_amount, grand_total, amount_in_words, notes, status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).run(invoiceNumber, customerId, JSON.stringify(customer), req.user.userId, invoiceDate,
      calc.subtotal, calc.discount_amount, calc.transport_hamali, calc.taxable_amount,
      calc.gst_percentage, calc.gst_amount, calc.grand_total, calc.amount_in_words, notes||null, 'generated');

    const invId = invResult.lastInsertRowid;
    const insertItem = db.prepare(`
      INSERT INTO invoice_items (invoice_id, product_id, product_name, product_sku, description, unit,
        unit_price, quantity, discount_percent, discount_amount, line_amount, sort_order)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `);
    calc.items.forEach(item => {
      insertItem.run(invId, item.product_id, item.product_name, item.product_sku, item.description||null,
        item.unit, item.unit_price, item.quantity, item.discount_percent,
        item.discount_amount, item.line_amount, item.sort_order);
    });

    return invId;
  });

  const invId = createInvoice();

  createAuditLog(req, {
    action: 'INVOICE_CREATE',
    entityType: 'invoice',
    entityId: invId,
    module: 'Invoice Management',
    details: { invoice_number: invoiceNumber, total: calc.grand_total, customer_name: customer.name, items_count: enrichedItems.length },
  });

  res.status(201).json({ success: true, id: invId, invoice_number: invoiceNumber, ...calc });
});

// PUT /api/invoices/:id — Edit existing invoice (same invoice number)
// Records revision history. Recalculates totals server-side.
router.put('/:id', (req, res) => {
  const db = getDb();
  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

  // Object-level authorization
  if (!checkOwnership(req, invoice, 'created_by')) {
    createAuditLog(req, {
      action: 'UNAUTHORIZED_ACCESS',
      entityType: 'invoice',
      entityId: invoice.id,
      module: 'Invoice Management',
      details: { invoice_number: invoice.invoice_number, action: 'INVOICE_UPDATE' },
    });
    return res.status(403).json({ success: false, message: 'You do not have permission to access this resource.' });
  }

  // Employee edit permission check
  if (req.user.role === 'employee' && !getSettingBool('employee_can_edit_invoice')) {
    return res.status(403).json({ success: false, message: 'Invoice editing is not enabled for employees. Contact your administrator.' });
  }

  // Finalized invoice protection
  if (invoice.status === 'finalized' && req.user.role === 'employee') {
    return res.status(403).json({ success: false, message: 'Finalized invoices cannot be edited. Contact your administrator.' });
  }
  if (invoice.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Cancelled invoices cannot be edited.' });
  }

  const { customer, items, invoice_discount = 0, transport_hamali = 0, gst_percentage = 18, notes, reason } = req.body;

  if (!customer?.name) return res.status(400).json({ success: false, message: 'Customer name is required.' });
  if (!items?.length) return res.status(400).json({ success: false, message: 'At least one item required.' });

  // Snapshot old state BEFORE making changes
  const oldItems = db.prepare('SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY sort_order').all(req.params.id);
  const oldSnapshot = {
    customer_snapshot: invoice.customer_snapshot,
    subtotal: invoice.subtotal,
    discount_amount: invoice.discount_amount,
    transport_hamali: invoice.transport_hamali,
    gst_percentage: invoice.gst_percentage,
    gst_amount: invoice.gst_amount,
    grand_total: invoice.grand_total,
    notes: invoice.notes,
    items: oldItems,
  };

  // Enrich items from DB (server-authoritative prices)
  let enrichedItems;
  try {
    enrichedItems = items.map(item => {
      const product = db.prepare('SELECT * FROM products WHERE id = ? AND status = ?').get(item.product_id, 'active');
      if (!product) throw { status: 400, message: `Product ID ${item.product_id} not found or inactive.` };
      return {
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        description: product.description,
        unit: product.unit,
        unit_price: product.selling_price,
        quantity: parseFloat(item.quantity) || 1,
        discount_percent: parseFloat(item.discount_percent) || 0,
      };
    });
  } catch (err) {
    return res.status(err.status || 400).json({ success: false, message: err.message });
  }

  const calc = calculateInvoice(enrichedItems, invoice_discount, transport_hamali, gst_percentage);
  const newRevision = invoice.revision_count + 1;

  const editInvoice = db.transaction(() => {
    // 1) Record revision history
    const revisionChanges = [];

    // Compare grand total
    if (invoice.grand_total !== calc.grand_total) {
      revisionChanges.push({ change_type: 'TOTAL_CHANGE', field_name: 'grand_total', old_value: String(invoice.grand_total), new_value: String(calc.grand_total) });
    }
    if (invoice.discount_amount !== calc.discount_amount) {
      revisionChanges.push({ change_type: 'DISCOUNT_CHANGE', field_name: 'discount_amount', old_value: String(invoice.discount_amount), new_value: String(calc.discount_amount) });
    }
    if (invoice.transport_hamali !== calc.transport_hamali) {
      revisionChanges.push({ change_type: 'TRANSPORT_CHANGE', field_name: 'transport_hamali', old_value: String(invoice.transport_hamali), new_value: String(calc.transport_hamali) });
    }
    if (invoice.customer_snapshot !== JSON.stringify(customer)) {
      revisionChanges.push({ change_type: 'CUSTOMER_CHANGE', field_name: 'customer', old_value: invoice.customer_snapshot, new_value: JSON.stringify(customer) });
    }

    // Compare items
    const oldItemMap = {};
    oldItems.forEach(oi => { oldItemMap[oi.product_id] = oi; });
    enrichedItems.forEach(ni => {
      const oi = oldItemMap[ni.product_id];
      if (oi) {
        if (oi.quantity !== ni.quantity) {
          revisionChanges.push({ change_type: 'ITEM_CHANGE', field_name: `${ni.product_name} - Quantity`, old_value: String(oi.quantity), new_value: String(ni.quantity) });
        }
        if (oi.unit_price !== ni.unit_price) {
          revisionChanges.push({ change_type: 'ITEM_CHANGE', field_name: `${ni.product_name} - Price`, old_value: String(oi.unit_price), new_value: String(ni.unit_price) });
        }
      } else {
        revisionChanges.push({ change_type: 'ITEM_ADDED', field_name: ni.product_name, old_value: null, new_value: `Qty: ${ni.quantity}, Price: ${ni.unit_price}` });
      }
    });
    // Detect removed items
    oldItems.forEach(oi => {
      if (!enrichedItems.find(ni => ni.product_id === oi.product_id)) {
        revisionChanges.push({ change_type: 'ITEM_REMOVED', field_name: oi.product_name, old_value: `Qty: ${oi.quantity}, Price: ${oi.unit_price}`, new_value: null });
      }
    });

    // If no changes detected, add a general revision entry
    if (revisionChanges.length === 0) {
      revisionChanges.push({ change_type: 'GENERAL_UPDATE', field_name: 'invoice', old_value: null, new_value: null });
    }

    const insertRevision = db.prepare(`
      INSERT INTO invoice_revisions (invoice_id, revision_number, changed_by, changed_by_name, change_type, field_name, old_value, new_value, reason, invoice_snapshot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const change of revisionChanges) {
      insertRevision.run(
        parseInt(req.params.id), newRevision, req.user.userId, req.user.name,
        change.change_type, change.field_name, change.old_value, change.new_value,
        reason || null,
        // Store full snapshot only for the first change entry
        revisionChanges.indexOf(change) === 0 ? JSON.stringify(oldSnapshot) : null
      );
    }

    // 2) Update invoice (SAME invoice_number — never changes)
    db.prepare(`
      UPDATE invoices SET
        customer_id = ?, customer_snapshot = ?, updated_by = ?,
        subtotal = ?, discount_amount = ?, transport_hamali = ?, taxable_amount = ?,
        gst_percentage = ?, gst_amount = ?, grand_total = ?, amount_in_words = ?,
        notes = ?, status = ?, revision_count = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      invoice.customer_id, JSON.stringify(customer), req.user.userId,
      calc.subtotal, calc.discount_amount, calc.transport_hamali, calc.taxable_amount,
      calc.gst_percentage, calc.gst_amount, calc.grand_total, calc.amount_in_words,
      notes || null, invoice.status === 'generated' ? 'modified' : invoice.status, newRevision,
      req.params.id
    );

    // 3) Replace items
    db.prepare('DELETE FROM invoice_items WHERE invoice_id = ?').run(req.params.id);
    const insertItem = db.prepare(`
      INSERT INTO invoice_items (invoice_id, product_id, product_name, product_sku, description, unit,
        unit_price, quantity, discount_percent, discount_amount, line_amount, sort_order)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `);
    calc.items.forEach(item => {
      insertItem.run(parseInt(req.params.id), item.product_id, item.product_name, item.product_sku, item.description||null,
        item.unit, item.unit_price, item.quantity, item.discount_percent,
        item.discount_amount, item.line_amount, item.sort_order);
    });

    // Update customer if needed
    if (invoice.customer_id) {
      db.prepare(`UPDATE customers SET name=?,company=?,phone=?,email=?,billing_address=?,gstin=?,state=?,city=?,pincode=? WHERE id=?`)
        .run(customer.name, customer.company||null, customer.phone||null, customer.email||null,
             customer.billing_address||null, customer.gstin||null, customer.state||'Maharashtra', customer.city||null, customer.pincode||null, invoice.customer_id);
    }
  });

  editInvoice();

  createAuditLog(req, {
    action: 'INVOICE_UPDATE',
    entityType: 'invoice',
    entityId: parseInt(req.params.id),
    module: 'Invoice Management',
    details: {
      invoice_number: invoice.invoice_number,
      revision: newRevision,
      reason: reason || null,
    },
    oldValues: { grand_total: invoice.grand_total, discount_amount: invoice.discount_amount },
    newValues: { grand_total: calc.grand_total, discount_amount: calc.discount_amount },
  });

  res.json({
    success: true,
    message: `Invoice ${invoice.invoice_number} updated successfully (Revision ${newRevision}).`,
    invoice_number: invoice.invoice_number, // Same number — never changes
    revision: newRevision,
    ...calc,
  });
});

// PATCH /api/invoices/:id/status — Change invoice status
router.patch('/:id/status', requirePermission('invoices', 'change_status'), (req, res) => {
  const db = getDb();
  const { status, reason } = req.body;
  const validStatuses = ['draft', 'generated', 'modified', 'finalized', 'cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });

  const invoice = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
  if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found.' });

  // Only super_admin can finalize
  if (status === 'finalized' && req.user.role !== 'super_admin') {
    return res.status(403).json({ success: false, message: 'Only Super Admin can finalize invoices.' });
  }

  const oldStatus = invoice.status;
  db.prepare("UPDATE invoices SET status=?, updated_by=?, updated_at=datetime('now') WHERE id=?").run(status, req.user.userId, req.params.id);

  // Record revision for status change
  db.prepare(`
    INSERT INTO invoice_revisions (invoice_id, revision_number, changed_by, changed_by_name, change_type, field_name, old_value, new_value, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(parseInt(req.params.id), invoice.revision_count + 1, req.user.userId, req.user.name, 'STATUS_CHANGE', 'status', oldStatus, status, reason || null);

  db.prepare("UPDATE invoices SET revision_count = revision_count + 1 WHERE id = ?").run(req.params.id);

  createAuditLog(req, {
    action: 'INVOICE_STATUS_CHANGE',
    entityType: 'invoice',
    entityId: parseInt(req.params.id),
    module: 'Invoice Management',
    details: { invoice_number: invoice.invoice_number },
    oldValues: { status: oldStatus },
    newValues: { status },
  });

  res.json({ success: true, message: `Invoice marked as ${status}.` });
});

export default router;
