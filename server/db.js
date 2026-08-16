import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const SEED_VERSION = '4.0'; // bump to force reseed

let db;

export function getDb() {
  if (!db) {
    db = new Database(path.join(dataDir, 'mrtrades.db'));
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    runMigrations();
    createIndexes();
    seedUsers();
    seedProducts();
    seedSettings();
  }
  return db;
}

// ─────────────────────────────────────────────────────────────────────
// SCHEMA DEFINITION
// ─────────────────────────────────────────────────────────────────────
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS seed_meta (key TEXT PRIMARY KEY, value TEXT);

    -- ═══ USERS (expanded for 3-role RBAC) ═══
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id TEXT UNIQUE,                      -- e.g. SA-001, ADM-001, EMP-001
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'employee',         -- super_admin | admin | employee
      mobile TEXT,
      department TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_by INTEGER REFERENCES users(id),
      last_login TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ CATEGORIES ═══
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ PRODUCTS ═══
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      category_id INTEGER REFERENCES categories(id),
      description TEXT,
      unit TEXT NOT NULL DEFAULT 'Sq.Ft.',
      selling_price REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_by INTEGER REFERENCES users(id),
      updated_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ PRODUCT PRICE HISTORY ═══
    CREATE TABLE IF NOT EXISTS product_price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id),
      old_price REAL NOT NULL,
      new_price REAL NOT NULL,
      changed_by INTEGER NOT NULL REFERENCES users(id),
      changed_by_name TEXT,
      reason TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ CUSTOMERS ═══
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      email TEXT,
      billing_address TEXT,
      gstin TEXT,
      state TEXT DEFAULT 'Maharashtra',
      city TEXT,
      pincode TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ INVOICES (expanded for revisions) ═══
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER REFERENCES customers(id),
      customer_snapshot TEXT NOT NULL,
      created_by INTEGER REFERENCES users(id),
      updated_by INTEGER REFERENCES users(id),
      invoice_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'generated',     -- draft | generated | modified | finalized | cancelled
      subtotal REAL NOT NULL DEFAULT 0,
      discount_amount REAL NOT NULL DEFAULT 0,
      transport_hamali REAL NOT NULL DEFAULT 0,
      taxable_amount REAL NOT NULL DEFAULT 0,
      gst_percentage REAL NOT NULL DEFAULT 18,
      gst_amount REAL NOT NULL DEFAULT 0,
      grand_total REAL NOT NULL DEFAULT 0,
      amount_in_words TEXT,
      notes TEXT,
      revision_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ INVOICE ITEMS ═══
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id),
      product_id INTEGER REFERENCES products(id),
      product_name TEXT NOT NULL,
      product_sku TEXT,
      description TEXT,
      unit TEXT NOT NULL DEFAULT 'Sq.Ft.',
      unit_price REAL NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      discount_percent REAL NOT NULL DEFAULT 0,
      discount_amount REAL NOT NULL DEFAULT 0,
      line_amount REAL NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    -- ═══ INVOICE REVISIONS (audit trail for invoice edits) ═══
    CREATE TABLE IF NOT EXISTS invoice_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL REFERENCES invoices(id),
      revision_number INTEGER NOT NULL,
      changed_by INTEGER NOT NULL REFERENCES users(id),
      changed_by_name TEXT,
      change_type TEXT NOT NULL,                     -- ITEM_CHANGE | DISCOUNT_CHANGE | CUSTOMER_CHANGE | STATUS_CHANGE | etc.
      field_name TEXT,
      old_value TEXT,
      new_value TEXT,
      reason TEXT,
      invoice_snapshot TEXT,                          -- full JSON snapshot of invoice state before change
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ INVOICE SEQUENCE ═══
    CREATE TABLE IF NOT EXISTS invoice_sequence (
      year INTEGER PRIMARY KEY,
      last_number INTEGER NOT NULL DEFAULT 0
    );

    -- ═══ AUDIT LOGS (expanded) ═══
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      user_name TEXT,
      employee_id TEXT,
      action TEXT NOT NULL,                          -- CREATE_INVOICE, UPDATE_PRODUCT, LOGIN, etc.
      entity_type TEXT,                              -- invoice, product, user, etc.
      entity_id INTEGER,
      module TEXT,                                    -- Invoice Management, Product Management, etc.
      details TEXT,                                   -- JSON with specifics
      old_values TEXT,                                -- JSON of previous state
      new_values TEXT,                                -- JSON of new state
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ LOGIN LOGS ═══
    CREATE TABLE IF NOT EXISTS login_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      user_name TEXT,
      employee_id TEXT,
      email TEXT,
      action TEXT NOT NULL,                          -- LOGIN_SUCCESS | LOGIN_FAILED | LOGOUT | SESSION_EXPIRED | PASSWORD_CHANGED
      ip_address TEXT,
      user_agent TEXT,
      status TEXT NOT NULL DEFAULT 'success',        -- success | failed
      failure_reason TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- ═══ SYSTEM SETTINGS ═══
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_by INTEGER REFERENCES users(id),
      updated_at TEXT DEFAULT (datetime('now'))
    );

  `);
}

// ─────────────────────────────────────────────────────────────────────
// INDEXES — Run AFTER migrations so new columns exist
// ─────────────────────────────────────────────────────────────────────
function createIndexes() {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
    CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_login_logs_created ON login_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_invoice_revisions_invoice ON invoice_revisions(invoice_id);
    CREATE INDEX IF NOT EXISTS idx_product_price_history_product ON product_price_history(product_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
  `);
}

