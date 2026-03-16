import { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { principalService } from '@/services/principal.service';
import { CHART_COLORS, DONUT_COLORS, TOOLTIP_STYLE, AXIS_STYLE } from '@/config/chartTheme';

interface ChartCanvas extends HTMLCanvasElement {
  chart?: Chart;
}
import { useUsdBlue } from './useUsdBlue';
import { useAuth } from '@/hooks/useAuth';
import type {
  PagosPorMes,
  PagosPorFecha,
  IngresosEgresosMes,
  ResumenMes,
  MedioPagoDistribucion,
  PagoReciente,
  DashboardFilterResult,
} from '@/types/principal';

type FilterMode = 'year' | 'filtered';

const fmtDateLabel = (fecha: string) => {
  const parts = fecha.split('T')[0].split('-');
  return `${parts[2]}/${parts[1]}`;
};

export function useDashboard() {
  const { user } = useAuth();
  const { usdBlue, porcentaje: porcentajeUsd } = useUsdBlue();

  const chart1Ref = useRef<HTMLCanvasElement>(null);
  const chart2Ref = useRef<HTMLCanvasElement>(null);
  const chart3Ref = useRef<HTMLCanvasElement>(null);
  const chart4Ref = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [fechadesde, setFechaDesde] = useState('');
  const [fechahasta, setFechaHasta] = useState('');
  const [añoFiltrado, setAñoFiltrado] = useState(new Date().getFullYear().toString());

  const [filterMode, setFilterMode] = useState<FilterMode>('year');
  const [appliedLabel, setAppliedLabel] = useState('');

  const [pagosPorAño, setPagosPorAño] = useState<PagosPorMes[]>([]);
  const [pagosFiltrados, setPagosFiltrados] = useState<PagosPorFecha[]>([]);

  const [cantidadDePagos, setCantidadDePagos] = useState<string | number>('');
  const [cantidadPagosMesActual, setCantidadPagosMesActual] = useState(0);
  const [cantidadPagosMesAnterior, setCantidadPagosMesAnterior] = useState(0);
  const [usuarios, setUsuarios] = useState(0);

  const [ingresosEgresosAnio, setIngresosEgresosAnio] = useState<IngresosEgresosMes[]>([]);
  const [ingresosEgresosFiltrados, setIngresosEgresosFiltrados] = useState<
    DashboardFilterResult['ingresosEgresos']
  >([]);

  const [resumenMes, setResumenMes] = useState<ResumenMes>({ ingresos: 0, egresos: 0, balance: 0 });
  const [mediosDePago, setMediosDePago] = useState<MedioPagoDistribucion[]>([]);
  const [ultimosPagos, setUltimosPagos] = useState<PagoReciente[]>([]);

  const [fechaAhora, setFechaActual] = useState('');

  const años = Array.from({ length: 14 }, (_, i) => (2022 + i).toString());

  useEffect(() => {
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    setFechaActual(fecha.toLocaleDateString('es-ES', opciones));
  }, []);

  useEffect(() => {
    principalService
      .obtenerDashboard()
      .then((data) => {
        setCantidadDePagos(data.totalPagos);
        setCantidadPagosMesActual(data.pagosMesActual);
        setCantidadPagosMesAnterior(data.pagosMesAnterior);
        setUsuarios(data.usuarios);
        setPagosPorAño(data.pagosPorAnio);
        setIngresosEgresosAnio(data.ingresosEgresosAnio);
        setResumenMes(data.resumenMes);
        setMediosDePago(data.mediosDePago);
        setUltimosPagos(data.ultimosPagos);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!chart1Ref.current) return;
    const canvas = chart1Ref.current as ChartCanvas;
    if (canvas.chart) canvas.chart.destroy();

    let labels: string[];
    let datos: number[];

    if (filterMode === 'year') {
      labels = pagosPorAño.map((i) => i.nombre_mes);
      datos = pagosPorAño.map((i) => i.cantidad_pagos);
    } else {
      labels = pagosFiltrados.map((i) => fmtDateLabel(i.fecha));
      datos = pagosFiltrados.map((i) => i.cantidad_pagos);
    }

    if (labels.length === 0) return;

    const manyPoints = labels.length > 20;
    const ctx = chart1Ref.current.getContext('2d')!;
    canvas.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cantidad de pagos',
            data: datos,
            backgroundColor: CHART_COLORS.primary,
            hoverBackgroundColor: CHART_COLORS.primaryHover,
            borderWidth: 0,
            borderRadius: manyPoints ? 2 : 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        scales: { ...AXIS_STYLE },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: ${(context.parsed.y ?? 0).toLocaleString()}`,
            },
          },
        },
      },
    });
  }, [filterMode, pagosPorAño, pagosFiltrados]);

  useEffect(() => {
    if (!chart2Ref.current) return;
    const canvas = chart2Ref.current as ChartCanvas;
    if (canvas.chart) canvas.chart.destroy();

    let fecha: string[];
    let ingresos: number[];
    let egresos: number[];

    if (filterMode === 'year') {
      fecha = ingresosEgresosAnio.map((i) => i.nombre_mes || '');
      ingresos = ingresosEgresosAnio.map((i) => Number(i.ingresos));
      egresos = ingresosEgresosAnio.map((i) => Number(i.egresos));
    } else {
      fecha = ingresosEgresosFiltrados.map((i) => fmtDateLabel(i.fecha));
      ingresos = ingresosEgresosFiltrados.map((i) => Number(i.ingresos));
      egresos = ingresosEgresosFiltrados.map((i) => Number(i.egresos));
    }

    if (fecha.length === 0) return;

    const useBar = fecha.length <= 4;
    const manyPoints = fecha.length > 20;
    const ptRadius = manyPoints ? 2 : 5;
    const ptHoverRadius = manyPoints ? 5 : 7;
    const lineWidth = manyPoints ? 2 : 3;
    const ctx = chart2Ref.current.getContext('2d')!;

    canvas.chart = new Chart(ctx, {
      type: useBar ? 'bar' : 'line',
      data: {
        labels: fecha,
        datasets: [
          useBar
            ? {
                label: 'Ingresos',
                data: ingresos,
                backgroundColor: CHART_COLORS.primary,
                hoverBackgroundColor: CHART_COLORS.primaryHover,
                borderWidth: 0,
                borderRadius: 6,
              }
            : {
                label: 'Ingresos',
                data: ingresos,
                backgroundColor: CHART_COLORS.primaryFill,
                borderColor: CHART_COLORS.primary,
                borderWidth: lineWidth,
                pointBackgroundColor: CHART_COLORS.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: manyPoints ? 1 : 2,
                pointRadius: ptRadius,
                pointHoverRadius: ptHoverRadius,
                tension: 0.3,
                fill: true,
              },
          useBar
            ? {
                label: 'Egresos',
                data: egresos,
                backgroundColor: CHART_COLORS.accent,
                hoverBackgroundColor: CHART_COLORS.accentHover,
                borderWidth: 0,
                borderRadius: 6,
              }
            : {
                label: 'Egresos',
                data: egresos,
                backgroundColor: CHART_COLORS.accentFill,
                borderColor: CHART_COLORS.accent,
                borderWidth: lineWidth,
                pointBackgroundColor: CHART_COLORS.accent,
                pointBorderColor: '#fff',
                pointBorderWidth: manyPoints ? 1 : 2,
                pointRadius: ptRadius,
                pointHoverRadius: ptHoverRadius,
                tension: 0.3,
                fill: true,
              },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        scales: { ...AXIS_STYLE },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              color: '#374151',
              font: { size: 13, weight: 'bold' },
            },
          },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: {
              label: (context) =>
                `${context.dataset.label}: $${(context.parsed.y ?? 0).toLocaleString('es-AR')}`,
            },
          },
        },
      },
    });
  }, [filterMode, ingresosEgresosAnio, ingresosEgresosFiltrados]);

  useEffect(() => {
    if (!chart3Ref.current || mediosDePago.length === 0) return;
    const canvas = chart3Ref.current as ChartCanvas;
    if (canvas.chart) canvas.chart.destroy();

    const ctx = chart3Ref.current.getContext('2d')!;
    canvas.chart = new Chart<'doughnut'>(ctx, {
      type: 'doughnut',
      data: {
        labels: mediosDePago.map((m) => m.nombre),
        datasets: [
          {
            data: mediosDePago.map((m) => Number(m.total)),
            backgroundColor: [...DONUT_COLORS.slice(0, mediosDePago.length)],
            borderWidth: 2,
            borderColor: '#ffffff',
            spacing: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: { duration: 600, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: {
              label: (context) => {
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
                return ` ${context.label}: $${context.parsed.toLocaleString('es-AR')} (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }, [mediosDePago]);

  useEffect(() => {
    if (!chart4Ref.current || ingresosEgresosAnio.length === 0) return;
    const canvas = chart4Ref.current as ChartCanvas;
    if (canvas.chart) canvas.chart.destroy();

    const labels = ingresosEgresosAnio.map((i) => i.nombre_mes || '');
    const profits = ingresosEgresosAnio.map((i) => Number(i.ingresos) - Number(i.egresos));

    const ctx = chart4Ref.current.getContext('2d')!;
    canvas.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Ganancia neta',
            data: profits,
            backgroundColor: profits.map((v) => (v >= 0 ? CHART_COLORS.emerald : CHART_COLORS.red)),
            hoverBackgroundColor: profits.map((v) =>
              v >= 0 ? CHART_COLORS.emeraldHover : CHART_COLORS.redHover,
            ),
            borderWidth: 0,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        scales: {
          x: { ...AXIS_STYLE.x },
          y: {
            ...AXIS_STYLE.y,
            ticks: {
              ...AXIS_STYLE.y.ticks,
              callback: (value) => `$${Number(value).toLocaleString('es-AR')}`,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: {
              label: (context) => {
                const val = context.parsed.y ?? 0;
                const sign = val >= 0 ? '+' : '';
                return ` ${sign}$${val.toLocaleString('es-AR')}`;
              },
            },
          },
        },
      },
    });
  }, [ingresosEgresosAnio]);

  const handleAñoChange = useCallback((año: string) => {
    setAñoFiltrado(año);
    setFechaDesde(`${año}-01-01`);
    setFechaHasta(`${año}-12-31`);
  }, []);

  const filtrar = useCallback(() => {
    let desde = fechadesde;
    let hasta = fechahasta;
    let usedYear = false;

    if ((!desde || !hasta) && añoFiltrado) {
      desde = `${añoFiltrado}-01-01`;
      hasta = `${añoFiltrado}-12-31`;
      usedYear = true;
    }

    if (!desde || !hasta) {
      setError('Debe ingresar ambas fechas o seleccionar un año');
      return;
    }
    if (desde > hasta) {
      setError('La fecha desde es mayor que la fecha hasta');
      return;
    }

    setIsLoading(true);

    if (usedYear) {
      Promise.all([
        principalService.obtenerPagosPorAnioFiltrado(añoFiltrado),
        principalService.obtenerIngresosEgresosPorAnioFiltrado(añoFiltrado),
        principalService.obtenerTotalPagoFiltradoPorAnio(añoFiltrado),
      ])
        .then(([pagosAnio, ieAnio, totalArr]) => {
          setPagosPorAño(pagosAnio);
          setIngresosEgresosAnio(ieAnio);
          setCantidadDePagos(totalArr.length > 0 ? totalArr[0].totalPagos : 0);
          setFilterMode('year');
          setAppliedLabel(`Año: ${añoFiltrado}`);
          setError('');
          setIsLoading(false);
        })
        .catch(() => {
          setError('Error de conexion con el servidor, intente nuevamente');
          setIsLoading(false);
        });
    } else {
      principalService
        .filtrarDashboard(desde, hasta)
        .then((result) => {
          setPagosFiltrados(result.pagos);
          setIngresosEgresosFiltrados(result.ingresosEgresos);
          setCantidadDePagos(result.totalPagos);
          setFilterMode('filtered');
          setAppliedLabel(
            `${desde.split('-').reverse().join('/')} — ${hasta.split('-').reverse().join('/')}`,
          );
          setError('');
          setIsLoading(false);
        })
        .catch(() => {
          setError('Error de conexion con el servidor, intente nuevamente');
          setIsLoading(false);
        });
    }
  }, [fechadesde, fechahasta, añoFiltrado]);

  const resetFilters = useCallback(() => {
    setFechaDesde('');
    setFechaHasta('');
    setAñoFiltrado(new Date().getFullYear().toString());
    setError('');
    setAppliedLabel('');
    setFilterMode('year');

    principalService
      .obtenerDashboard()
      .then((data) => {
        setCantidadDePagos(data.totalPagos);
        setPagosPorAño(data.pagosPorAnio);
        setIngresosEgresosAnio(data.ingresosEgresosAnio);
      })
      .catch(() => {});
  }, []);

  const porcentajePagosMes =
    cantidadPagosMesAnterior > 0
      ? (
          ((cantidadPagosMesActual - cantidadPagosMesAnterior) / cantidadPagosMesAnterior) *
          100
        ).toFixed(2)
      : '0.00';

  const chart1HasData = filterMode === 'year' ? pagosPorAño.length > 0 : pagosFiltrados.length > 0;
  const chart2HasData =
    filterMode === 'year' ? ingresosEgresosAnio.length > 0 : ingresosEgresosFiltrados.length > 0;

  return {
    chart1Ref,
    chart2Ref,
    chart3Ref,
    chart4Ref,
    isLoading,
    error,
    fechadesde,
    setFechaDesde,
    fechahasta,
    setFechaHasta,
    añoFiltrado,
    handleAñoChange,
    años,
    cantidadDePagos,
    usuarios,
    usdBlue,
    porcentajeUsd,
    fechaAhora,
    porcentajePagosMes: Number(porcentajePagosMes),
    filtrar,
    filterMode,
    resetFilters,
    appliedLabel,
    userName: user?.name || '',
    chart1HasData,
    chart2HasData,
    resumenMes,
    mediosDePago,
    ultimosPagos,
    chart4HasData: ingresosEgresosAnio.length > 0,
  };
}
