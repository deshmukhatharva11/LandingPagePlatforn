export function calculateInvoice(items, invoiceDiscount = 0, transportHamali = 0, gstPercentage = 18) {
  let subtotal = 0;

  const calculatedItems = items.map((item, idx) => {
    const unitPrice = parseFloat(item.unit_price) || 0;
    const qty = parseFloat(item.quantity) || 1;
    const discPct = parseFloat(item.discount_percent) || 0;

    const lineGross = unitPrice * qty;
    const discAmt = round2(lineGross * (discPct / 100));
    const lineAmt = round2(lineGross - discAmt);

    subtotal += lineAmt;

    return {
      ...item,
      sort_order: idx,
      discount_amount: discAmt,
      line_amount: lineAmt,
    };
  });

  const invDiscAmt = round2(parseFloat(invoiceDiscount) || 0);
  const transport = round2(parseFloat(transportHamali) || 0);
  const taxableAmount = round2(subtotal - invDiscAmt);
  const gstPct = parseFloat(gstPercentage) || 0;
  const gstAmt = round2(taxableAmount * (gstPct / 100));
  const grandTotal = round2(taxableAmount + gstAmt + transport);

  return {
    items: calculatedItems,
    subtotal: round2(subtotal),
    discount_amount: invDiscAmt,
    transport_hamali: transport,
    taxable_amount: taxableAmount,
    gst_percentage: gstPct,
    gst_amount: gstAmt,
    grand_total: grandTotal,
    amount_in_words: toWords(grandTotal),
  };
}

function round2(n) { return Math.round(n * 100) / 100; }

function toWords(amount) {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
    if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + convert(n%100) : '');
    if (n < 100000) return convert(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + convert(n%1000) : '');
    if (n < 10000000) return convert(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + convert(n%100000) : '');
    return convert(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + convert(n%10000000) : '');
  }

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let words = 'Rupees ' + (rupees > 0 ? convert(rupees) : 'Zero');
  if (paise > 0) words += ' and ' + convert(paise) + ' Paise';
  return words + ' Only';
}