// ─────────────────────────────────────────────────────────────────────
// MIGRATIONS (upgrade existing DBs without data loss)
// ─────────────────────────────────────────────────────────────────────
function runMigrations() {
  // --- Users table migrations ---
  const userCols = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);

  if (!userCols.includes('employee_id')) {
    db.prepare("ALTER TABLE users ADD COLUMN employee_id TEXT").run();
    console.log('✅ Migration: added employee_id to users');
  }
  if (!userCols.includes('mobile')) {
    db.prepare("ALTER TABLE users ADD COLUMN mobile TEXT").run();
    console.log('✅ Migration: added mobile to users');
  }
  if (!userCols.includes('department')) {
    db.prepare("ALTER TABLE users ADD COLUMN department TEXT").run();
    console.log('✅ Migration: added department to users');
  }
  if (!userCols.includes('created_by')) {
    db.prepare("ALTER TABLE users ADD COLUMN created_by INTEGER REFERENCES users(id)").run();
    console.log('✅ Migration: added created_by to users');
  }
  if (!userCols.includes('last_login')) {
    db.prepare("ALTER TABLE users ADD COLUMN last_login TEXT").run();
    console.log('✅ Migration: added last_login to users');
  }

  // --- Invoices table migrations ---
  const invCols = db.prepare("PRAGMA table_info(invoices)").all().map(c => c.name);
  if (!invCols.includes('gst_percentage')) {
    db.prepare("ALTER TABLE invoices ADD COLUMN gst_percentage REAL NOT NULL DEFAULT 18").run();
    console.log('✅ Migration: added gst_percentage to invoices');
  }
  if (!invCols.includes('revision_count')) {
    db.prepare("ALTER TABLE invoices ADD COLUMN revision_count INTEGER NOT NULL DEFAULT 0").run();
    console.log('✅ Migration: added revision_count to invoices');
  }
  if (!invCols.includes('updated_by')) {
    db.prepare("ALTER TABLE invoices ADD COLUMN updated_by INTEGER REFERENCES users(id)").run();
    console.log('✅ Migration: added updated_by to invoices');
  }

  // --- Audit logs table migrations ---
  const auditCols = db.prepare("PRAGMA table_info(audit_logs)").all().map(c => c.name);
  if (!auditCols.includes('employee_id')) {
    db.prepare("ALTER TABLE audit_logs ADD COLUMN employee_id TEXT").run();
    console.log('✅ Migration: added employee_id to audit_logs');
  }
  if (!auditCols.includes('module')) {
    db.prepare("ALTER TABLE audit_logs ADD COLUMN module TEXT").run();
    console.log('✅ Migration: added module to audit_logs');
  }
  if (!auditCols.includes('old_values')) {
    db.prepare("ALTER TABLE audit_logs ADD COLUMN old_values TEXT").run();
    console.log('✅ Migration: added old_values to audit_logs');
  }
  if (!auditCols.includes('new_values')) {
    db.prepare("ALTER TABLE audit_logs ADD COLUMN new_values TEXT").run();
    console.log('✅ Migration: added new_values to audit_logs');
  }
  if (!auditCols.includes('ip_address')) {
    db.prepare("ALTER TABLE audit_logs ADD COLUMN ip_address TEXT").run();
    console.log('✅ Migration: added ip_address to audit_logs');
  }
  if (!auditCols.includes('user_agent')) {
    db.prepare("ALTER TABLE audit_logs ADD COLUMN user_agent TEXT").run();
    console.log('✅ Migration: added user_agent to audit_logs');
  }

  // --- Products table migrations ---
  const prodCols = db.prepare("PRAGMA table_info(products)").all().map(c => c.name);
  if (!prodCols.includes('created_by')) {
    db.prepare("ALTER TABLE products ADD COLUMN created_by INTEGER REFERENCES users(id)").run();
    console.log('✅ Migration: added created_by to products');
  }
  if (!prodCols.includes('updated_by')) {
    db.prepare("ALTER TABLE products ADD COLUMN updated_by INTEGER REFERENCES users(id)").run();
    console.log('✅ Migration: added updated_by to products');
  }

  // --- Customers table migrations ---
  const custCols = db.prepare("PRAGMA table_info(customers)").all().map(c => c.name);
  if (!custCols.includes('created_by')) {
    db.prepare("ALTER TABLE customers ADD COLUMN created_by INTEGER REFERENCES users(id)").run();
    console.log('✅ Migration: added created_by to customers');
  }

  // Upgrade old 'admin' role to 'super_admin' and 'staff' to 'employee'
  db.prepare("UPDATE users SET role = 'employee' WHERE role = 'staff'").run();
}

