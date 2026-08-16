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
      transformResponse: [(data: string) => data]
    });

    const htmlContent = response.data as string;
    if (!htmlContent || typeof htmlContent !== 'string' || !htmlContent.includes('<!DOCTYPE html>')) {
      throw new Error('Invalid PDF template response');
    }

    // Parse the full HTML document properly
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Create container that will hold styles + body content
    const container = document.createElement('div');
    container.id = 'pdf-render-container';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '794px'; // A4 width at 96dpi
    container.style.background = '#ffffff';
    container.style.zIndex = '999999';

    // 1. Copy all <link> tags (Google Fonts etc.)
    const links = doc.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      const cloned = document.createElement('link');
      cloned.rel = 'stylesheet';
      cloned.href = link.getAttribute('href') || '';
      container.appendChild(cloned);
    });

    // 2. Copy all <style> tags (your entire CSS)
    const styles = doc.querySelectorAll('style');
    styles.forEach((style) => {
      const cloned = document.createElement('style');
      cloned.textContent = style.textContent;
      container.appendChild(cloned);
    });

    // 3. Copy body innerHTML (your template content with base64 images)
    const bodyDiv = document.createElement('div');
    bodyDiv.innerHTML = doc.body.innerHTML;
    container.appendChild(bodyDiv);

    document.body.appendChild(container);

    // Wait for Google Fonts + base64 images to render
    await new Promise(resolve => setTimeout(resolve, 800));

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
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
