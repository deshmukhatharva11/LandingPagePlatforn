import client from '../api/client';
import html2pdf from 'html2pdf.js';

export async function downloadInvoicePDF(
  invoiceId: number | string,
  invoiceNumber?: string
): Promise<void> {
  const filename = invoiceNumber
    ? (invoiceNumber.endsWith('.pdf') ? invoiceNumber : invoiceNumber + '.pdf')
    : 'invoice.pdf';

  try {
    const response = await client.get('/invoices/' + invoiceId + '/pdf', {
      responseType: 'text',
      transformResponse: [(data) => data]
    });

    const htmlContent = response.data;
    if (!htmlContent || typeof htmlContent !== 'string' || !htmlContent.includes('<!DOCTYPE html>')) {
      throw new Error('Invalid PDF template response');
    }

    // Create temporary container for html2pdf
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(container).save();
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  } catch (err: any) {
    console.error('PDF Download Error:', err);
    alert(err?.message || 'Failed to download PDF. Please try again.');
  }
}
