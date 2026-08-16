import client from '../api/client';
import html2pdf from 'html2pdf.js';

export async function downloadInvoicePDF(
  invoiceId: number | string,
  invoiceNumber?: string
): Promise<void> {
  const rawName = invoiceNumber || 'Invoice';
  const filename = rawName.endsWith('.pdf') ? rawName : rawName + '.pdf';

  try {
    const response = await client.get('/invoices/' + invoiceId + '/pdf', {
      responseType: 'text',
      transformResponse: [(data) => data]
    });

    const htmlContent = response.data;
    if (!htmlContent || typeof htmlContent !== 'string' || !htmlContent.includes('<!DOCTYPE html>')) {
      throw new Error('Invalid PDF template response');
    }

    // Create container positioned on document body so html2canvas renders full content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '210mm';
    container.style.zIndex = '999999';
    container.style.background = '#ffffff';
    container.innerHTML = htmlContent;

    document.body.appendChild(container);

    // Give DOM 300ms to render images & fonts
    await new Promise(resolve => setTimeout(resolve, 300));

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0
      },
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