// ─────────────────────────────────────────────────────────────────────
// EMPLOYEE ID GENERATOR
// ─────────────────────────────────────────────────────────────────────
export function generateEmployeeId(role) {
  const prefix = role === 'super_admin' ? 'SA' : role === 'admin' ? 'ADM' : 'EMP';
  const lastUser = db.prepare(
    "SELECT employee_id FROM users WHERE employee_id LIKE ? ORDER BY id DESC LIMIT 1"
  ).get(`${prefix}-%`);

  let nextNum = 1;
  if (lastUser?.employee_id) {
    const parts = lastUser.employee_id.split('-');
    nextNum = parseInt(parts[parts.length - 1], 10) + 1;
  }
  return `${prefix}-${String(nextNum).padStart(3, '0')}`;
}

// ─────────────────────────────────────────────────────────────────────
// SEED USERS
// ─────────────────────────────────────────────────────────────────────
function seedUsers() {
  // Super Admin
  const sa = db.prepare("SELECT id FROM users WHERE email = ?").get('superadmin@mrtraders.site');
  if (!sa) {
    const hash = bcrypt.hashSync('SuperAdmin@123', 12);
    const empId = generateEmployeeId('super_admin');
    db.prepare(`INSERT INTO users (employee_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`)
      .run(empId, 'Super Admin', 'superadmin@mrtraders.site', hash, 'super_admin');
    console.log(`✅ Super Admin created: superadmin@mrtraders.site / SuperAdmin@123 [${empId}]`);
  }

  // Assign employee_id to existing super_admin users that don't have one
  const saUsers = db.prepare("SELECT id FROM users WHERE role = 'super_admin' AND employee_id IS NULL").all();
  for (const u of saUsers) {
    const empId = generateEmployeeId('super_admin');
    db.prepare("UPDATE users SET employee_id = ? WHERE id = ?").run(empId, u.id);
    console.log(`✅ Assigned employee_id ${empId} to existing super_admin user ${u.id}`);
  }

  // Demo Admin
  const adm = db.prepare("SELECT id FROM users WHERE email = ?").get('admin@mrtraders.site');
  if (!adm) {
    const hash = bcrypt.hashSync('Admin@123', 12);
    const empId = generateEmployeeId('admin');
    db.prepare(`INSERT INTO users (employee_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`)
      .run(empId, 'Admin User', 'admin@mrtraders.site', hash, 'admin');
    console.log(`✅ Demo Admin created: admin@mrtraders.site / Admin@123 [${empId}]`);
  }

  // Demo Employee
  const emp = db.prepare("SELECT id FROM users WHERE email = ?").get('employee@mrtraders.site');
  if (!emp) {
    const hash = bcrypt.hashSync('Employee@123', 12);
    const empId = generateEmployeeId('employee');
    db.prepare(`INSERT INTO users (employee_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`)
      .run(empId, 'Employee User', 'employee@mrtraders.site', hash, 'employee');
    console.log(`✅ Demo Employee created: employee@mrtraders.site / Employee@123 [${empId}]`);
  }

  // Assign employee_ids to any remaining users without one
  const noIdUsers = db.prepare("SELECT id, role FROM users WHERE employee_id IS NULL").all();
  for (const u of noIdUsers) {
    const empId = generateEmployeeId(u.role);
    db.prepare("UPDATE users SET employee_id = ? WHERE id = ?").run(empId, u.id);
    console.log(`✅ Assigned employee_id ${empId} to user ${u.id}`);
  }
}

