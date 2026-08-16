import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

const GOLD   = '#C8A84B';
const BLACK  = '#000000';
const DARK   = '#1C1C1C';
const WHITE  = '#FFFFFF';
const LGRAY  = '#f7f7f7';
const BORDER = '#cccccc';
const GREEN_HEADER = '#9BBB59'; // table header green like reference

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 8.5, color: BLACK, backgroundColor: WHITE, paddingBottom: 0 },

  // ── HEADER ──────────────────────────────────────────────────────────
  headerWrap: { flexDirection: 'row', minHeight: 90, borderBottom: `2pt solid ${GOLD}` },
  headerLeft: {
    width: 140, backgroundColor: DARK,
    alignItems: 'center', justifyContent: 'center', padding: 10,
    position: 'relative',
  },
  logo: { width: 70, height: 70, objectFit: 'contain' },
  headerRight: { flex: 1, flexDirection: 'row', alignItems: 'stretch' },
  headerRightInner: { flex: 1, padding: '10 14', justifyContent: 'center' },
  companyName: {
    fontSize: 17, fontFamily: 'Helvetica-Bold',
    color: DARK, letterSpacing: 1, textTransform: 'uppercase',
  },
  companyTagline: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: DARK, marginTop: 1 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  contactText: { fontSize: 8, color: DARK },
  gstinBox: {
    position: 'absolute', top: 6, right: 8,
    border: `0.5pt solid ${GOLD}`, paddingHorizontal: 6, paddingVertical: 2,
  },
  gstinText: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: DARK },
  goldenDiagWrap: { width: 24, backgroundColor: GOLD },

  // Gold diagonal block (left side of company name column)
  leftGoldBlock: {
    width: 20, backgroundColor: GOLD,
    // The reference shows a gold diagonal element — we'll approximate with solid
  },

  // ── QUOTATION TITLE BAR ─────────────────────────────────────────────
  titleBar: {
    backgroundColor: GOLD, paddingVertical: 5,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
  },
  titleText: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 3 },

  // ── INVOICE INFO ROW ─────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 10,
    borderBottom: `1pt solid ${BORDER}`, backgroundColor: LGRAY,
    alignItems: 'center', gap: 6,
  },
  infoLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  infoValue: { fontSize: 8.5, flex: 1, borderBottom: `0.5pt solid ${BLACK}`, paddingBottom: 1, minWidth: 100 },
  infoSpacer: { flex: 1 },

  // ── BILL TO ──────────────────────────────────────────────────────────
  billToWrap: {
    flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 6,
    borderBottom: `1pt solid ${BORDER}`,
  },
  billToLeft: { flex: 1 },
  billToRight: { width: 220, paddingLeft: 10 },
  billToLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  billLine: { fontSize: 8, marginBottom: 2.5, flexDirection: 'row' },
  billLineLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', minWidth: 72 },
  billLineVal: { fontSize: 8, flex: 1, borderBottom: `0.5pt solid ${BLACK}`, paddingBottom: 1, flexWrap: 'wrap' },

  // ── PRODUCT TABLE ─────────────────────────────────────────────────────
  tableWrap: { margin: '0 0', borderLeft: `1pt solid ${BORDER}`, borderRight: `1pt solid ${BORDER}` },
  tableHead: { flexDirection: 'row', backgroundColor: DARK, paddingVertical: 5 },
  thCell: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: WHITE, textAlign: 'center', paddingHorizontal: 3 },
  tableRow: { flexDirection: 'row', borderBottom: `0.5pt solid ${BORDER}`, minHeight: 20, alignItems: 'center' },
  tableRowAlt: { backgroundColor: LGRAY },
  tdCell: { fontSize: 8, paddingHorizontal: 4, paddingVertical: 3 },

  // Column widths
  colSr:   { width: 25, textAlign: 'center' },
  colDesc: { flex: 1 },
  colQty:  { width: 36, textAlign: 'center' },
  colSqft: { width: 44, textAlign: 'center' },
  colUnit: { width: 40, textAlign: 'center' },
  colRate: { width: 58, textAlign: 'right' },
  colAmt:  { width: 62, textAlign: 'right', fontFamily: 'Helvetica-Bold' },

  // Sub-total row
  subTotalRow: {
    flexDirection: 'row', backgroundColor: '#e8e8e8',
    borderTop: `1pt solid ${BORDER}`, paddingVertical: 5,
    paddingHorizontal: 4, alignItems: 'center',
  },
  subTotalLabel: { flex: 1, textAlign: 'center', fontSize: 9, fontFamily: 'Helvetica-Bold' },
  subTotalVal: { width: 62, textAlign: 'right', fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // ── BOTTOM SECTION ───────────────────────────────────────────────────
  bottomWrap: {
    flexDirection: 'row', borderTop: `1pt solid ${BORDER}`,
    borderLeft: `1pt solid ${BORDER}`, borderRight: `1pt solid ${BORDER}`,
  },
  paySection: { flex: 1, padding: '8 10', borderRight: `1pt solid ${BORDER}` },
  payTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  payLine: { fontSize: 7.5, color: '#333', marginBottom: 2 },
  upiId: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GOLD, marginBottom: 4 },
  payMethods: { flexDirection: 'row', gap: 4, marginTop: 4 },
  payBadge: { fontSize: 7, backgroundColor: '#eee', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 },

  totalsSection: { width: 210 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderBottom: `0.5pt solid ${BORDER}`,
    paddingVertical: 5, paddingHorizontal: 10,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 8.5 },
  totalVal: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', textAlign: 'right', minWidth: 60 },
  netTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: DARK,
    paddingVertical: 7, paddingHorizontal: 10,
    alignItems: 'center',
  },
  netLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: GOLD },
  netVal: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: GOLD },
  wordsRow: {
    padding: '5 10', borderTop: `0.5pt solid ${BORDER}`,
    alignItems: 'center',
  },
  wordsTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 2 },
  wordsVal: { fontSize: 7, textAlign: 'center', color: '#444' },

  // ── TERMS ────────────────────────────────────────────────────────────
  termsWrap: {
    paddingHorizontal: 10, paddingVertical: 7,
    borderTop: `1pt solid ${BORDER}`,
    borderLeft: `1pt solid ${BORDER}`, borderRight: `1pt solid ${BORDER}`,
  },
  termsTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4, textDecoration: 'underline' },
  termItem: { fontSize: 7.5, marginBottom: 2.5, color: '#222' },

  // ── SIGNATURE ────────────────────────────────────────────────────────
  signWrap: {
    flexDirection: 'row', justifyContent: 'flex-end',
    paddingHorizontal: 14, paddingVertical: 6,
    borderLeft: `1pt solid ${BORDER}`, borderRight: `1pt solid ${BORDER}`,
  },
  signBlock: { alignItems: 'flex-end' },
  signFor: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#333' },
  signLine: { width: 110, borderBottom: `1pt solid #777`, marginTop: 18, marginBottom: 3 },
  signName: { fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // ── FOOTER ───────────────────────────────────────────────────────────
  footer: {
    backgroundColor: DARK, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7,
    marginTop: 0,
  },
  footLeft: { flexDirection: 'column' },
  footText: { fontSize: 7, color: '#ccc' },
  footRight: { alignItems: 'flex-end' },
  footGold: { fontSize: 7.5, color: GOLD, fontFamily: 'Helvetica-Bold' },
});

