import client from '../api/client';

export async function downloadInvoicePDF(
  invoiceId: number | string,
  invoiceNumber?: string
): Promise<void> {
  try {
    const response = await client.get('/invoices/' + invoiceId + '/pdf', {
      responseType: 'text',
      transformResponse: [(data) => data]
    });

    const htmlContent = response.data;
    if (!htmlContent || typeof htmlContent !== 'string' || !htmlContent.includes('<!DOCTYPE html>')) {
      throw new Error('Invalid PDF template response');
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups for this website to view/print the invoice PDF.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (e) { console.error(e); }
    }, 400);
  } catch (err: any) {
    console.error('PDF Error:', err);
    alert(err?.message || 'Failed to prepare PDF. Please try again.');
  }
}
