import React from 'react';
import { MdFilterList, MdAdd, MdSearch, MdEdit } from 'react-icons/md';
import PageLayout from '@/components/layout/PageLayout';
import AppSnackbar from '@/components/feedback/AppSnackbar';
import BotonEliminarPago from '@/components/shared/BotonEliminarPago';
import BotonVerDescripcion from '@/components/shared/BotonVerDescripcion';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import TableContainer from '@/components/shared/TableContainer';
import TableSkeleton from '@/components/shared/TableSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import ErrorAlert from '@/components/shared/ErrorAlert';
import FormField from '@/components/shared/FormField';
import FormDialog from '@/components/shared/FormDialog';
import Pagination from '@/components/shared/Pagination';
import { Spinner } from '@/components/shared/Modal';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useVentas } from '@/hooks/useVentas';
import { useMobileScreen } from '@/hooks/useMobileScreen';
import { useAuth } from '@/hooks/useAuth';
import {
  ITEMS_PER_PAGE,
  INPUT_CLASS,
  SELECT_CLASS,
  BTN_PRIMARY,
  BTN_ICON_PRIMARY,
  TH_CLASS,
} from '@/config/constants';
import { formatMonto, formatFecha } from '@/utils/formatters';

const VentasPage: React.FC = () => {
  useRequireAuth();
  const { isAdmin } = useAuth();
  const isMobile = useMobileScreen();
  const {
    paginatedPagos,
    totalPages,
    currentPage,
    setCurrentPage,
    nombreclientes,
    nombreproveedores,
    mediodepago,
    nombreusuarios,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    nombreClienteFiltro,
    setNombreClienteFiltro,
    nombreUsuarioFiltro,
    setNombreUsuarioFiltro,
    error,
    isLoadingSkeleton,
    isLoading,
    cargandoForm,
    formData,
    formErrors,
    snackbar,
    entidadValue,
    editData,
    editEntidadValue,
    handleInputChange,
    handleFormSubmit,
    aplicarFiltros,
    actualizarPagos,
    pagos,
    editPago,
    editFormErrors,
    editLoading,
    abrirEditDialog,
    handleEditChange,
    handleEditSubmit,
    cerrarEditDialog,
  } = useVentas();

  const colCount = isAdmin ? 8 : 7;

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <CollapsibleSection
          title="Filtros"
          icon={<MdFilterList className="text-lg text-primary-500" />}
          defaultOpen={false}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
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
            <FormField label="Cliente">
              <select
                value={nombreClienteFiltro}
                onChange={(e) => setNombreClienteFiltro(e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">Todos</option>
                {nombreclientes.map((c) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </FormField>
            {isAdmin && (
              <FormField label="Usuario">
                <select
                  value={nombreUsuarioFiltro}
                  onChange={(e) => setNombreUsuarioFiltro(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Todos</option>
                  {nombreusuarios.map((u) => (
                    <option key={u.username} value={u.username}>
                      {u.username}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={aplicarFiltros}
              disabled={isLoading}
              className={BTN_PRIMARY}
            >
              {isLoading ? <Spinner /> : <MdSearch className="text-base" />}
              Aplicar
            </button>
          </div>
        </CollapsibleSection>

        <ErrorAlert message={error} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4">
            <CollapsibleSection
              title="Nueva Venta"
              icon={<MdAdd className="text-lg text-primary-500" />}
            >
              <form className="space-y-4 pt-4" onSubmit={handleFormSubmit}>
                <FormField label="Cliente / Proveedor" error={formErrors.cliente}>
                  <select
                    name="_entidad"
                    value={entidadValue}
                    onChange={handleInputChange}
                    required
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Seleccione
                    </option>
                    <optgroup label="Clientes">
                      {nombreclientes.map((c) => (
                        <option key={`c-${c.id}`} value={`cliente:${c.nombre}`}>
                          {c.nombre}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Proveedores">
                      {nombreproveedores.map((p) => (
                        <option key={`p-${p.nombre}`} value={`proveedor:${p.nombre}`}>
                          {p.nombre}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </FormField>

                <FormField label="Monto" error={formErrors.monto}>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      required
                      className={`${INPUT_CLASS} pl-7`}
                    />
                  </div>
                </FormField>

                <FormField label="Medio de Pago" error={formErrors.medioPago}>
                  <select
                    name="medioPago"
                    value={formData.medioPago}
                    onChange={handleInputChange}
                    required
                    className={SELECT_CLASS}
                  >
                    <option value="" disabled>
                      Seleccione
                    </option>
                    {mediodepago.map((m) => (
                      <option key={m.nombreMedioPago} value={m.nombreMedioPago}>
                        {m.nombreMedioPago}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Fecha" error={formErrors.fecha}>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    required
                    className={INPUT_CLASS}
                  />
                </FormField>

                <FormField label="Dolar del dia" error={formErrors.usdDelDia}>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">
                      $
                    </span>
                    <input
                      type="number"
                      name="usdDelDia"
                      value={formData.usdDelDia}
                      onChange={handleInputChange}
                      required
                      className={`${INPUT_CLASS} pl-7`}
                    />
                  </div>
                </FormField>

                <FormField
                  label={
                    <>
                      Descripcion <span className="text-gray-400 font-normal">(opcional)</span>
                    </>
                  }
                >
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={cargandoForm}
                  className="w-full py-2.5 bg-primary-500 text-white font-semibold text-sm rounded-lg hover:bg-primary-600 shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cargandoForm ? (
                    <>
                      <Spinner /> Agregando...
                    </>
                  ) : (
                    'Agregar Venta'
                  )}
                </button>
              </form>
            </CollapsibleSection>
          </div>

          <div className="lg:col-span-8">
            <TableContainer
              title="Ventas"
              count={pagos.length}
              countLabel="registros"
              countLabelSingular="registro"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className={TH_CLASS}>Cliente</th>
                    <th className={`${TH_CLASS} text-right`}>Monto</th>
                    <th className={`${TH_CLASS} text-right`}>Monto USD</th>
                    <th className={`${TH_CLASS} text-right`}>Precio USD</th>
                    <th className={TH_CLASS}>Medio de pago</th>
                    <th className={TH_CLASS}>Fecha</th>
                    <th className={`${TH_CLASS} text-center`}>Accion</th>
                    {isAdmin && <th className={TH_CLASS}>Usuario</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingSkeleton ? (
                    <TableSkeleton columns={colCount} />
                  ) : paginatedPagos.length === 0 ? (
                    <tr>
                      <td colSpan={colCount} className="px-4 py-16 text-center">
                        <EmptyState
                          title="No se encontraron ventas"
                          subtitle="Agrega una nueva venta o ajusta los filtros"
                        />
                      </td>
                    </tr>
                  ) : (
                    paginatedPagos.map((pago) => (
                      <tr key={pago.idPago} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                          {pago.nombre}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold whitespace-nowrap text-emerald-600">
                          {formatMonto(pago.monto)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium whitespace-nowrap text-emerald-600">
                          {formatMonto(pago.montoUSD)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 whitespace-nowrap">
                          $ {Number(pago.usdDelDia).toLocaleString('es-AR')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            {pago.nombreMedioPago}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {formatFecha(pago.fecha)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <BotonVerDescripcion pago={pago} />
                            <button
                              type="button"
                              onClick={() => abrirEditDialog(pago)}
                              className={BTN_ICON_PRIMARY}
                              title="Editar"
                            >
                              <MdEdit className="text-lg" />
                            </button>
                            <BotonEliminarPago pago={pago} actualizarPagos={actualizarPagos} />
                          </div>
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                            {pago.username}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={pagos.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                isMobile={isMobile}
              />
            </TableContainer>
          </div>
        </div>
      </div>

      <FormDialog
        open={!!editPago}
        onClose={cerrarEditDialog}
        icon={<MdEdit className="text-xl text-primary-500" />}
        title="Editar venta"
        subtitle={`Modificar los datos de la venta #${editPago?.idPago}`}
        onSubmit={handleEditSubmit}
        isLoading={editLoading}
        maxWidth="480px"
      >
        <FormField label="Cliente / Proveedor" error={editFormErrors.cliente}>
          <select
            name="_entidad"
            value={editEntidadValue}
            onChange={handleEditChange}
            className={SELECT_CLASS}
          >
            <option value="" disabled>
              Seleccione
            </option>
            <optgroup label="Clientes">
              {nombreclientes.map((c) => (
                <option key={`c-${c.id}`} value={`cliente:${c.nombre}`}>
                  {c.nombre}
                </option>
              ))}
            </optgroup>
            <optgroup label="Proveedores">
              {nombreproveedores.map((p) => (
                <option key={`p-${p.nombre}`} value={`proveedor:${p.nombre}`}>
                  {p.nombre}
                </option>
              ))}
            </optgroup>
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Monto" error={editFormErrors.monto}>
            <input
              type="number"
              name="monto"
              value={editData.monto}
              onChange={handleEditChange}
              step="any"
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField label="Dolar del dia" error={editFormErrors.usdDelDia}>
            <input
              type="number"
              name="usdDelDia"
              value={editData.usdDelDia}
              onChange={handleEditChange}
              step="any"
              className={INPUT_CLASS}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Medio de Pago" error={editFormErrors.medioPago}>
            <select
              name="medioPago"
              value={editData.medioPago}
              onChange={handleEditChange}
              className={SELECT_CLASS}
            >
              <option value="" disabled>
                Seleccione
              </option>
              {mediodepago.map((m) => (
                <option key={m.nombreMedioPago} value={m.nombreMedioPago}>
                  {m.nombreMedioPago}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Fecha" error={editFormErrors.fecha}>
            <input
              type="date"
              name="fecha"
              value={editData.fecha}
              onChange={handleEditChange}
              className={INPUT_CLASS}
            />
          </FormField>
        </div>
        <FormField
          label={
            <>
              Descripcion <span className="text-gray-400 font-normal">(opcional)</span>
            </>
          }
        >
          <textarea
            name="descripcion"
            value={editData.descripcion}
            onChange={handleEditChange}
            rows={2}
            className={`${INPUT_CLASS} resize-none`}
          />
        </FormField>
      </FormDialog>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={snackbar.close}
        isMobile={isMobile}
      />
    </PageLayout>
  );
};

export default VentasPage;