function fmt(n: number) {
  return `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtShort(n: number) {
  if (!n || n === 0) return '-';
  return `₹ ${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}
function fmtDate(d: string) {
  if (!d) return '';
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yy = String(dt.getFullYear()).slice(2);
  return `${dd}-${mm}-${yy}`;
}

const TERMS = [
  '01. Kindly note that the rates are variable as per the choice of the material and the changes in the rates of the materials, this is only the approximate of the expenditure and not the exact cost.',
  '02. GST 18% extra on total basic amount.',
  '03. 20% Advance amt on booking.',
  '04. 60% payment upon dispatch of materials.',
  '05. 10% payment after installation on same day.',
  '06. 10% payment when work final.',
  '07. Transportation charges are added above, Mention as extra.',
];

interface InvoiceData {
  invoice_number: string;
  invoice_date: string;
  customer: any;
  items: any[];
  subtotal: number;
  discount_amount: number;
  transport_hamali: number;
  taxable_amount: number;
  gst_percentage: number;
  gst_amount: number;
  grand_total: number;
  amount_in_words: string;
  notes?: string;
  created_by_name?: string;
}

const MIN_ROWS = 8;

export default function InvoiceTemplate({ data }: { data: InvoiceData }) {
  const c = data.customer || {};
  const items = data.items || [];
  const emptyRows = Math.max(0, MIN_ROWS - items.length);
  const logoUrl = typeof window !== 'undefined' ? `${window.location.origin}/favicon.png` : '';

  return (
    <Document title={data.invoice_number} author="MR Traders">
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.headerWrap}>
          <View style={s.headerLeft}>
            {logoUrl ? <Image src={logoUrl} style={s.logo} /> : <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Helvetica-Bold' }}>MR</Text>}
          </View>
          <View style={[s.leftGoldBlock, { width: 18 }]} />
          <View style={s.headerRightInner}>
            <Text style={s.companyName}>MR TRADERS INTERIOR</Text>
            <Text style={s.companyTagline}>DESIGNING &amp; FURNITURE</Text>
            <View style={s.contactRow}>
              <Text style={s.contactText}>✉  mrtradersofficial01@gmail.com</Text>
            </View>
            <View style={s.contactRow}>
              <Text style={s.contactText}>📷  @mr_traders.10</Text>
              <Text style={[s.contactText, { marginLeft: 12 }]}>📞  9423640903</Text>
            </View>
          </View>
          <View style={s.gstinBox}>
            <Text style={s.gstinText}>GSTIN- 27AGHPV7718B2Z5</Text>
          </View>
        </View>

        {/* ── QUOTATION TITLE ── */}
        <View style={s.titleBar}>
          <Text style={s.titleText}>QUOTATION</Text>
        </View>

        {/* ── INVOICE INFO ── */}
        <View style={s.infoRow}>
          <Text style={s.infoLabel}>Invoice No.</Text>
          <Text style={s.infoValue}>{data.invoice_number}</Text>
          <View style={{ width: 20 }} />
          <Text style={s.infoLabel}>Invoice Date:</Text>
          <Text style={s.infoValue}>{fmtDate(data.invoice_date)}</Text>
        </View>

        {/* ── BILL TO ── */}
        <View style={s.billToWrap}>
          <View style={s.billToLeft}>
            <Text style={s.billToLabel}>Invoice to :</Text>
            <View style={s.billLine}>
              <Text style={s.billLineLabel}>Client Name:-</Text>
              <Text style={s.billLineVal}>{c.name || ''}</Text>
            </View>
            <View style={s.billLine}>
              <Text style={s.billLineLabel}>Address:-</Text>
              <Text style={s.billLineVal}>{c.billing_address || ''}</Text>
            </View>
            <View style={s.billLine}>
              <Text style={s.billLineLabel}>Email ID :-</Text>
              <Text style={s.billLineVal}>{c.email || ''}</Text>
            </View>
            {c.gstin ? (
              <View style={s.billLine}>
                <Text style={s.billLineLabel}>GSTIN :-</Text>
                <Text style={s.billLineVal}>{c.gstin}</Text>
              </View>
            ) : null}
          </View>
          <View style={s.billToRight}>
            <Text style={[s.billToLabel, { opacity: 0 }]}>.</Text>
            <View style={s.billLine}>
              <Text style={s.billLineLabel}>Mo.No. :</Text>
              <Text style={s.billLineVal}>{c.phone || ''}</Text>
            </View>
            <View style={s.billLine}>
              <Text style={s.billLineLabel}>Ex. Name :</Text>
              <Text style={s.billLineVal}>{data.created_by_name || ''}</Text>
            </View>
          </View>
        </View>

        {/* ── PRODUCT TABLE ── */}
        <View style={s.tableWrap}>
          {/* Header */}
          <View style={s.tableHead}>
            <Text style={[s.thCell, s.colSr]}>SR{'\n'}NO</Text>
            <Text style={[s.thCell, s.colDesc]}>DESCRIPTION</Text>
            <Text style={[s.thCell, s.colQty]}>QTY</Text>
            <Text style={[s.thCell, s.colSqft]}>SQ.FT.</Text>
            <Text style={[s.thCell, s.colUnit]}>UNITS</Text>
            <Text style={[s.thCell, s.colRate]}>RATE</Text>
            <Text style={[s.thCell, s.colAmt]}>AMT</Text>
          </View>

          {/* Data rows */}
          {items.map((item: any, idx: number) => (
            <View key={item.id || idx} style={[s.tableRow, idx % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={[s.tdCell, s.colSr]}>{idx + 1}</Text>
              <View style={[s.tdCell, s.colDesc]}>
                <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8 }}>{item.product_name}</Text>
                {item.product_sku ? <Text style={{ fontSize: 6.5, color: '#888' }}>{item.product_sku}</Text> : null}
              </View>
              <Text style={[s.tdCell, s.colQty]}>{item.quantity}</Text>
              <Text style={[s.tdCell, s.colSqft]}>{Number(item.quantity).toFixed(2)}</Text>
              <Text style={[s.tdCell, s.colUnit]}>{item.unit}</Text>
              <Text style={[s.tdCell, s.colRate]}>{Number(item.unit_price).toLocaleString('en-IN')}</Text>
              <Text style={[s.tdCell, s.colAmt]}>{Number(item.line_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          ))}

          {/* Empty filler rows */}
          {Array.from({ length: emptyRows }).map((_, i) => (
            <View key={`e${i}`} style={[s.tableRow, (items.length + i) % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={[s.tdCell, s.colSr]}> </Text>
              <Text style={[s.tdCell, s.colDesc]}> </Text>
              <Text style={[s.tdCell, s.colQty]}> </Text>
              <Text style={[s.tdCell, s.colSqft]}>0.0</Text>
              <Text style={[s.tdCell, s.colUnit]}> </Text>
              <Text style={[s.tdCell, s.colRate]}> </Text>
              <Text style={[s.tdCell, s.colAmt]}>0</Text>
            </View>
          ))}

          {/* Sub Total */}
          <View style={s.subTotalRow}>
            <Text style={s.subTotalLabel}>SUB TOTAL</Text>
            <Text style={s.subTotalVal}>{fmtShort(data.subtotal)}</Text>
          </View>
        </View>

        {/* ── BOTTOM: PAYMENT + TOTALS ── */}
        <View style={s.bottomWrap}>
          {/* Payment */}
          <View style={s.paySection}>
            <Text style={s.payTitle}>Payment QR Code :</Text>
            <Text style={s.payLine}>UPI ID :</Text>
            <Text style={s.upiId}>eazypay.ntb11000334336@icici</Text>
            <View style={s.payMethods}>
              <Text style={s.payBadge}>PhonePe</Text>
              <Text style={s.payBadge}>UPI</Text>
              <Text style={s.payBadge}>Google Pay</Text>
              <Text style={s.payBadge}>Paytm</Text>
            </View>
          </View>

          {/* Totals */}
          <View style={s.totalsSection}>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>TOTAL AMT</Text>
              <Text style={s.totalVal}>{fmtShort(data.subtotal)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Disc.</Text>
              <Text style={s.totalVal}>{data.discount_amount > 0 ? fmtShort(data.discount_amount) : '-'}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Transport / Hamali</Text>
              <Text style={s.totalVal}>{data.transport_hamali > 0 ? fmtShort(data.transport_hamali) : '-'}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>GST ({data.gst_percentage || 18}%)</Text>
              <Text style={s.totalVal}>{fmtShort(data.gst_amount)}</Text>
            </View>
            <View style={s.netTotalRow}>
              <Text style={s.netLabel}>Net Total</Text>
              <Text style={s.netVal}>{fmt(data.grand_total)}</Text>
            </View>
            <View style={s.wordsRow}>
              <Text style={s.wordsTitle}>Total Amt ( In Words )</Text>
              <Text style={s.wordsVal}>{data.amount_in_words || 'Rupees Zero Only'}</Text>
            </View>
          </View>
        </View>

        {/* ── TERMS ── */}
        <View style={s.termsWrap}>
          <Text style={s.termsTitle}>TERMS &amp; CONDITION</Text>
          {TERMS.map((t, i) => <Text key={i} style={s.termItem}>{t}</Text>)}
          {data.notes ? <Text style={[s.termItem, { marginTop: 3, fontFamily: 'Helvetica-Bold' }]}>Note : {data.notes}</Text> : null}
        </View>

        {/* ── SIGNATURE ── */}
        <View style={s.signWrap}>
          <View style={s.signBlock}>
            <Text style={s.signFor}>AUTHORISED SIGNATORY FOR</Text>
            <View style={s.signLine} />
            <Text style={s.signName}>M.R. TRADERS</Text>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={s.footer}>
          <View style={s.footLeft}>
            <Text style={s.footText}>📍 MR Traders &amp; Factory Outlet, Nilgiri Baug,</Text>
            <Text style={s.footText}>   Sambhaji Nagar Road, Nandura Naka, Nashik-422003</Text>
          </View>
          <View style={s.footRight}>
            <Text style={s.footGold}>📞 9423640903</Text>
            <Text style={s.footText}>mrtraders.site</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
