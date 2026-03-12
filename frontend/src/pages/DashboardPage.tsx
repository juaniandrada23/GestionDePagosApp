import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { MdFilterList, MdSearch, MdTrendingUp, MdTrendingDown, MdClose } from 'react-icons/md';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { LuBadgeDollarSign, LuWallet, LuArrowUpRight, LuArrowDownRight } from 'react-icons/lu';
import { FiClock } from 'react-icons/fi';
import PageLayout from '@/components/layout/PageLayout';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import EmptyState from '@/components/shared/EmptyState';
import ErrorAlert from '@/components/shared/ErrorAlert';
import FormField from '@/components/shared/FormField';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { INPUT_CLASS, SELECT_CLASS, BTN_PRIMARY } from '@/config/constants';
import { formatMonto, formatFechaCorta } from '@/utils/formatters';

const DONUT_COLORS = ['#006989', '#FF5714', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

const DashboardPage: React.FC = () => {
  useRequireAuth();
  const [filtrosOpen] = useState(false);
  const {
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
    porcentajePagosMes,
    filtrar,
    filterMode,
    resetFilters,
    appliedLabel,
    userName,
    chart1HasData,
    chart2HasData,
    chart4HasData,
    resumenMes,
    mediosDePago,
    ultimosPagos,
  } = useDashboard();

  const currentYear = new Date().getFullYear();
  const chartSubtitle = filterMode === 'filtered' ? appliedLabel : `Año ${currentYear}`;
  const staticSubtitle = `Año ${currentYear}`;

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Bienvenido, {userName}</h1>
            <p className="text-sm text-gray-500">{fechaAhora}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              Total pagos: <strong className="text-gray-700">{cantidadDePagos}</strong>
              {porcentajePagosMes !== 0 && (
                <>
                  {' '}
                  <span
                    className={`font-medium ${porcentajePagosMes > 0 ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {porcentajePagosMes > 0 ? (
                      <FaArrowUp className="inline w-3 h-3" />
                    ) : (
                      <FaArrowDown className="inline w-3 h-3" />
                    )}{' '}
                    {Math.abs(porcentajePagosMes)}%
                  </span>
                </>
              )}
            </span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline">
              Usuarios: <strong className="text-gray-700">{usuarios}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Balance del Mes
              </span>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  resumenMes.balance >= 0
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-500'
                }`}
              >
                {resumenMes.balance >= 0 ? (
                  <MdTrendingUp className="text-xl" />
                ) : (
                  <MdTrendingDown className="text-xl" />
                )}
              </div>
            </div>
            <p
              className={`text-2xl font-bold ${resumenMes.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {formatMonto(resumenMes.balance)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Ingresos - Egresos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ingresos del Mes
              </span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
                <LuArrowUpRight className="text-xl" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatMonto(resumenMes.ingresos)}</p>
            <p className="text-xs text-gray-400 mt-1">Cobros del mes actual</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Egresos del Mes
              </span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 text-[#FF5714]">
                <LuArrowDownRight className="text-xl" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatMonto(resumenMes.egresos)}</p>
            <p className="text-xs text-gray-400 mt-1">Pagos del mes actual</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Dólar Blue
              </span>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#006989]/10 text-[#006989]">
                <LuBadgeDollarSign className="text-xl" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">${usdBlue.toLocaleString('es-AR')}</p>
            <p className="text-xs text-gray-400 mt-1">
              <span
                className={`font-semibold ${porcentajeUsd >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {porcentajeUsd >= 0 ? (
                  <FaArrowUp className="inline mr-0.5 w-3 h-3" />
                ) : (
                  <FaArrowDown className="inline mr-0.5 w-3 h-3" />
                )}
                {Math.abs(porcentajeUsd)}%
              </span>{' '}
              vs. hace un mes
            </p>
          </div>
        </div>

        <CollapsibleSection
          title="Filtros"
          icon={<MdFilterList className="text-lg text-[#006989]" />}
          defaultOpen={filtrosOpen}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <FormField label="Fecha desde">
              <input
                type="date"
                value={fechadesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField label="Fecha hasta">
              <input
                type="date"
                value={fechahasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className={INPUT_CLASS}
              />
            </FormField>
            <FormField label="Año">
              <select
                value={añoFiltrado}
                onChange={(e) => handleAñoChange(e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Seleccionar año</option>
                {años.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={filtrar} disabled={isLoading} className={BTN_PRIMARY}>
              {isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <MdSearch className="text-base" />
              )}
              Filtrar
            </button>
          </div>
        </CollapsibleSection>

        {filterMode === 'filtered' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Filtros aplicados:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006989]/10 text-[#006989] text-sm font-medium rounded-full">
              {appliedLabel}
              <button
                type="button"
                onClick={resetFilters}
                className="ml-0.5 hover:bg-[#006989]/20 rounded-full p-0.5 transition-colors"
              >
                <MdClose className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        <ErrorAlert message={error} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Cantidad de pagos</h3>
              <p className="text-xs text-gray-400 mt-0.5">{chartSubtitle}</p>
            </div>
            <div className="p-5">
              {chart1HasData ? (
                <div style={{ position: 'relative', height: '280px' }}>
                  <canvas ref={chart1Ref}></canvas>
                </div>
              ) : (
                <EmptyState
                  icon={<LuWallet className="text-xl text-gray-400" />}
                  title="No hay pagos registrados"
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Ingresos y Egresos</h3>
              <p className="text-xs text-gray-400 mt-0.5">{chartSubtitle}</p>
            </div>
            <div className="p-5">
              {chart2HasData ? (
                <div style={{ position: 'relative', height: '280px' }}>
                  <canvas ref={chart2Ref}></canvas>
                </div>
              ) : (
                <EmptyState
                  icon={<LuWallet className="text-xl text-gray-400" />}
                  title="No hay datos disponibles"
                />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Rentabilidad Mensual</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Ganancia neta por mes (ingresos - egresos)
              </p>
            </div>
            <div className="p-5">
              {chart4HasData ? (
                <div style={{ position: 'relative', height: '280px' }}>
                  <canvas ref={chart4Ref}></canvas>
                </div>
              ) : (
                <EmptyState
                  icon={<LuWallet className="text-xl text-gray-400" />}
                  title="Sin datos"
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Medios de Pago</h3>
              <p className="text-xs text-gray-400 mt-0.5">{staticSubtitle}</p>
            </div>
            <div className="p-5">
              {mediosDePago.length === 0 ? (
                <EmptyState
                  icon={<LuWallet className="text-xl text-gray-400" />}
                  title="Sin datos"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div style={{ position: 'relative', height: '180px', width: '180px' }}>
                    <canvas ref={chart3Ref}></canvas>
                  </div>
                  <div className="w-full space-y-2">
                    {mediosDePago.map((m, i) => {
                      const total = mediosDePago.reduce((acc, x) => acc + Number(x.total), 0);
                      const pct = total > 0 ? ((Number(m.total) / total) * 100).toFixed(1) : '0';
                      return (
                        <div key={m.nombre} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                            />
                            {m.nombre}
                          </span>
                          <span className="font-medium text-gray-800">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Últimos Pagos</h3>
              <p className="text-xs text-gray-400 mt-0.5">Actividad reciente</p>
            </div>
            <div className="px-5 py-3">
              {ultimosPagos.length === 0 ? (
                <EmptyState
                  icon={<LuWallet className="text-xl text-gray-400" />}
                  title="Sin pagos recientes"
                />
              ) : (
                <div className="divide-y divide-gray-100">
                  {ultimosPagos.map((p) => (
                    <div key={p.idPago} className="flex items-center gap-3 py-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          p.monto >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                        }`}
                      >
                        {p.monto >= 0 ? (
                          <LuArrowUpRight className="text-base" />
                        ) : (
                          <LuArrowDownRight className="text-base" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {formatFechaCorta(p.fecha)} &middot; {p.nombreMedioPago}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold whitespace-nowrap ${
                          p.monto >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {formatMonto(p.monto)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
