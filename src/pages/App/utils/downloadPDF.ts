import client from '../api/client';

export async function downloadInvoicePDF(
  invoiceId: number | string,
  invoiceNumber?: string
): Promise<void> {
  const rawName = invoiceNumber || 'Invoice';
  const filename = rawName.endsWith('.pdf') ? rawName : `${rawName}.pdf`;

  try {
    const response = await client.get(`/invoices/${invoiceId}/pdf`, {
      responseType: 'blob'
    });

    const contentType = response.headers?.['content-type'] || '';
    const blob = response.data;

    // Check if the response is actually an HTML template string inside the blob
    const textSample = await blob.slice(0, 100).text();

    if (textSample.startsWith('%PDF')) {
      // 1. Real binary PDF file from Puppeteer — direct file download!
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      return;
    }

    if (textSample.includes('<!DOCTYPE') || textSample.includes('<html') || contentType.includes('text/html')) {
      // 2. HTML template response — render and print via browser with exact styles
      const fullText = await blob.text();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(fullText);
        printWindow.document.title = filename;
        printWindow.document.close();
        setTimeout(() => {
          try {
            printWindow.focus();
            printWindow.print();
          } catch (e) {
            console.error('Print error:', e);
          }
        }, 500);
      } else {
        alert('Please allow popups to view/print the invoice PDF.');
      }
      return;
    }

    // Fallback: download as binary
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);

  } catch (err: any) {
    console.error('PDF Download Error:', err);
    alert(err?.message || 'Failed to download PDF. Please try again.');
  }
}
