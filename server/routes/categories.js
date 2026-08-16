import express from 'express';
import { getDb } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { requireRole } from '../middleware/authorize.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const db = getDb();
  const cats = db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY name').all();
  res.json({ success: true, data: cats });
});

router.post('/', requireRole('admin'), (req, res) => {
  const db = getDb();
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Category name required.' });
  try {
    const result = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run(name, description || null);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch {
    res.status(409).json({ success: false, message: 'Category already exists.' });
  }
});

router.delete('/:id', requireRole('admin'), (req, res) => {
  const db = getDb();
  db.prepare('UPDATE categories SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Category deactivated.' });
});

export default router;
