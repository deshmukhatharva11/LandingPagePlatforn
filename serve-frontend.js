import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
  console.error('[ERROR] The "dist" folder does not exist. Please run "npm run build" first.');
  process.exit(1);
}

// 301 Redirect for legacy /classic -> /
app.get(['/classic', '/classic/'], (req, res) => {
  res.redirect(301, '/');
});

// Explicit robots.txt and sitemap.xml handling
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(distPath, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(distPath, 'sitemap.xml'));
});

// Static assets with long-term caching
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true,
}));

// Other static files (favicons, images, videos)
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      // Do NOT cache HTML to ensure AI crawlers and bots get fresh noscript content
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// SPA Fallback: Any unknown route serves index.html for client-side routing
app.use((req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n==================================================`);
  console.log(`🚀 MR Interiors Frontend running on http://127.0.0.1:${PORT}`);
  console.log(`📡 Ready for Cloudflare Tunnel ingress`);
  console.log(`🔍 SPA Fallback & GEO/AEO headers active`);
  console.log(`==================================================\n`);
});
