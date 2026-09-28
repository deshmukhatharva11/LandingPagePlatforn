import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { getDb } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import customerRoutes from './routes/customers.js';
import invoiceRoutes from './routes/invoices.js';
import dashboardRoutes from './routes/dashboard.js';
import userRoutes from './routes/users.js';
import auditRoutes from './routes/audit.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Initialize DB
getDb();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const allowedOrigins = [
  'https://portal.mrtraders.site',
  'https://mrtraders.site',
  'http://localhost:5173',
  'http://localhost:4173',
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, PHP proxy)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, true); // Allow all - PHP proxy handles security
  },
  credentials: true,
}));

// Rate limiting
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many login attempts. Please try again later.' } }));
app.use('/api/auth/change-password', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many password change attempts.' } }));
app.use('/api/users', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Extract client IP for all requests
app.use((req, _res, next) => {
  req.clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.socket?.remoteAddress
    || req.ip;
  next();
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);


// Global error handler — secure error responses (no stack traces, no internal details)
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? 'Something went wrong. Please try again.' : (err.message || 'Something went wrong.'),
  });
});

// Prevent silent crashes - log ALL unhandled errors
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', new Date().toISOString(), err.message, err.stack);
  // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', new Date().toISOString(), reason);
  // Don't exit - keep server running
});

// Keep the process alive even if event loop would drain
setInterval(() => {}, 1000 * 60 * 60); // heartbeat every hour

app.listen(PORT, () => {
  console.log(`\n🚀 MR Traders API Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/health\n`);
});
