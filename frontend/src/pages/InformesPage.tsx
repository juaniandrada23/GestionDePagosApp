import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { MdSearch, MdClose, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { LuArrowUpRight, LuArrowDownRight, LuWallet } from 'react-icons/lu';
import { FaRegFilePdf } from 'react-icons/fa6';
import PageLayout from '@/components/layout/PageLayout';
import TableContainer from '@/components/shared/TableContainer';
import TableSkeleton from '@/components/shared/TableSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import ErrorAlert from '@/components/shared/ErrorAlert';
import FormField from '@/components/shared/FormField';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useInformes } from '@/hooks/useInformes';
import { INPUT_CLASS, SELECT_CLASS, TH_CLASS, BTN_PRIMARY } from '@/config/constants';
import { formatMonto } from '@/utils/formatters';

const InformesPage: React.FC = () => {
  useRequireAuth();
  const {
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
  } = useInformes();

  const thRight = `${TH_CLASS} text-right whitespace-nowrap`;
  const thLeft = `${TH_CLASS} whitespace-nowrap`;
  const tdBase = 'px-4 py-3 text-sm whitespace-nowrap';

  const chartHasData =
    ingresosEgresos != null && (ingresosEgresos.Ingresos > 0 || ingresosEgresos.Egresos > 0);
  const provHasData = ieProveedor != null && (ieProveedor.Ingresos > 0 || ieProveedor.Egresos > 0);
  const clienteHasData = ieCliente != null && (ieCliente.Ingresos > 0 || ieCliente.Egresos > 0);

  const periodoLabel = `${fechaDesde.split('-').reverse().join('/')} — ${fechaHasta.split('-').reverse().join('/')}`;

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5" style={{ flexGrow: 1 }}>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {isLoading && !resumen ? (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                  </div>
                  <div className="h-7 w-32 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                </div>
              ))}
            </>
          ) : resumen ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ingresos del Período
                  </span>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
                    <LuArrowUpRight className="text-xl" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatMonto(resumen.Ingresos)}
                </p>
                <p className="text-xs text-gray-400 mt-1">USD {formatMonto(resumen.IngresosUSD)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Egresos del Período
                  </span>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 text-[#FF5714]">
                    <LuArrowDownRight className="text-xl" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">{formatMonto(resumen.Egresos)}</p>
                <p className="text-xs text-gray-400 mt-1">USD {formatMonto(resumen.EgresosUSD)}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Balance del Período
                  </span>
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      resumen.MontoTotal >= 0
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {resumen.MontoTotal >= 0 ? (
                      <MdTrendingUp className="text-xl" />
                    ) : (
                      <MdTrendingDown className="text-xl" />
                    )}
                  </div>
                </div>
                <p
                  className={`text-2xl font-bold ${resumen.MontoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {formatMonto(resumen.MontoTotal)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  USD {formatMonto(resumen.MontoTotalUSD)}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Chart + Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Chart area */}
          {isDualMode ? (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proveedor chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF5714] flex-shrink-0" />
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {filtroProveedor}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Proveedor · {periodoLabel}</p>
                </div>
                <div className="p-5">
                  {provHasData ? (
                    <div className="flex flex-col gap-4">
                      <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                        <canvas ref={chartProvRef} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#006989' }}
                            />
                            Ingresos
                          </span>
                          <span className="font-medium text-gray-800">
                            {formatMonto(ieProveedor!.Ingresos)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#FF5714' }}
                            />
                            Egresos
                          </span>
                          <span className="font-medium text-gray-800">
                            {formatMonto(ieProveedor!.Egresos)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={<LuWallet className="text-xl text-gray-400" />}
                      title="Sin datos para este proveedor"
                    />
                  )}
                </div>
              </div>

              {/* Cliente chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {filtroCliente}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Cliente · {periodoLabel}</p>
                </div>
                <div className="p-5">
                  {clienteHasData ? (
                    <div className="flex flex-col gap-4">
                      <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                        <canvas ref={chartClienteRef} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#006989' }}
                            />
                            Ingresos
                          </span>
                          <span className="font-medium text-gray-800">
                            {formatMonto(ieCliente!.Ingresos)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-gray-600">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: '#FF5714' }}
                            />
                            Egresos
                          </span>
                          <span className="font-medium text-gray-800">
                            {formatMonto(ieCliente!.Egresos)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={<LuWallet className="text-xl text-gray-400" />}
                      title="Sin datos para este cliente"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">
                  Distribución Ingresos / Egresos
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Período: {periodoLabel}</p>
              </div>
              <div className="p-5">
                {chartHasData ? (
                  <div className="flex flex-col items-center gap-4">
                    <div
                      style={{
                        position: 'relative',
                        height: '280px',
                        width: '100%',
                        maxWidth: '320px',
                      }}
                    >
                      <canvas ref={chartRef}></canvas>
                    </div>
                    <div className="w-full max-w-xs space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: '#006989' }}
                          />
                          Ingresos
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatMonto(ingresosEgresos!.Ingresos)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: '#FF5714' }}
                          />
                          Egresos
                        </span>
                        <span className="font-medium text-gray-800">
                          {formatMonto(ingresosEgresos!.Egresos)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    icon={<LuWallet className="text-xl text-gray-400" />}
                    title="No hay datos para el período seleccionado"
                  />
                )}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Filtros</h3>
            </div>
            <div className="p-5 space-y-4">
              <FormField label="Fecha desde">
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className={INPUT_CLASS}
                />
              </FormField>
              <FormField label="Fecha hasta">
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className={INPUT_CLASS}
                />
              </FormField>
              <FormField
                label={
                  <>
                    Proveedor <span className="text-gray-400 font-normal">(opcional)</span>
                  </>
                }
              >
                <select
                  value={filtroProveedor}
                  onChange={(e) => setFiltroProveedor(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Todos los proveedores</option>
                  {nombreproveedores.map((p) => (
                    <option key={p.nombre} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                label={
                  <>
                    Cliente <span className="text-gray-400 font-normal">(opcional)</span>
                  </>
                }
              >
                <select
                  value={filtroCliente}
                  onChange={(e) => setFiltroCliente(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Todos los clientes</option>
                  {nombreclientes.map((c) => (
                    <option key={c.id} value={c.nombre}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </FormField>
              <ErrorAlert message={error} />
              <button
                type="button"
                onClick={aplicarFiltro}
                disabled={isLoading}
                className={`w-full ${BTN_PRIMARY}`}
              >
                {isLoading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <MdSearch className="text-base" />
                )}
                Aplicar
              </button>
              <button
                type="button"
                onClick={resetFiltro}
                className="w-full text-sm text-[#006989] hover:text-[#053F61] font-medium transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Filtros aplicados:</span>
          {filtroProveedor && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006989]/10 text-[#006989] text-sm font-medium rounded-full">
              Proveedor: {filtroProveedor}
              <button
                type="button"
                onClick={resetFiltro}
                className="ml-0.5 hover:bg-[#006989]/20 rounded-full p-0.5 transition-colors"
              >
                <MdClose className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filtroCliente && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full">
              Cliente: {filtroCliente}
              <button
                type="button"
                onClick={resetFiltro}
                className="ml-0.5 hover:bg-emerald-100 rounded-full p-0.5 transition-colors"
              >
                <MdClose className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006989]/10 text-[#006989] text-sm font-medium rounded-full">
            Período: {periodoLabel}
            <button
              type="button"
              onClick={resetFiltro}
              className="ml-0.5 hover:bg-[#006989]/20 rounded-full p-0.5 transition-colors"
            >
              <MdClose className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>

        {/* Table */}
        <TableContainer
          title="Totales por Proveedor / Cliente"
          count={desglose.length}
          headerAction={
            <button
              type="button"
              onClick={generarPDF}
              disabled={!resumen}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaRegFilePdf /> Generar PDF
            </button>
          }
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className={thLeft}>Nombre</th>
                <th className={thLeft}>Tipo</th>
                <th className={thRight}>Ingresos</th>
                <th className={thRight}>Egresos</th>
                <th className={thRight}>Monto Total</th>
                <th className={thRight}>Monto Total USD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <TableSkeleton rows={4} columns={6} />
              ) : desglose.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <EmptyState title="No hay operaciones en este período" />
                  </td>
                </tr>
              ) : (
                desglose.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className={`${tdBase} font-medium text-gray-800`}>{t.NombreProveedor}</td>
                    <td className={tdBase}>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.entidad === 'proveedor'
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {t.entidad === 'proveedor' ? 'Proveedor' : 'Cliente'} / {t.tipo}
                      </span>
                    </td>
                    <td className={`${tdBase} text-right font-semibold text-emerald-600`}>
                      {formatMonto(t.Ingresos)}
                    </td>
                    <td className={`${tdBase} text-right font-semibold text-red-600`}>
                      {formatMonto(t.Egresos)}
                    </td>
                    <td
                      className={`${tdBase} text-right font-bold ${t.MontoTotal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {formatMonto(t.MontoTotal)}
                    </td>
                    <td
                      className={`${tdBase} text-right font-bold ${t.MontoTotalUSD >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {formatMonto(t.MontoTotalUSD)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableContainer>
      </div>
    </PageLayout>
  );
};

export default InformesPage;
