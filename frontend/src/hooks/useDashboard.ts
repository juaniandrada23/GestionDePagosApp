import { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';
import { principalService } from '@/services/principal.service';

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

const DONUT_COLORS = ['#006989', '#FF5714', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

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

    const ctx = chart1Ref.current.getContext('2d')!;
    canvas.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cantidad de pagos',
            data: datos,
            backgroundColor: 'rgba(0, 105, 137, 0.7)',
            hoverBackgroundColor: 'rgba(0, 78, 102, 0.9)',
            borderColor: '#004E66',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.06)' },
            ticks: { precision: 0 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
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
                backgroundColor: 'rgba(0, 105, 137, 0.7)',
                hoverBackgroundColor: 'rgba(0, 78, 102, 0.9)',
                borderColor: '#004E66',
                borderWidth: 1,
                borderRadius: 4,
              }
            : {
                label: 'Ingresos',
                data: ingresos,
                backgroundColor: 'rgba(0, 105, 137, 0.1)',
                borderColor: '#006989',
                borderWidth: 2,
                pointBackgroundColor: '#4BA3C3',
                pointBorderColor: '#004E66',
                tension: 0.3,
                fill: true,
              },
          useBar
            ? {
                label: 'Egresos',
                data: egresos,
                backgroundColor: 'rgba(255, 87, 20, 0.7)',
                hoverBackgroundColor: 'rgba(255, 87, 20, 0.9)',
                borderColor: '#CC4610',
                borderWidth: 1,
                borderRadius: 4,
              }
            : {
                label: 'Egresos',
                data: egresos,
                backgroundColor: 'rgba(255, 87, 20, 0.1)',
                borderColor: '#FF5714',
                borderWidth: 2,
                pointBackgroundColor: '#FF8A5C',
                pointBorderColor: '#CC4610',
                tension: 0.3,
                fill: true,
              },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.06)' },
            ticks: { precision: 0 },
          },
        },
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
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
    canvas.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: mediosDePago.map((m) => m.nombre),
        datasets: [
          {
            data: mediosDePago.map((m) => Number(m.total)),
            backgroundColor: DONUT_COLORS.slice(0, mediosDePago.length),
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
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
            backgroundColor: profits.map((v) =>
              v >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)',
            ),
            hoverBackgroundColor: profits.map((v) =>
              v >= 0 ? 'rgba(5, 150, 105, 0.9)' : 'rgba(220, 38, 38, 0.9)',
            ),
            borderColor: profits.map((v) => (v >= 0 ? '#059669' : '#DC2626')),
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.06)' },
            ticks: {
              callback: (value) => `$${Number(value).toLocaleString('es-AR')}`,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
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
    principalService
      .filtrarDashboard(desde, hasta)
      .then((result) => {
        setPagosFiltrados(result.pagos);
        setIngresosEgresosFiltrados(result.ingresosEgresos);
        setCantidadDePagos(result.totalPagos);
        setFilterMode('filtered');
        setAppliedLabel(
          usedYear
            ? `Año: ${añoFiltrado}`
            : `${desde.split('-').reverse().join('/')} — ${hasta.split('-').reverse().join('/')}`,
        );
        setError('');
        setIsLoading(false);
      })
      .catch(() => {
        setError('Error de conexion con el servidor, intente nuevamente');
        setIsLoading(false);
      });
  }, [fechadesde, fechahasta, añoFiltrado]);

  const resetFilters = useCallback(() => {
    setFechaDesde('');
    setFechaHasta('');
    setAñoFiltrado(new Date().getFullYear().toString());
    setError('');
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
