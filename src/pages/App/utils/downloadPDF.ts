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
      alert('Please allow pop-ups for this website to download/print the PDF.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 300);
    };
  } catch (err: any) {
    console.error('PDF Error:', err);
    alert(err?.message || 'Failed to prepare PDF. Please try again.');
  }
}
