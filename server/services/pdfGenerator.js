import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', '..', 'public', 'assets');

function getBase64Image(filename) {
  const filePath = path.join(publicDir, filename);
  if (!fs.existsSync(filePath)) return '';
  const ext = path.extname(filename).replace('.', '');
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:image/${mime};base64,${data}`;
}

function fmt(n) {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yy = String(dt.getFullYear()).slice(2);
  return `${dd}-${mm}-${yy}`;
}

const TERMS = [
  '01. Kindly note that the rates are variable as per the choice of the material and the changes in the rates of the materials this is only the approximate of the expenditure and not the exact cost.',
  '02. GST 18% extra on total basic amount.',
  '03. 20% Advance amt on booking.',
  '04. 60% payment upon dispatch of materials.',
  '05. 10% payment after installation on same day.',
  '06. 10% payment when work final.',
  '07. Transportation charges are added above , Mention as extra.',
];

let browserInstance = null;

async function getBrowser() {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }
  return browserInstance;
}

export async function generateInvoicePDF(data) {
  const img1 = getBase64Image('image1.jpeg');
  const img2 = getBase64Image('image2.png');
  const img3 = getBase64Image('image3.png');
  const img4 = getBase64Image('image4.png');
  const img5 = getBase64Image('image5.png');
  const img6 = getBase64Image('image6.jpeg');
  const img7 = getBase64Image('image7.png');
  const img8 = getBase64Image('image8.png');
  const qrImg = getBase64Image('qr_code.png');
  const sigImg = getBase64Image('signature.png');

  const c = data.customer || {};
  const items = data.items || [];

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      color: #111;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      line-height: 1.35;
      position: relative;
      padding-bottom: 85px;
    }

    /* ─── HEADER (Increased Image1.jpeg Height ONLY) ─── */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 215px;
      z-index: 100;
    }
    .header-bg {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 215px;
      object-fit: fill;
      z-index: 1;
    }
    
    /* GSTIN inside top upper golden part of PDF */
    .gstin-top-strip {
      position: absolute;
      top: 8px;
      right: 35px;
      z-index: 3;
      font-family: Georgia, serif;
      font-size: 14px;
      font-weight: bold;
      font-style: italic;
      color: #111111;
      letter-spacing: 0.5px;
    }

    .header-inner {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 40px 30px 0 0;
      height: 100%;
    }

    /* Logo shifted up and made bigger */
    .logo-area {
      flex-shrink: 0;
      width: 260px;
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 35px;
      margin-top: -55px;
    }
    .logo-area img {
      height: 140px;
      max-width: 220px;
      object-fit: contain;
    }

    /* Company info — right side with Playfair Display serif font */
    .company-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding-top: 4px;
      padding-right: 5px;
    }

    .company-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 21.5px;
      font-weight: 900;
      color: #000000;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 1.15;
      text-align: right;
    }
    .company-tagline {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px;
      font-weight: 900;
      color: #000000;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 6px;
      text-align: right;
    }

    /* Contacts — stacked line-by-line under company tagline */
    .contacts-stack {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: auto;
      gap: 3px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 7px;
      font-family: 'Poppins', sans-serif;
      font-size: 11.5px;
      font-weight: 500;
      color: #1a1a1a;
    }
    .contact-item img {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }
    .contact-item.email a {
      color: #1a0dab;
      text-decoration: underline;
    }

    /* ─── GOLD META BAR ─── */
    .gold-meta-bar-wrap {
      display: flex;
      justify-content: flex-end;
      padding-right: 28px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .gold-meta-bar {
      background: linear-gradient(90deg, #c59b27 0%, #d4af37 100%);
      color: #000000;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 22px;
      display: flex;
      align-items: center;
      border-radius: 2px;
      width: 420px;
      justify-content: space-between;
      white-space: nowrap;
    }
    .gold-meta-bar .lbl { font-weight: 600; }
    .gold-meta-bar .val { font-weight: 700; }

    /* ─── INVOICE INFO & BILL TO ─── */
    .info-section {
      padding: 4px 28px 4px;
    }

    /* Bill-to grid */
    .bill-grid {
      display: flex;
      gap: 20px;
      font-size: 11.5px;
    }
    .bill-col { flex: 1; }
    .bill-heading {
      font-weight: 700;
      font-size: 12.5px;
      margin-bottom: 6px;
      color: #111;
    }
    .bill-row {
      display: flex;
      margin-bottom: 3px;
    }
    .bill-lbl {
      font-weight: 700;
      width: 95px;
      flex-shrink: 0;
      font-size: 11px;
    }
    .bill-val {
      flex: 1;
      border-bottom: 1px dashed #aaa;
      padding-bottom: 1px;
      font-size: 11px;
    }

    /* ─── TABLE ─── */
    .table-wrap { padding: 6px 28px 6px; }
    table.inv-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    table.inv-table th {
      background: #1c1c1c;
      color: #fff;
      padding: 6px 5px;
      text-align: center;
      font-weight: 700;
      font-size: 11px;
      border: 1px solid #1c1c1c;
      white-space: nowrap;
    }
    table.inv-table td {
      padding: 5px 5px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
    table.inv-table tbody tr:nth-child(even) td { background: #f9f9f9; }
    .tc { text-align: center; }
    .tr { text-align: right; }
    .tl { text-align: left; }
    .fb { font-weight: 700; }

    .subtotal-row td {
      background: #eee !important;
      font-weight: 700;
      font-size: 11.5px;
      padding: 6px 5px;
    }

    /* ─── BOTTOM ─── */
    .bottom { padding: 6px 28px; page-break-inside: avoid; }
    .bottom-grid {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    /* Payment */
    .pay-box { width: 46%; font-size: 11px; }
    .pay-title { font-weight: 700; margin-bottom: 2px; font-size: 11.5px; }
    .upi-label { font-size: 10px; color: #444; }
    .upi-link {
      color: #1a0dab;
      font-weight: 700;
      text-decoration: underline;
      font-size: 11px;
      margin-bottom: 6px;
    }
    .qr-row { display: flex; align-items: center; gap: 12px; margin-top: 4px; }
    .qr-img {
      width: 105px; height: 105px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.12);
    }
    .badges { display: flex; flex-direction: column; gap: 5px; }
    .badge {
      border: 1.5px solid #ccc;
      border-radius: 14px;
      padding: 3px 12px;
      font-size: 10px;
      font-weight: 700;
      text-align: center;
      background: #fff;
    }
    .badge-pp { color: #5f259f; border-color: #5f259f; }
    .badge-upi { color: #0088cc; border-color: #0088cc; }
    .badge-gp { color: #4285f4; border-color: #4285f4; }

    /* Totals */
    .totals-box { width: 54%; }
    table.tot-table { width: 100%; border-collapse: collapse; font-size: 11px; }
    table.tot-table td { padding: 4px 8px; border-bottom: 1px solid #ddd; }
    table.tot-table .label-col { width: 55%; }
    table.tot-table .val-col { text-align: right; font-weight: 700; }
    .net-row td {
      background: #1c1c1c !important;
      color: #d4af37;
      font-size: 13px;
      font-weight: 700;
      border-bottom: none;
      padding: 6px 8px;
    }
    .words-block {
      text-align: center;
      margin-top: 5px;
      font-size: 10.5px;
    }
    .words-label { font-weight: 700; }
    .words-text { font-style: italic; color: #333; }

    /* ─── TERMS ─── */
    .terms-section {
      margin-top: 6px;
      border-top: 1.5px solid #ddd;
      padding-top: 5px;
    }
    .terms-heading {
      text-align: center;
      font-weight: 700;
      font-size: 11.5px;
      text-decoration: underline;
      margin-bottom: 3px;
      text-transform: uppercase;
    }
    .terms-body {
      font-size: 9.5px;
      line-height: 1.35;
      color: #222;
    }
    .term-line { margin-bottom: 1px; }

    /* ─── SIGNATURE ─── */
    .sig-wrap { display: flex; justify-content: flex-end; margin-top: 8px; }
    .sig-block { text-align: center; width: 220px; }
    .sig-label { font-size: 10.5px; font-weight: 700; margin-bottom: 2px; }
    .sig-img { height: 42px; object-fit: contain; margin: 1px 0; }
    .sig-name { font-size: 11.5px; font-weight: 700; letter-spacing: 2px; }

    /* ─── FOOTER (Matching User Reference Image Exactly) ─── */
    .footer {
      position: fixed;
      bottom: 0; left: 0;
      width: 100%;
      height: 85px;
      z-index: 100;
      background: white;
    }
    .footer-bg {
      position: absolute;
      bottom: 0; left: 0;
      width: 100%;
      height: 85px;
      object-fit: fill;
      z-index: 1;
    }
    .footer-inner {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: flex-start;
      gap: 35px;
      padding: 16px 25px 5px 25px;
    }
    
    .footer-address-wrap {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 11px;
      color: #111111;
      font-weight: 500;
      line-height: 1.35;
    }
    .footer-pin {
      width: 18px;
      height: 18px;
      object-fit: contain;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .footer-address-lines {
      display: flex;
      flex-direction: column;
      color: #111111;
    }

    .footer-phone-wrap {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 12.5px;
      font-weight: 700;
      color: #111111;
      padding-top: 2px;
    }
    .footer-phone-icon {
      width: 22px;
      height: 22px;
      object-fit: contain;
      flex-shrink: 0;
    }
  </style>
</head>
<body>

  <!-- ═══ HEADER ═══ -->
  <div class="header">
    ${img1 ? `<img src="${img1}" class="header-bg" />` : ''}
    <div class="gstin-top-strip">GSTIN- 27AGHPV7718B2Z5</div>
    
    <div class="header-inner">
      <div class="logo-area">
        ${img2 ? `<img src="${img2}" />` : ''}
      </div>
      <div class="company-area">
        <div class="company-name">MR TRADERS INTERIOR</div>
        <div class="company-tagline">DESIGNING &amp; FURNITURE</div>
        <div class="contacts-stack">
          <div class="contact-item email">
            ${img3 ? `<img src="${img3}" />` : '✉'}
            <a href="mailto:mrtradersofficial01@gmail.com">mrtradersofficial01@gmail.com</a>
          </div>
          <div class="contact-item">
            ${img4 ? `<img src="${img4}" />` : '📷'}
            <span>@mr_interiors.1</span>
          </div>
          <div class="contact-item">
            ${img5 ? `<img src="${img5}" />` : '📞'}
            <span>9028953853</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ FOOTER ═══ -->
  <div class="footer">
    ${img6 ? `<img src="${img6}" class="footer-bg" />` : ''}
    <div class="footer-inner">
      <div class="footer-address-wrap">
        ${img7 ? `<img src="${img7}" class="footer-pin" />` : ''}
        <div class="footer-address-lines">
          <div>MR Traders &amp; Factory Outlet,</div>
          <div>Nilgiri Baug, Sambhaji Nagar Road,</div>
          <div>Nandura Naka, Nashik-422003</div>
        </div>
      </div>
      <div class="footer-phone-wrap">
        ${img8 ? `<img src="${img8}" class="footer-phone-icon" />` : ''}
        <span>9028953854</span>
      </div>
    </div>
  </div>

  <table style="width: 100%; border: none; border-collapse: collapse; margin: 0; padding: 0;">
    <thead>
      <tr><td style="border: none; padding: 0; height: 215px;"></td></tr>
    </thead>
    <tbody>
      <tr><td style="border: none; padding: 0;">

  <!-- ═══ GOLD META BAR ═══ -->
  <div class="gold-meta-bar-wrap">
    <div class="gold-meta-bar">
      <div><span class="lbl">Invoice No:</span> <span class="val">${data.invoice_number || ''}</span></div>
      <div><span class="lbl">Date:</span> <span class="val">${fmtDate(data.invoice_date)}</span></div>
    </div>
  </div>

  <!-- ═══ INVOICE INFO ═══ -->
  <div class="info-section">
    <div class="bill-grid">
      <div class="bill-col">
        <div class="bill-heading">Invoice to:</div>
        <div class="bill-row"><span class="bill-lbl">Client Name:-</span><span class="bill-val">${c.name || ''}</span></div>
        <div class="bill-row"><span class="bill-lbl">Address:-</span><span class="bill-val">${c.billing_address || c.city || ''}</span></div>
        <div class="bill-row"><span class="bill-lbl">Email ID :-</span><span class="bill-val">${c.email || ''}</span></div>
        ${c.gstin ? `<div class="bill-row"><span class="bill-lbl">GSTIN :-</span><span class="bill-val">${c.gstin}</span></div>` : ''}
      </div>
      <div class="bill-col" style="padding-top: 18px;">
        <div class="bill-row"><span class="bill-lbl">Mo.No. :</span><span class="bill-val">${c.phone || ''}</span></div>
        <div class="bill-row"><span class="bill-lbl">Ex. Name :</span><span class="bill-val">${data.created_by_name || 'Admin'}</span></div>
      </div>
    </div>
  </div>

  <!-- ═══ ITEMS TABLE ═══ -->
  <div class="table-wrap">
    <table class="inv-table">
      <thead>
        <tr>
          <th style="width:36px;">SR<br>NO</th>
          <th>DESCRIPTION</th>
          <th style="width:45px;">QTY</th>
          <th style="width:55px;">SQ.FT.</th>
          <th style="width:55px;">UNITS</th>
          <th style="width:75px;">RATE</th>
          <th style="width:85px;">AMT</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item, idx) => `
          <tr>
            <td class="tc">${idx + 1}</td>
            <td class="tl fb">
              ${item.product_name}
              ${item.product_sku ? `<br><span style="font-weight:normal;color:#666;font-size:9px;">${item.product_sku}</span>` : ''}
            </td>
            <td class="tc">${item.quantity}</td>
            <td class="tc">${Number(item.quantity).toFixed(2)}</td>
            <td class="tc">${item.unit || 'Sq.Ft.'}</td>
            <td class="tr">₹ ${Number(item.unit_price).toLocaleString('en-IN')}</td>
            <td class="tr fb">₹ ${fmt(item.line_amount)}</td>
          </tr>
        `).join('')}
        <tr class="subtotal-row">
          <td colspan="6" class="tc fb">SUB TOTAL</td>
          <td class="tr fb">₹ ${fmt(data.subtotal)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ═══ BOTTOM ═══ -->
  <div class="bottom">
    <div class="bottom-grid">
      <!-- Payment -->
      <div class="pay-box">
        <div class="pay-title">Payment QR Code :</div>
        <div class="upi-label">UPI ID :</div>
        <div class="upi-link">shridevi.vishvakarma83@kotak
        </div>
        <div class="qr-row">
          ${qrImg ? `<img src="${qrImg}" class="qr-img" />` : ''}
          <div class="badges">
            <span class="badge badge-pp">PhonePe</span>
            <span class="badge badge-upi">UPI</span>
            <span class="badge badge-gp">G Pay</span>
          </div>
        </div>
      </div>

      <!-- Totals -->
      <div class="totals-box">
        <table class="tot-table">
          <tr><td class="label-col">TOTAL AMT</td><td class="val-col">₹ ${fmt(data.subtotal)}</td></tr>
          <tr><td>Disc.</td><td class="val-col">${data.discount_amount > 0 ? `₹ ${fmt(data.discount_amount)}` : '-'}</td></tr>
          <tr><td>Transport / Hamali</td><td class="val-col">${data.transport_hamali > 0 ? `₹ ${fmt(data.transport_hamali)}` : '-'}</td></tr>
          <tr><td>GST (${data.gst_percentage || 18}%)</td><td class="val-col">${data.gst_amount > 0 ? `₹ ${fmt(data.gst_amount)}` : '-'}</td></tr>
          <tr class="net-row"><td>Net Total</td><td class="val-col">₹ ${fmt(data.grand_total)}</td></tr>
        </table>
        <div class="words-block">
          <div class="words-label">Total Amt ( In Words )</div>
          <div class="words-text">${data.amount_in_words || 'Rupees Zero Only'}</div>
        </div>
      </div>
    </div>

    <!-- Terms -->
    <div class="terms-section">
      <div class="terms-heading">TERMS &amp; CONDITION</div>
      <div class="terms-body">
        ${TERMS.map(t => `<div class="term-line">${t}</div>`).join('')}
        ${data.notes ? `<div class="term-line" style="font-weight:700;margin-top:3px;">Note: ${data.notes}</div>` : ''}
      </div>
    </div>

    <!-- Signature -->
    <div class="sig-wrap">
      <div class="sig-block">
        <div class="sig-label">AUTHORISED SIGNATORY FOR</div>
        ${sigImg ? `<img src="${sigImg}" class="sig-img" />` : '<div style="height:42px;"></div>'}
        <div class="sig-name">M.R. TRADERS</div>
      </div>
    </div>
  </div>

      </td></tr>
    </tbody>
    <tfoot>
      <tr><td style="border: none; padding: 0; height: 95px;"></td></tr>
    </tfoot>
  </table>

</body>
</html>
  `;

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      preferCSSPageSize: true
    });
    return pdfBuffer;
  } finally {
    await page.close();
  }
}