// ─────────────────────────────────────────────────────────────────────
// SEED SETTINGS
// ─────────────────────────────────────────────────────────────────────
function seedSettings() {
  const defaults = [
    { key: 'invoice_prefix', value: 'MRT', description: 'Prefix for invoice numbers' },
    { key: 'invoice_year_reset', value: 'true', description: 'Reset invoice sequence each year' },
    { key: 'employee_can_edit_invoice', value: 'true', description: 'Allow employees to edit their own invoices' },
    { key: 'employee_can_apply_discount', value: 'true', description: 'Allow employees to apply discounts' },
    { key: 'max_discount_percent', value: '20', description: 'Maximum discount percentage allowed' },
    { key: 'gst_percentage', value: '18', description: 'Default GST percentage' },
    { key: 'company_name', value: 'MR Traders Interior Designing & Furniture', description: 'Company name' },
    { key: 'company_gstin', value: '27AGHPV7718B2Z5', description: 'Company GSTIN' },
    { key: 'company_phone', value: '9423640903', description: 'Company phone' },
    { key: 'company_email', value: 'mrtradersofficial01@gmail.com', description: 'Company email' },
  ];

  const insert = db.prepare(
    "INSERT OR IGNORE INTO system_settings (key, value, description) VALUES (?, ?, ?)"
  );
  for (const s of defaults) insert.run(s.key, s.value, s.description);
}

