import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CellHookData } from 'jspdf-autotable';
import { presupuestosService } from '@/services/presupuestos.service';
import type { PdfData } from '@/types/presupuesto';

export function usePresupuestoPDF() {
  const fmtNum = (v: number) => {
    const abs = Math.abs(v);
    const formatted = abs.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return v < 0 ? `-$ ${formatted}` : `$ ${formatted}`;
  };

  const fmtDate = (d?: string) => {
    if (!d) return '';
    const [y, m, day] = d.split('T')[0].split('-');
    return `${day}/${m}/${y}`;
  };

  const generarPDF = async (id: number) => {
    const { presupuesto, empresa }: PdfData = await presupuestosService.obtenerDatosPdf(id);
    const items = presupuesto.items || [];

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    doc.setFillColor(0, 105, 137);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFillColor(255, 87, 20);
    doc.rect(0, 40, pageWidth, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text(empresa.nombre || 'Empresa', margin, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(210, 235, 245);
    const empresaInfo = [
      empresa.cuit ? `CUIT: ${empresa.cuit}` : '',
      empresa.direccion || '',
      empresa.telefono ? `Tel: ${empresa.telefono}` : '',
      empresa.email || '',
    ]
      .filter(Boolean)
      .join('  ·  ');
    const maxInfoWidth = pageWidth - margin * 2 - 55;
    const infoLines = doc.splitTextToSize(empresaInfo, maxInfoWidth);
    doc.text(infoLines, margin, 24);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(`Presupuesto #${presupuesto.numero}`, pageWidth - margin, 16, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(210, 235, 245);
    doc.text(`Fecha: ${fmtDate(presupuesto.fecha)}`, pageWidth - margin, 24, { align: 'right' });
    if (presupuesto.fecha_validez) {
      doc.text(`Válido hasta: ${fmtDate(presupuesto.fecha_validez)}`, pageWidth - margin, 30, {
        align: 'right',
      });
    }

    const estadoLabel = presupuesto.estado.charAt(0).toUpperCase() + presupuesto.estado.slice(1);
    doc.text(`Estado: ${estadoLabel}`, pageWidth - margin, 36, { align: 'right' });

    let currentY = 52;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text('Datos del Cliente', margin, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    const clienteLines = [
      presupuesto.cliente_nombre,
      presupuesto.cliente_cuit_dni ? `CUIT/DNI: ${presupuesto.cliente_cuit_dni}` : '',
      presupuesto.cliente_direccion || '',
      presupuesto.cliente_telefono ? `Tel: ${presupuesto.cliente_telefono}` : '',
      presupuesto.cliente_email || '',
    ].filter(Boolean);

    clienteLines.forEach((line) => {
      doc.text(line, margin, currentY);
      currentY += 4.5;
    });

    currentY += 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text('Detalle', margin, currentY);
    currentY += 4;

    const columnsItems = ['Material', 'Código', 'Cantidad', 'Unidad', 'Precio Unit.', 'Subtotal'];
    const rowsItems = items.map((item) => [
      item.material_nombre,
      item.material_codigo || '-',
      String(item.cantidad),
      item.material_unidad,
      fmtNum(item.precio_unitario),
      fmtNum(item.subtotal),
    ]);

    doc.autoTable({
      head: [columnsItems],
      body: rowsItems,
      startY: currentY,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 105, 137],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: 3,
        font: 'helvetica',
        halign: 'center',
      },
      styles: {
        fontSize: 8,
        textColor: [60, 60, 60],
        cellPadding: 2.5,
        lineColor: [230, 230, 230],
        lineWidth: 0.2,
        font: 'helvetica',
        overflow: 'linebreak',
      },
      alternateRowStyles: { fillColor: [248, 249, 251] },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [33, 33, 33], cellWidth: 50 },
        1: { halign: 'center', cellWidth: 25 },
        2: { halign: 'right', cellWidth: 20 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'right', cellWidth: 28 },
        5: { halign: 'right', cellWidth: 28, fontStyle: 'bold' },
      },
      margin: { left: margin, right: margin },
    });

    currentY = (doc.lastAutoTable.finalY ?? 0) + 8;

    const totalsData = [['Subtotal', fmtNum(presupuesto.subtotal)]];
    if (presupuesto.descuento_porcentaje > 0) {
      totalsData.push([
        `Descuento (${presupuesto.descuento_porcentaje}%)`,
        `-${fmtNum((presupuesto.subtotal * presupuesto.descuento_porcentaje) / 100)}`,
      ]);
    }
    totalsData.push(['TOTAL', fmtNum(presupuesto.total)]);

    doc.autoTable({
      body: totalsData,
      startY: currentY,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 },
        font: 'helvetica',
      },
      columnStyles: {
        0: { fontStyle: 'normal', textColor: [100, 100, 100], cellWidth: 50 },
        1: { halign: 'right', textColor: [33, 33, 33], fontStyle: 'normal' },
      },
      tableWidth: 110,
      margin: { left: pageWidth - margin - 110 },
      didParseCell: (data: CellHookData) => {
        if (data.row.index === totalsData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fontSize = 12;
          if (data.column.index === 0) data.cell.styles.textColor = [0, 105, 137];
          if (data.column.index === 1) data.cell.styles.textColor = [0, 105, 137];
        }
      },
    });

    currentY = (doc.lastAutoTable.finalY ?? 0) + 8;

    if (presupuesto.observaciones) {
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text('Observaciones', margin, currentY);
      currentY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const lines = doc.splitTextToSize(presupuesto.observaciones, pageWidth - margin * 2);
      doc.text(lines, margin, currentY);
    }

    const now = new Date();
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(0, 105, 137);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Página ${i} de ${totalPages}`, margin, pageHeight - 10);
      doc.text(
        `Generado el ${now.toLocaleDateString('es-AR')} a las ${now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' },
      );
    }

    doc.save(`Presupuesto_${presupuesto.numero}.pdf`);
  };

  return { generarPDF };
}
