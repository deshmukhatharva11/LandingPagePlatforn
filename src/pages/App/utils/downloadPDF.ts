import client from '../api/client';

/**
 * Downloads invoice PDF using client-side rendering.
 * Server returns the exact HTML template, browser converts it to PDF.
 */
export async function downloadInvoicePDF(
  invoiceId: number | string,
  invoiceNumber?: string
): Promise<void> {
  const filename = invoiceNumber
    ? (invoiceNumber.endsWith('.pdf') ? invoiceNumber : invoiceNumber + '.pdf')
    : 'invoice.pdf';

  // 1. Fetch the HTML from the server
  const response = await client.get('/invoices/' + invoiceId + '/pdf', {
    responseType: 'text'
  });

  const htmlContent = response.data;

  // 2. Create a hidden iframe to render the HTML
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '794px'; // A4 width in px at 96dpi
  iframe.style.height = '1123px'; // A4 height
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) throw new Error('Cannot access iframe document');

  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // 3. Wait for images to load, then trigger print dialog
  await new Promise(resolve => setTimeout(resolve, 500));

  // Use the browser's native print-to-PDF
  try {
    iframe.contentWindow?.print();
  } catch (e) {
    // Fallback: open in new window for printing
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
      setTimeout(() => { win.print(); }, 500);
    }
  }

  // Clean up iframe after a delay
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 2000);
}
