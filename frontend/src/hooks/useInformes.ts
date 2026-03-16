import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import type { TooltipOptions } from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CellHookData } from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { calculosService } from '@/services/calculos.service';
import { pagosService } from '@/services/pagos.service';
import { proveedoresService } from '@/services/proveedores.service';
import { clientesService } from '@/services/clientes.service';
import type { CalculoTotal, CalculoProveedor, IngresosEgresos } from '@/types/calculo';
import type { ProveedorNombre } from '@/types/proveedor';
import type { ClienteNombre } from '@/types/cliente';
import type { Pago } from '@/types/pago';

const now = new Date();
const defaultDesde = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
const defaultHasta = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

const BAR_COLORS = ['#006989', '#FF5714'] as const;

const TOOLTIP_STYLE: Partial<TooltipOptions> = {
  backgroundColor: 'rgba(17, 24, 39, 0.88)',
  titleColor: '#F9FAFB',
  bodyColor: '#E5E7EB',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  borderWidth: 1,
  cornerRadius: 8,
  padding: 10,
  titleFont: { size: 13, weight: 'bold' },
  bodyFont: { size: 12 },
  displayColors: true,
  boxPadding: 4,
};

function createHorizontalBarChart(canvas: HTMLCanvasElement, data: IngresosEgresos): Chart {
  const ctx = canvas.getContext('2d')!;
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Egresos'],
      datasets: [
        {
          data: [data.Ingresos, data.Egresos],
          backgroundColor: [...BAR_COLORS],
          borderRadius: 8,
          barThickness: 32,
          borderSkipped: false as const,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TOOLTIP_STYLE,
          callbacks: {
            label: (item) => {
              const v = item.parsed.x ?? 0;
              return `$ ${v.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;
            },
          },
        },
      },
      scales: {
        x: { display: false, beginAtZero: true },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { weight: 'bold' as const, size: 14 }, color: '#374151' },
        },
      },
    },
  });
}

export function useInformes() {
  const [resumen, setResumen] = useState<CalculoTotal | null>(null);
  const [desglose, setDesglose] = useState<CalculoProveedor[]>([]);
  const [ingresosEgresos, setIngresosEgresos] = useState<IngresosEgresos | null>(null);
  const [ieProveedor, setIeProveedor] = useState<IngresosEgresos | null>(null);
  const [ieCliente, setIeCliente] = useState<IngresosEgresos | null>(null);
  const [pagosPeriodo, setPagosPeriodo] = useState<Pago[]>([]);
  const [nombreproveedores, setNombreProveedores] = useState<ProveedorNombre[]>([]);
  const [nombreclientes, setNombreClientes] = useState<ClienteNombre[]>([]);

  const [fechaDesde, setFechaDesde] = useState(defaultDesde);
  const [fechaHasta, setFechaHasta] = useState(defaultHasta);
  const [filtroProveedor, setFiltroProveedor] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Single-chart mode refs
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Dual-chart mode refs
  const chartProvRef = useRef<HTMLCanvasElement>(null);
  const chartClienteRef = useRef<HTMLCanvasElement>(null);
  const chartProvInstanceRef = useRef<Chart | null>(null);
  const chartClienteInstanceRef = useRef<Chart | null>(null);

  const isDualMode = ieProveedor !== null || ieCliente !== null;

  const fetchData = async (desde: string, hasta: string, prov?: string, cliente?: string) => {
    setIsLoading(true);
    setError('');
    try {
      if (prov && cliente) {
        // Dual mode: fetch proveedor and cliente data separately
        const [provRes, provDesg, provIE, provPagos, clienteRes, clienteDesg, clienteIE] =
          await Promise.all([
            calculosService.obtenerTotalGeneral(desde, hasta, prov),
            calculosService.obtenerTotalesPorPeriodo(desde, hasta, prov),
            calculosService.obtenerIngresosEgresos(desde, hasta, prov),
            pagosService.filtrar({ fechadesde: desde, fechahasta: hasta, nombreProveedor: prov }),
            calculosService.obtenerTotalGeneral(desde, hasta, undefined, cliente),
            calculosService.obtenerTotalesPorPeriodo(desde, hasta, undefined, cliente),
            calculosService.obtenerIngresosEgresos(desde, hasta, undefined, cliente),
          ]);

        // Combine resumen
        const pR = provRes.length > 0 ? provRes[0] : null;
        const cR = clienteRes.length > 0 ? clienteRes[0] : null;
        if (pR && cR) {
          setResumen({
            Ingresos: Number(pR.Ingresos) + Number(cR.Ingresos),
            IngresosUSD: Number(pR.IngresosUSD) + Number(cR.IngresosUSD),
            Egresos: Number(pR.Egresos) + Number(cR.Egresos),
            EgresosUSD: Number(pR.EgresosUSD) + Number(cR.EgresosUSD),
            MontoTotal: Number(pR.MontoTotal) + Number(cR.MontoTotal),
            MontoTotalUSD: Number(pR.MontoTotalUSD) + Number(cR.MontoTotalUSD),
          });
        } else {
          setResumen(pR ?? cR);
        }

        setDesglose([...provDesg, ...clienteDesg]);
        setIngresosEgresos(null);
        setIeProveedor(provIE);
        setIeCliente(clienteIE);
        setPagosPeriodo(provPagos);
      } else {
        // Single mode
        const [resumenData, desgloseData, ieData, pagosData] = await Promise.all([
          calculosService.obtenerTotalGeneral(desde, hasta, prov, cliente),
          calculosService.obtenerTotalesPorPeriodo(desde, hasta, prov, cliente),
          calculosService.obtenerIngresosEgresos(desde, hasta, prov, cliente),
          pagosService.filtrar({ fechadesde: desde, fechahasta: hasta, nombreProveedor: prov }),
        ]);
        setResumen(resumenData.length > 0 ? resumenData[0] : null);
        setDesglose(desgloseData);
        setIngresosEgresos(ieData);
        setIeProveedor(null);
        setIeCliente(null);
        setPagosPeriodo(pagosData);
      }
    } catch {
      setError('Error al obtener los datos del informe');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(defaultDesde, defaultHasta);
    proveedoresService
      .obtenerNombres()
      .then(setNombreProveedores)
      .catch(() => {});
    clientesService
      .obtenerNombres()
      .then(setNombreClientes)
      .catch(() => {});
  }, []);

  // Single-mode doughnut chart
  useEffect(() => {
    if (!ingresosEgresos || !chartRef.current) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    const { Ingresos, Egresos } = ingresosEgresos;
    if (Ingresos === 0 && Egresos === 0) return;

    const ctx = chartRef.current.getContext('2d')!;
    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Ingresos', 'Egresos'],
        datasets: [
          {
            data: [Ingresos, Egresos],
            backgroundColor: [...BAR_COLORS],
            borderWidth: 2,
            borderColor: '#ffffff',
            spacing: 2,
          },
        ],
      },
      options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: TOOLTIP_STYLE.backgroundColor,
            titleColor: TOOLTIP_STYLE.titleColor,
            bodyColor: TOOLTIP_STYLE.bodyColor,
            borderColor: TOOLTIP_STYLE.borderColor,
            borderWidth: TOOLTIP_STYLE.borderWidth,
            cornerRadius: TOOLTIP_STYLE.cornerRadius,
            padding: TOOLTIP_STYLE.padding,
            titleFont: TOOLTIP_STYLE.titleFont,
            bodyFont: TOOLTIP_STYLE.bodyFont,
            displayColors: TOOLTIP_STYLE.displayColors,
            boxPadding: TOOLTIP_STYLE.boxPadding,
            callbacks: {
              label: (tooltipItem) => {
                const values = tooltipItem.dataset.data as number[];
                const total = values.reduce((a, b) => a + Math.abs(b), 0);
                const pct =
                  total > 0 ? ((Math.abs(tooltipItem.parsed) / total) * 100).toFixed(1) : '0';
                return `${tooltipItem.label}: ${pct}%`;
              },
            },
          },
        },
      },
    });
    chartRef.current.style.backgroundColor = '#FDFDFF';
  }, [ingresosEgresos]);

  // Dual-mode: proveedor bar chart
  useEffect(() => {
    if (!ieProveedor || !chartProvRef.current) return;
    if (chartProvInstanceRef.current) chartProvInstanceRef.current.destroy();

    const { Ingresos, Egresos } = ieProveedor;
    if (Ingresos === 0 && Egresos === 0) return;

    chartProvInstanceRef.current = createHorizontalBarChart(chartProvRef.current, ieProveedor);
    chartProvRef.current.style.backgroundColor = '#FDFDFF';
  }, [ieProveedor]);

  // Dual-mode: cliente bar chart
  useEffect(() => {
    if (!ieCliente || !chartClienteRef.current) return;
    if (chartClienteInstanceRef.current) chartClienteInstanceRef.current.destroy();

    const { Ingresos, Egresos } = ieCliente;
    if (Ingresos === 0 && Egresos === 0) return;

    chartClienteInstanceRef.current = createHorizontalBarChart(chartClienteRef.current, ieCliente);
    chartClienteRef.current.style.backgroundColor = '#FDFDFF';
  }, [ieCliente]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.destroy();
      chartProvInstanceRef.current?.destroy();
      chartClienteInstanceRef.current?.destroy();
    };
  }, []);

  const aplicarFiltro = () => {
    if (!fechaDesde || !fechaHasta) {
      setError('Ambas fechas son requeridas');
      return;
    }
    if (fechaDesde > fechaHasta) {
      setError('La fecha desde es mayor que la fecha hasta');
      return;
    }
    fetchData(fechaDesde, fechaHasta, filtroProveedor || undefined, filtroCliente || undefined);
  };

  const resetFiltro = () => {
    setFechaDesde(defaultDesde);
    setFechaHasta(defaultHasta);
    setFiltroProveedor('');
    setFiltroCliente('');
    setError('');
    fetchData(defaultDesde, defaultHasta);
  };

  const generarPDF = async () => {
    if (!resumen) {
      setError('No hay datos disponibles para generar el PDF');
      return;
    }
    setError('');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const ahora = new Date();

    const fmtNum = (v: number) => {
      const abs = Math.abs(v);
      const formatted = abs.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return v < 0 ? `-$ ${formatted}` : `$ ${formatted}`;
    };
    const fmtDate = (d: string) => {
      if (!d) return '';
      const [y, m, day] = d.split('-');
      return `${day}/${m}/${y}`;
    };

    const margin = 14;

    try {
      // Header
      doc.setFillColor(0, 105, 137);
      doc.rect(0, 0, pageWidth, 36, 'F');
      doc.setFillColor(255, 87, 20);
      doc.rect(0, 36, pageWidth, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('Informe Financiero', margin, 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(210, 235, 245);
      const filtrosParts: string[] = [];
      if (filtroProveedor) filtrosParts.push(`Proveedor: ${filtroProveedor}`);
      if (filtroCliente) filtrosParts.push(`Cliente: ${filtroCliente}`);
      filtrosParts.push(`Período: ${fmtDate(fechaDesde)}  —  ${fmtDate(fechaHasta)}`);
      const subtitulo = filtrosParts.join('  ·  ');
      doc.text(subtitulo, margin, 24);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(180, 215, 230);
      doc.text(
        `Generado el ${ahora.toLocaleDateString('es-AR')} a las ${ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
        pageWidth - margin,
        32,
        { align: 'right' },
      );

      // Resumen
      const sectionY = 48;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(40, 40, 40);
      doc.text('Resumen del período', margin, sectionY);

      const resumenData = [
        ['Ingresos (ARS)', fmtNum(resumen.Ingresos)],
        ['Ingresos (USD)', fmtNum(resumen.IngresosUSD)],
        ['Egresos (ARS)', fmtNum(resumen.Egresos)],
        ['Egresos (USD)', fmtNum(resumen.EgresosUSD)],
        ['Monto Total (ARS)', fmtNum(resumen.MontoTotal)],
        ['Monto Total (USD)', fmtNum(resumen.MontoTotalUSD)],
      ];

      doc.autoTable({
        body: resumenData,
        startY: sectionY + 4,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 },
          font: 'helvetica',
        },
        columnStyles: {
          0: { fontStyle: 'normal', textColor: [100, 100, 100], cellWidth: 55 },
          1: { halign: 'right', textColor: [33, 33, 33], fontStyle: 'normal' },
        },
        tableWidth: 120,
        margin: { left: margin },
        didParseCell: (data: CellHookData) => {
          if (data.row.index >= 4) {
            data.cell.styles.fontStyle = 'bold';
            if (data.column.index === 0) data.cell.styles.textColor = [40, 40, 40];
          }
        },
      });

      // Chart image(s)
      if (isDualMode) {
        const canvases = [chartProvRef.current, chartClienteRef.current].filter(Boolean);
        const chartWidth = canvases.length === 2 ? 28 : 60;
        let xPos = 138;
        for (const canvas of canvases) {
          if (!canvas) continue;
          const img = await html2canvas(canvas, { scale: 3 });
          doc.addImage(
            img.toDataURL('image/jpeg', 0.9),
            'JPEG',
            xPos,
            sectionY - 2,
            chartWidth,
            30,
          );
          xPos += chartWidth + 4;
        }
      } else if (chartRef.current) {
        const chartImage = await html2canvas(chartRef.current, { scale: 3 });
        const chartImageData = chartImage.toDataURL('image/jpeg', 0.9);
        doc.addImage(chartImageData, 'JPEG', 138, sectionY - 2, 60, 60);
      }

      let currentY = Math.max(doc.lastAutoTable.finalY ?? 0, 108) + 14;

      // Totales por Proveedor / Cliente
      if (desglose.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text('Totales por Proveedor / Cliente', margin, currentY);
        currentY += 5;

        const columnsProv = [
          'Nombre',
          'Tipo',
          'Ingresos',
          'Egresos',
          'Monto Total',
          'Monto Total USD',
        ];
        const rowsProv = desglose.map((tp) => [
          tp.NombreProveedor,
          `${tp.entidad === 'proveedor' ? 'Proveedor' : 'Cliente'} / ${tp.tipo}`,
          fmtNum(tp.Ingresos),
          fmtNum(tp.Egresos),
          fmtNum(tp.MontoTotal),
          fmtNum(tp.MontoTotalUSD),
        ]);

        doc.autoTable({
          head: [columnsProv],
          body: rowsProv,
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
            0: { fontStyle: 'bold', textColor: [33, 33, 33] },
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right', fontStyle: 'bold' },
            5: { halign: 'right', fontStyle: 'bold' },
          },
          margin: { left: margin, right: margin },
        });

        currentY = (doc.lastAutoTable.finalY ?? 0) + 14;
      }

      // Detalle de pagos
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(40, 40, 40);
      doc.text('Detalle de pagos realizados', margin, currentY);
      currentY += 5;

      const columnsPagos = [
        'Proveedor',
        'Monto',
        'Medio Pago',
        'Monto USD',
        'USD/día',
        'Fecha',
        'Usuario',
      ];
      const rowsPagos = pagosPeriodo.map((p) => [
        p.nombre,
        fmtNum(p.monto),
        p.nombreMedioPago,
        fmtNum(p.montoUSD),
        `$ ${Number(p.usdDelDia).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        fmtDate(p.fecha.slice(0, 10)),
        p.username || '',
      ]);

      doc.autoTable({
        head: [columnsPagos],
        body: rowsPagos,
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
          0: { fontStyle: 'bold', textColor: [33, 33, 33], cellWidth: 32 },
          1: { halign: 'right', cellWidth: 26 },
          2: { halign: 'center', cellWidth: 24 },
          3: { halign: 'right', cellWidth: 24 },
          4: { halign: 'right', cellWidth: 20 },
          5: { halign: 'center', cellWidth: 22 },
          6: { cellWidth: 24, textColor: [100, 100, 100] },
        },
        margin: { left: margin, right: margin },
      });

      // Footer
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
          `Generado el ${ahora.toLocaleDateString('es-AR')} a las ${ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
          pageWidth - margin,
          pageHeight - 10,
          { align: 'right' },
        );
      }

      doc.save(`Informe_Financiero_${fechaDesde}_${fechaHasta}.pdf`);
    } catch {
      // PDF generation error handled silently
    }
  };

  return {
    chartRef,
    chartProvRef,
    chartClienteRef,
    resumen,
    desglose,
    ingresosEgresos,
    ieProveedor,
    ieCliente,
    isDualMode,
    nombreproveedores,
    nombreclientes,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    filtroProveedor,
    setFiltroProveedor,
    filtroCliente,
    setFiltroCliente,
    error,
    isLoading,
    aplicarFiltro,
    generarPDF,
    resetFiltro,
  };
}
