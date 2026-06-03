/**
 * Export a DOM node as a PNG download or an A4 (landscape) PDF, using the same
 * html2canvas + jsPDF stack already in the project. Browser-only.
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportarNodo(el: HTMLElement, nombre: string, formato: 'png' | 'pdf'): Promise<void> {
  const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 });
  if (formato === 'png') {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${nombre}.png`;
    a.click();
    return;
  }
  const img = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  pdf.addImage(img, 'PNG', (pageW - w) / 2, (pageH - h) / 2, w, h);
  pdf.save(`${nombre}.pdf`);
}
