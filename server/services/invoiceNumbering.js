import { getDb } from '../db.js';

export function generateInvoiceNumber() {
  const db = getDb();
  const year = new Date().getFullYear();

  const next = db.transaction(() => {
    const row = db.prepare('SELECT last_number FROM invoice_sequence WHERE year = ?').get(year);
    if (row) {
      db.prepare('UPDATE invoice_sequence SET last_number = last_number + 1 WHERE year = ?').run(year);
      return row.last_number + 1;
    } else {
      db.prepare('INSERT INTO invoice_sequence (year, last_number) VALUES (?, 1)').run(year);
      return 1;
    }
  });

  const num = next();
  return `MRT-${year}-${String(num).padStart(4, '0')}`;
}
