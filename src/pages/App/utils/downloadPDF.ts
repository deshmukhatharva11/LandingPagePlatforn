import client from '../api/client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

    // Modify the HTML to change position:fixed to position:relative
    // (html2canvas cannot capture position:fixed elements)
    let renderHtml = htmlContent.replace(
      '</style>',
      `
      /* Override for client-side rendering */
      .header { position: relative !important; }
      .footer, .footer-bg-wrap { position: relative !important; }
      thead { display: table-header-group; }
      tfoot { display: table-footer-group; }
      body { padding-bottom: 0 !important; padding-top: 0 !important; }
      </style>`
    );

    // Create a hidden iframe to render the full HTML document
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '794px';
    iframe.style.height = '1123px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    document.body.appendChild(iframe);

    const iframeWin = iframe.contentWindow;
    const iframeDoc = iframe.contentDocument || iframeWin?.document;
    if (!iframeDoc || !iframeWin) {
      throw new Error('Cannot access iframe');
    }

    // Write the full HTML document into the iframe (preserves <html>, <head>, <style>, <body>)
    iframeDoc.open();
    iframeDoc.write(renderHtml);
    iframeDoc.close();

    // Wait for fonts + images to fully load
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      setTimeout(resolve, 2000); // fallback timeout
    });

    // Extra wait for Google Fonts
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get the actual scroll height of the content
    const body = iframeDoc.body;
    const scrollHeight = Math.max(body.scrollHeight, 1123);

    // Resize iframe to fit all content
    iframe.style.height = scrollHeight + 'px';

    // Capture using html2canvas
    const canvas = await html2canvas(body, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: 794,
      height: scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: scrollHeight,
      logging: false,
    });

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / pdfWidth;
    const totalPdfHeight = imgHeight / ratio;

    // Calculate number of pages needed
    const pageCount = Math.ceil(totalPdfHeight / pdfHeight);

    const pdf = new jsPDF('portrait', 'mm', 'a4');

    for (let i = 0; i < pageCount; i++) {
      if (i > 0) pdf.addPage();

      const srcY = i * pdfHeight * ratio;
      const srcH = Math.min(pdfHeight * ratio, imgHeight - srcY);
      const destH = srcH / ratio;

      // Create a temporary canvas for this page slice
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = imgWidth;
      pageCanvas.height = srcH;
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, 0, srcY, imgWidth, srcH, 0, 0, imgWidth, srcH);
        const pageData = pageCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(pageData, 'JPEG', 0, 0, pdfWidth, destH);
      }
    }

    pdf.save(filename);

    // Cleanup
    document.body.removeChild(iframe);

  } catch (err: any) {
    console.error('PDF Download Error:', err);
    alert(err?.message || 'Failed to download PDF. Please try again.');
  }
}
