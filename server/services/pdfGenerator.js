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

export function generateInvoiceHTML(data) {
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

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.invoice_number || 'Invoice'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      width: 210mm;
      min-height: 297mm;
      background: #ffffff;
      color: #111;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      line-height: 1.35;
      position: relative;
      margin: 0 auto;
      padding: 0;
      overflow: hidden;
    }

    .page-container {
      width: 210mm;
      min-height: 297mm;
      position: relative;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* ─── HEADER ─── */
    .header {
      position: relative;
      width: 100%;
      height: 215px;
      overflow: hidden;
    }
    .header-bg {
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 215px;
      object-fit: fill;
      z-index: 1;
    }
    
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
      width: 100%;
      height: 140px;
      max-width: 220px;
      object-fit: contain;
    }

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

    /* ─── MAIN CONTENT ─── */
    .main-body {
      flex: 1;
      padding: 0;
    }

    /* ─── GOLD META BAR ─── */
    .gold-meta-bar-wrap {
      display: flex;
      justify-content: flex-end;
      padding-right: 28px;
      margin-top: 5px;
      margin-bottom: 8px;
    }
    .gold-meta-bar {
      background: linear-gradient(90deg, #c59b27 0%, #d4af37 100%) !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color: #000000 !important;
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
      background: #1c1c1c !important;
      color: #fff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
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
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      font-weight: 700;
      font-size: 11.5px;
      padding: 6px 5px;
    }

    /* ─── BOTTOM ─── */
    .bottom { padding: 6px 28px; }
    .bottom-grid {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      margin-bottom: 8px;
    }

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
      width: 80px;
      height: 80px;
      object-fit: contain;
      border: 1px solid #eee;
    }
    .badges { display: flex; flex-direction: column; gap: 4px; }
    .badge {
      display: inline-block;
      padding: 2px 14px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
      text-align: center;
      border: 1.5px solid;
    }
    .badge-pp { color: #5f259f; border-color: #5f259f; background: #fff; }
    .badge-upi { color: #0078d4; border-color: #0078d4; background: #fff; }
    .badge-gp { color: #1a73e8; border-color: #1a73e8; background: #fff; }

    .totals-box { width: 48%; margin-left: auto; }
    table.tot-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
    }
    table.tot-table td {
      padding: 3px 0;
      border: none;
    }
    table.tot-table .label-col { font-weight: 700; }
    table.tot-table .val-col { text-align: right; font-weight: 700; }
    table.tot-table .net-row td {
      background: linear-gradient(90deg, #c59b27 0%, #d4af37 100%) !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color: #000000 !important;
      font-weight: 800;
      font-size: 12.5px;
      padding: 5px 8px;
    }

    .words-block {
      text-align: center;
      margin-top: 6px;
      font-size: 10.5px;
    }
    .words-label { font-weight: 700; font-size: 11px; }
    .words-text { font-style: italic; color: #333; font-size: 10.5px; }

    .terms-section {
      margin-top: 4px;
      margin-bottom: 6px;
    }
    .terms-heading {
      font-weight: 700;
      text-decoration: underline;
      font-size: 11px;
      margin-bottom: 3px;
      text-align: center;
    }
    .terms-body {
      font-size: 8.5px;
      line-height: 1.35;
      color: #222;
    }
    .term-line { margin-bottom: 1.5px; }

    .sig-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 6px;
      margin-bottom: 4px;
    }
    .sig-block {
      text-align: center;
      width: 220px;
    }
    .sig-label {
      font-weight: 700;
      font-size: 10.5px;
      color: #111;
      margin-bottom: 2px;
    }
    .sig-img {
      height: 35px;
      max-width: 140px;
      object-fit: contain;
      margin: 2px auto;
      display: block;
    }
    .sig-name {
      font-weight: 800;
      font-size: 11.5px;
      color: #111;
      letter-spacing: 0.5px;
    }

    /* ─── FOOTER ─── */
    .footer {
      position: relative;
      width: 100%;
      height: 95px;
      overflow: hidden;
      margin-top: auto;
    }
    .footer-bg {
      position: absolute;
      bottom: 0; left: 0;
      width: 100%;
      height: 95px;
      object-fit: fill;
      z-index: 1;
    }
    .footer-inner {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: flex-end;
      padding: 0 28px 12px 28px;
      height: 100%;
      justify-content: flex-start;
      gap: 30px;
    }
    .footer-address-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 10.5px;
      color: #1a1a1a;
      line-height: 1.25;
      max-width: 280px;
    }
    .footer-address-lines {
      font-family: 'Poppins', sans-serif;
      font-size: 10.5px;
      font-weight: 600;
      color: #111;
    }
    .footer-address-wrap img {
      width: 16px;
      height: 16px;
      object-fit: contain;
      flex-shrink: 0;
    }
    .footer-phone-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #111;
    }
    .footer-phone-wrap img {
      width: 18px;
      height: 18px;
      object-fit: contain;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- ═══ 1. HEADER AT TOP ═══ -->
    <div class="header">
      ${img1 ? `<img src="${img1}" class="header-bg" />` : ''}
      <div class="gstin-top-strip">GSTIN- 27AGHPV7718B2Z5</div>
      <div class="header-inner">
        <div class="logo-area">
          ${img7 ? `<img src="${img7}" alt="MR TRADERS" />` : ''}
        </div>
        <div class="company-area">
          <div class="company-name">MR TRADERS INTERIOR</div>
          <div class="company-tagline">DESIGNING &amp; FURNITURE</div>
          <div class="contacts-stack">
            <div class="contact-item email">
              ${img2 ? `<img src="${img2}" />` : ''}
              <a href="mailto:mrtradersofficial01@gmail.com">mrtradersofficial01@gmail.com</a>
            </div>
            <div class="contact-item">
              ${img3 ? `<img src="${img3}" />` : ''}
              <span>@mr__interiors .1</span>
            </div>
            <div class="contact-item">
              ${img4 ? `<img src="${img4}" />` : ''}
              <span>9028953853</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 2. MAIN CONTENT IN MIDDLE ═══ -->
    <div class="main-body">
      <!-- Gold Meta Bar -->
      <div class="gold-meta-bar-wrap">
        <div class="gold-meta-bar">
          <div><span class="lbl">Invoice No: </span><span class="val">${data.invoice_number || ''}</span></div>
          <div><span class="lbl">Date: </span><span class="val">${fmtDate(data.created_at)}</span></div>
        </div>
      </div>

      <!-- Invoice Info -->
      <div class="info-section">
        <div class="bill-grid">
          <div class="bill-col">
            <div class="bill-heading">Invoice to:</div>
            <div class="bill-row"><span class="bill-lbl">Client Name:-</span><span class="bill-val">${c.name || ''}</span></div>
            <div class="bill-row"><span class="bill-lbl">Address:-</span><span class="bill-val">${c.address || ''}</span></div>
            <div class="bill-row"><span class="bill-lbl">Email ID :-</span><span class="bill-val">${c.email || ''}</span></div>
            ${c.gstin ? `<div class="bill-row"><span class="bill-lbl">GSTIN:-</span><span class="bill-val">${c.gstin}</span></div>` : ''}
          </div>
          <div class="bill-col" style="padding-top: 18px;">
            <div class="bill-row"><span class="bill-lbl">Mo.No. :</span><span class="bill-val">${c.phone || ''}</span></div>
            <div class="bill-row"><span class="bill-lbl">Ex. Name :</span><span class="bill-val">${data.created_by_name || 'Admin'}</span></div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
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

      <!-- Bottom Grid -->
      <div class="bottom">
        <div class="bottom-grid">
          <div class="pay-box">
            <div class="pay-title">Payment QR Code :</div>
            <div class="upi-label">UPI ID :</div>
            <div class="upi-link">shridevi.vishvakarma83@kotak</div>
            <div class="qr-row">
              ${qrImg ? `<img src="${qrImg}" class="qr-img" />` : ''}
              <div class="badges">
                <span class="badge badge-pp">PhonePe</span>
                <span class="badge badge-upi">UPI</span>
                <span class="badge badge-gp">G Pay</span>
              </div>
            </div>
          </div>

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

        <div class="terms-section">
          <div class="terms-heading">TERMS &amp; CONDITION</div>
          <div class="terms-body">
            ${TERMS.map(t => `<div class="term-line">${t}</div>`).join('')}
          </div>
        </div>

        <div class="sig-wrap">
          <div class="sig-block">
            <div class="sig-label">AUTHORISED SIGNATORY FOR</div>
            ${sigImg ? `<img src="${sigImg}" class="sig-img" />` : ''}
            <div class="sig-name">M.R. TRADERS</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 3. FOOTER AT BOTTOM ═══ -->
    <div class="footer">
      ${img6 ? `<img src="${img6}" class="footer-bg" />` : ''}
      <div class="footer-inner">
        <div class="footer-address-wrap">
          ${img8 ? `<img src="${img8}" />` : ''}
          <div class="footer-address-lines">
            MR Traders &amp; Factory Outlet,<br>
            Nilgiri Baug, Sambhaji Nagar Road,<br>
            Nandura Naka, Nashik-422003
          </div>
        </div>
        <div class="footer-phone-wrap">
          ${img5 ? `<img src="${img5}" />` : ''}
          <span>9028953854</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  return htmlContent;
}