// ─────────────────────────────────────────────────────────────────────
// SEED PRODUCTS (from Rate Chart)
// ─────────────────────────────────────────────────────────────────────
function seedProducts() {
  const meta = db.prepare("SELECT value FROM seed_meta WHERE key = 'product_version'").get();
  if (meta?.value === SEED_VERSION) return; // already seeded this version

  // Check if products are referenced by invoices — if so, skip destructive reseed
  const hasInvoiceItems = db.prepare("SELECT COUNT(*) as cnt FROM invoice_items").get().cnt;
  const hasProducts = db.prepare("SELECT COUNT(*) as cnt FROM products").get().cnt;
  if (hasInvoiceItems > 0 && hasProducts > 0) {
    // Mark as current version without destructive reseed
    db.prepare("INSERT OR REPLACE INTO seed_meta (key, value) VALUES ('product_version', ?)").run(SEED_VERSION);
    console.log('⏭️  Skipped product reseed (existing products referenced by invoices)');
    return;
  }

  console.log('🔄 Reseeding products from Rate Chart...');

  // Clear existing catalog (safe — no invoice references)
  db.prepare("DELETE FROM products").run();
  db.prepare("DELETE FROM categories").run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name='products'").run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name='categories'").run();

  // ──────────────────────────────────────────────────────────────────
  // CATEGORIES
  // ──────────────────────────────────────────────────────────────────
  const cats = ['Kitchen', 'Bedroom', 'Livingroom'];
  const insertCat = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
  for (const c of cats) insertCat.run(c);
  const catMap = {};
  db.prepare("SELECT id, name FROM categories").all().forEach(r => { catMap[r.name] = r.id; });

  // ──────────────────────────────────────────────────────────────────
  // PRODUCTS — Rate_Chart.pdf (verified from images)
  // ──────────────────────────────────────────────────────────────────
  const products = [
    // ── KITCHEN ──────────────────────────────────────────────────────
    { no:'KT-001', name:'Ss Kitchen Trolly Hettich Channel',                         cat:'Kitchen',    unit:'R.Ft.',  price:3500  },
    { no:'KT-002', name:'Plain Laminate (1000 Colour Options)',                       cat:'Kitchen',    unit:'Sq.Ft.', price:750   },
    { no:'KT-003', name:'High Glossy Laminate (500 Colour Options)',                  cat:'Kitchen',    unit:'Sq.Ft.', price:850   },
    { no:'KT-004', name:'1.5MM Acrylic (100 Colour Options)',                         cat:'Kitchen',    unit:'Sq.Ft.', price:1000  },
    { no:'KT-005', name:'2MM Acrylic Customize Colour Options',                       cat:'Kitchen',    unit:'Sq.Ft.', price:1350  },
    { no:'KT-006', name:'Kitchen Open Box Hight 8" Depth 7"',                         cat:'Kitchen',    unit:'Sq.Ft.', price:1200  },
    { no:'KT-007', name:'Kitchen Cabinate Plain Laminate Depth 12"',                  cat:'Kitchen',    unit:'Sq.Ft.', price:1650  },
    { no:'KT-008', name:'Kitchen Cabinate HG+ Laminate Depth 12"',                    cat:'Kitchen',    unit:'Sq.Ft.', price:1750  },
    { no:'KT-009', name:'Kitchen Cabinate 1.5MM Acrylic Depth 12"',                   cat:'Kitchen',    unit:'Sq.Ft.', price:1900  },
    { no:'KT-010', name:'Kitchen Cabinate 2MM Acrylic Depth 12"',                     cat:'Kitchen',    unit:'Sq.Ft.', price:2350  },
    { no:'KT-011', name:'Kitchen Cabinate Black Tinted 12" Depth',                    cat:'Kitchen',    unit:'Sq.Ft.', price:2350  },
    { no:'KT-012', name:'Kitchen Cabinate Silver Profile 12" Depth',                  cat:'Kitchen',    unit:'Sq.Ft.', price:1150  },
    { no:'KT-013', name:'Kitchen Loft With Box Plain Laminate Depth 16"',             cat:'Kitchen',    unit:'Sq.Ft.', price:1850  },
    { no:'KT-014', name:'Kitchen Loft With Box HG+ Laminate Depth 16"',               cat:'Kitchen',    unit:'Sq.Ft.', price:1850  },
    { no:'KT-015', name:'Kitchen Loft With Box 1.5MM Acrylic Laminate Depth 16"',     cat:'Kitchen',    unit:'Sq.Ft.', price:1900  },
    { no:'KT-016', name:'Kitchen Loft With Box 2MM Acrylic Laminate Depth 16"',       cat:'Kitchen',    unit:'Sq.Ft.', price:2350  },
    { no:'KT-017', name:'Storage Unit Plain Laminate Depth 16"/18"/20"/24"',           cat:'Kitchen',    unit:'Sq.Ft.', price:1850  },
    { no:'KT-018', name:'Storage Unit HG+ Laminate Depth 16"/18"/20"/24"',             cat:'Kitchen',    unit:'Sq.Ft.', price:1900  },
    { no:'KT-019', name:'Storage Unit 1.5MM Acrylic Laminate Depth 16"/18"/20"/24"',  cat:'Kitchen',    unit:'Sq.Ft.', price:2000  },
    { no:'KT-020', name:'Storage Unit 2MM Acrylic Laminate Depth 16"/18"/20"/24"',    cat:'Kitchen',    unit:'Sq.Ft.', price:2400  },
    { no:'KT-021', name:'Kitchen Handle 4 Colour Top Edge',                            cat:'Kitchen',    unit:'Inch',   price:40    },
    { no:'KT-022', name:'Kitchen Handle Pull Grip 4 Colour',                           cat:'Kitchen',    unit:'Inch',   price:45    },
    { no:'KT-023', name:'Kitchen Handle 8" x 6" Standard',                             cat:'Kitchen',    unit:'Nos.',   price:200   },
    { no:'KT-024', name:'Hydrolic Pump 10KG Ebco Brand',                               cat:'Kitchen',    unit:'Pair',   price:1050  },
    { no:'KT-025', name:'Led Light 36" Length',                                        cat:'Kitchen',    unit:'Nos.',   price:3400  },
    { no:'KT-026', name:'Modular Dustbin Excellenza Brand',                            cat:'Kitchen',    unit:'Nos.',   price:5400  },
    { no:'KT-027', name:'Steam Cutlory Spacer Brand',                                  cat:'Kitchen',    unit:'Nos.',   price:5450  },
    { no:'KT-028', name:'Tandem Thali Standard 304 Jindal Brand',                      cat:'Kitchen',    unit:'Nos.',   price:4450  },
    { no:'KT-029', name:'Detergent Holder 202 Jindal Brand',                           cat:'Kitchen',    unit:'Nos.',   price:900   },
    { no:'KT-030', name:'Kitchen Cabinate Black Profile Depth 12"',                    cat:'Kitchen',    unit:'Sq.Ft.', price:2225  },
    { no:'KT-031', name:'Chimney Panel + HG + Laminate Hydrolic Pump',                 cat:'Kitchen',    unit:'Nos.',   price:5100  },
    { no:'KT-032', name:'Folding Dining Top Only Thickness 1.5"',                      cat:'Kitchen',    unit:'Sq.Ft.', price:1150  },
    { no:'KT-033', name:'Folding Dining Small Channel 18"',                            cat:'Kitchen',    unit:'Nos.',   price:3950  },
    { no:'KT-034', name:'Folding Dining Big Channel 36"',                              cat:'Kitchen',    unit:'Nos.',   price:6450  },
    { no:'KT-035', name:'SS Wheel Trolly 305 Jindal Brand 2 Layer',                    cat:'Kitchen',    unit:'Nos.',   price:5450  },
    { no:'KT-036', name:'SS Wheel Trolly 304 Jindal Brand 3 Layer',                    cat:'Kitchen',    unit:'Nos.',   price:6450  },
    { no:'KT-037', name:'Telescope Soft Close Channel Hettich Brand',                  cat:'Kitchen',    unit:'Nos.',   price:1900  },
    { no:'KT-038', name:'SS Steel Trolly Only 304 Jindal Brand No Channel',            cat:'Kitchen',    unit:'R.Ft.',  price:5245  },
    { no:'KT-039', name:'Kitchen Pantry Unit 2" x 7" Spacer Brand',                   cat:'Kitchen',    unit:'Nos.',   price:64000 },
    { no:'KT-040', name:'Kitchen Rolling Unit 2" x 4" Spacer Brand + Light + Sliding Key', cat:'Kitchen', unit:'Nos.', price:32450 },
    { no:'KT-041', name:'Tandem Drawer Hettich Brand',                                 cat:'Kitchen',    unit:'Nos.',   price:12000 },
    { no:'KT-042', name:'Tandem Drawer Excellenza Brand',                              cat:'Kitchen',    unit:'Nos.',   price:10550 },
    { no:'KT-043', name:'Tandem Drawer Spacer Brand',                                  cat:'Kitchen',    unit:'Nos.',   price:10000 },
    { no:'KT-044', name:'Wicker Basket Spacer Brand (4")',                             cat:'Kitchen',    unit:'Nos.',   price:5500  },
    { no:'KT-045', name:'Quadra Channel Soft Close Non Brand',                         cat:'Kitchen',    unit:'Nos.',   price:3450  },
    { no:'KT-046', name:'Microwave Stand',                                             cat:'Kitchen',    unit:'Nos.',   price:3450  },
    { no:'KT-047', name:'Kitchen Shelf Only BWP Ply',                                  cat:'Kitchen',    unit:'Sq.Ft.', price:600   },
    { no:'KT-048', name:'Detergent Pull Out 304 Jindal Brand 2 Layer (Hettich Channel)', cat:'Kitchen', unit:'Nos.',   price:7400  },
    { no:'KT-049', name:'Folding Dining Table Back Storage + Light Point',             cat:'Kitchen',    unit:'Sq.Ft.', price:2050  },

    // ── BEDROOM ───────────────────────────────────────────────────────
    { no:'BD-001', name:'Wardrobe Hidden Locker (Depends on Design)',                  cat:'Bedroom',    unit:'Nos.',   price:5900  },
    { no:'BD-002', name:'Wardrobe Black Tinted',                                       cat:'Bedroom',    unit:'Sq.Ft.', price:2750  },
    { no:'BD-003', name:'Wardrobe 1.5MM Acrylic',                                      cat:'Bedroom',    unit:'Sq.Ft.', price:2450  },
    { no:'BD-004', name:'Wardrobe 2MM Acrylic',                                        cat:'Bedroom',    unit:'Sq.Ft.', price:2950  },
    { no:'BD-005', name:'Dressing Table BWR Ply + Light Point',                        cat:'Bedroom',    unit:'Sq.Ft.', price:2050  },
    { no:'BD-006', name:'Bed Side Table BWR 18" x 18"',                               cat:'Bedroom',    unit:'Nos.',   price:5500  },
    { no:'BD-007', name:'Mirror Only',                                                  cat:'Bedroom',    unit:'Nos.',   price:2950  },
    { no:'BD-008', name:'Wardrobe Loft Door Only HG + Laminate',                       cat:'Bedroom',    unit:'Sq.Ft.', price:850   },
    { no:'BD-009', name:'Bed With Back Rest Hydrolic Storage',                          cat:'Bedroom',    unit:'Sq.Ft.', price:1750  },
    { no:'BD-010', name:'Wardrobe Drawer Extra + Quadro Channel',                      cat:'Bedroom',    unit:'Nos.',   price:7950  },
    { no:'BD-011', name:'Bed Back Cusion (Depends on Back Panel Size)',                 cat:'Bedroom',    unit:'Nos.',   price:6450  },
    { no:'BD-012', name:'Wardrobe BWR',                                                 cat:'Bedroom',    unit:'Sq.Ft.', price:2100  },
    { no:'BD-013', name:'Bedroom Door Latch Lock + Frame',                             cat:'Bedroom',    unit:'Nos.',   price:25000 },
    { no:'BD-014', name:'Bedroom Door Laminate Change Only',                           cat:'Bedroom',    unit:'Nos.',   price:10000 },
    { no:'BD-015', name:'Wall Mounted Bed 5" x 6" Size Fix No Storage',               cat:'Bedroom',    unit:'Nos.',   price:67000 },
    { no:'BD-016', name:'Study Table (Depends on Design + Light Point)',               cat:'Bedroom',    unit:'Sq.Ft.', price:1550  },

    // ── LIVINGROOM ────────────────────────────────────────────────────
    { no:'LV-001', name:'Bharity Baithak Mattress + Pillow (Depth 27" Height 12")',   cat:'Livingroom', unit:'R.Ft.',  price:4400  },
    { no:'LV-002', name:'Sofa Cum Bed Full Cusion No Storage',                         cat:'Livingroom', unit:'R.Ft.',  price:6000  },
    { no:'LV-003', name:'Living Main Door Laminate Change Only',                       cat:'Livingroom', unit:'Nos.',   price:11000 },
    { no:'LV-004', name:'TV Unit Depends on Design (Light Part Including)',            cat:'Livingroom', unit:'Sq.Ft.', price:1500  },
    { no:'LV-005', name:'Sofa With Storage Cusion + Pillow',                           cat:'Livingroom', unit:'R.Ft.',  price:6000  },
    { no:'LV-006', name:'Sofa Full Cusion Pillow',                                     cat:'Livingroom', unit:'R.Ft.',  price:5000  },
    { no:'LV-007', name:'Sofa Cum Bed Ply With Storage',                               cat:'Livingroom', unit:'R.Ft.',  price:4500  },
    { no:'LV-008', name:'Puffy Full Cusion',                                            cat:'Livingroom', unit:'Nos.',   price:4000  },
    { no:'LV-009', name:'Puffy With Storage Ply Material',                             cat:'Livingroom', unit:'Nos.',   price:5000  },
    { no:'LV-010', name:'Partition Ply Material + Light Point',                        cat:'Livingroom', unit:'Sq.Ft.', price:1800  },
    { no:'LV-011', name:'Partition Glass Material + Light Point',                      cat:'Livingroom', unit:'Sq.Ft.', price:1800  },
    { no:'LV-012', name:'Partition CNC Material + Light Point',                        cat:'Livingroom', unit:'Sq.Ft.', price:1500  },
    { no:'LV-013', name:'Washroom Cabinate Mirror Profile Door (Depth 7")',            cat:'Livingroom', unit:'Sq.Ft.', price:1800  },
    { no:'LV-014', name:'Safety Door Paneling (Depends on Design)',                    cat:'Livingroom', unit:'Sq.Ft.', price:1200  },
    { no:'LV-015', name:'Artificial Grass 25MM',                                       cat:'Livingroom', unit:'Sq.Ft.', price:700   },
    { no:'LV-016', name:'Centre Table Standard',                                       cat:'Livingroom', unit:'Nos.',   price:20000 },
    { no:'LV-017', name:'Window Pelmatting 7" Height Customize',                      cat:'Livingroom', unit:'Sq.Ft.', price:1200  },
    { no:'LV-018', name:'Wall Paneling (Depend on Design)',                            cat:'Livingroom', unit:'Sq.Ft.', price:1150  },
    { no:'LV-019', name:'Mandir No Door (Depend on Design)',                           cat:'Livingroom', unit:'Sq.Ft.', price:1600  },
    { no:'LV-020', name:'Safety Door: Handle + Lock + Frame + Jali + Net',            cat:'Livingroom', unit:'Nos.',   price:35000 },
    { no:'LV-021', name:'Living Main Door Frame + Handle + Basic Lock',               cat:'Livingroom', unit:'Nos.',   price:33000 },
    { no:'LV-022', name:'Mandir With Door (Depend on Design)',                         cat:'Livingroom', unit:'Sq.Ft.', price:2100  },
    { no:'LV-023', name:'Seating Storage Diwan Mattress + Pillow (Depth 16" Hight 20")', cat:'Livingroom', unit:'R.Ft.', price:6000 },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, sku, category_id, unit, selling_price, status)
    VALUES (?, ?, ?, ?, ?, 'active')
  `);

  const doSeed = db.transaction(() => {
    for (const p of products) {
      insertProduct.run(p.name, p.no, catMap[p.cat] || null, p.unit, p.price);
    }
  });
  doSeed();

  // Mark version
  db.prepare("INSERT OR REPLACE INTO seed_meta (key, value) VALUES ('product_version', ?)").run(SEED_VERSION);
  console.log(`✅ Seeded ${products.length} products (Kitchen: 49, Bedroom: 16, Livingroom: 23)`);
}
