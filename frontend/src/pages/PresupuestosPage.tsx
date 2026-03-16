import React, { useState } from 'react';
import {
  MdAdd,
  MdEdit,
  MdDeleteOutline,
  MdSend,
  MdCheck,
  MdClose,
  MdPictureAsPdf,
} from 'react-icons/md';
import { FiFileText } from 'react-icons/fi';
import PageLayout from '@/components/layout/PageLayout';
import AppSnackbar from '@/components/feedback/AppSnackbar';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import Modal from '@/components/shared/Modal';
import FormField from '@/components/shared/FormField';
import EmptyState from '@/components/shared/EmptyState';
import { BTN_CANCEL, SELECT_CLASS, INPUT_CLASS, TH_CLASS } from '@/config/constants';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { usePresupuestos } from '@/hooks/usePresupuestos';
import { usePresupuestoForm } from '@/hooks/usePresupuestoForm';
import { usePresupuestoPDF } from '@/hooks/usePresupuestoPDF';
import { useMobileScreen } from '@/hooks/useMobileScreen';
import { formatMonto, formatFecha } from '@/utils/formatters';
import type { Presupuesto, EstadoPresupuesto } from '@/types/presupuesto';

const estadoBadge: Record<EstadoPresupuesto, string> = {
  borrador: 'bg-gray-100 text-gray-600',
  enviado: 'bg-blue-100 text-blue-700',
  aceptado: 'bg-emerald-100 text-emerald-700',
  rechazado: 'bg-red-100 text-red-700',
};

const PresupuestosPage: React.FC = () => {
  const { isAdmin } = useRequireAuth();
  const isMobile = useMobileScreen();
  const {
    presupuestos,
    nombreclientes,
    mediodepago,
    isLoading,
    isSubmitting,
    snackbar,
    filtroEstado,
    setFiltroEstado,
    filtroCliente,
    setFiltroCliente,
    modalAceptar,
    setModalAceptar,
    modalEliminar,
    setModalEliminar,
    selectedPresupuesto,
    aceptarForm,
    setAceptarForm,
    aceptarFormErrors,
    handleEnviar,
    handleRechazar,
    abrirAceptar,
    handleAceptar,
    abrirEliminar,
    handleEliminar,
    cargarDatos,
  } = usePresupuestos();

  const { generarPDF } = usePresupuestoPDF();

  const [modalCrear, setModalCrear] = useState(false);
  const [editPresupuesto, setEditPresupuesto] = useState<Presupuesto | null>(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [detallePresupuesto, setDetallePresupuesto] = useState<Presupuesto | null>(null);

  const abrirDetalle = async (p: Presupuesto) => {
    try {
      const { presupuestosService } = await import('@/services/presupuestos.service');
      const full = await presupuestosService.obtenerPorId(p.id);
      setDetallePresupuesto(full);
      setModalDetalle(true);
    } catch {
      snackbar.show('Error al cargar detalle', 'error');
    }
  };

  const abrirEditar = async (p: Presupuesto) => {
    try {
      const { presupuestosService } = await import('@/services/presupuestos.service');
      const full = await presupuestosService.obtenerPorId(p.id);
      setEditPresupuesto(full);
    } catch {
      snackbar.show('Error al cargar presupuesto', 'error');
    }
  };

  const handlePDF = async (id: number) => {
    try {
      await generarPDF(id);
    } catch {
      snackbar.show('Error al generar PDF', 'error');
    }
  };

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <FiFileText className="text-lg text-primary-500" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Presupuestos</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              {presupuestos.length}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
            >
              <option value="">Todos los estados</option>
              <option value="borrador">Borrador</option>
              <option value="enviado">Enviado</option>
              <option value="aceptado">Aceptado</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <select
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
            >
              <option value="">Todos los clientes</option>
              {nombreclientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEditPresupuesto(null);
                  setModalCrear(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
              >
                <MdAdd className="text-lg" /> Nuevo
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : presupuestos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16">
            <EmptyState
              title="No se encontraron presupuestos"
              subtitle="Crea un nuevo presupuesto para comenzar"
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th className={TH_CLASS}>#</th>
                    <th className={TH_CLASS}>Cliente</th>
                    <th className={TH_CLASS}>Fecha</th>
                    <th className={`${TH_CLASS} text-right`}>Total</th>
                    <th className={TH_CLASS}>Estado</th>
                    <th className={`${TH_CLASS} text-center`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {presupuestos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-primary-500 whitespace-nowrap">
                        #{p.numero}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {p.cliente_nombre}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatFecha(p.fecha)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">
                        {formatMonto(p.total)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize ${estadoBadge[p.estado]}`}
                        >
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => abrirDetalle(p)}
                            className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-500/10 transition-colors"
                            title="Ver detalle"
                          >
                            <FiFileText className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePDF(p.id)}
                            className="p-1.5 rounded-lg text-primary-500 hover:bg-primary-500/10 transition-colors"
                            title="Generar PDF"
                          >
                            <MdPictureAsPdf className="w-4 h-4" />
                          </button>
                          {isAdmin && p.estado === 'borrador' && (
                            <>
                              <button
                                type="button"
                                onClick={() => abrirEditar(p)}
                                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                title="Editar"
                              >
                                <MdEdit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEnviar(p.id)}
                                disabled={isSubmitting}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Enviar"
                              >
                                <MdSend className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => abrirEliminar(p)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="Eliminar"
                              >
                                <MdDeleteOutline className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {isAdmin && p.estado === 'enviado' && (
                            <>
                              <button
                                type="button"
                                onClick={() => abrirAceptar(p)}
                                disabled={isSubmitting}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Aceptar"
                              >
                                <MdCheck className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRechazar(p.id)}
                                disabled={isSubmitting}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="Rechazar"
                              >
                                <MdClose className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {(modalCrear || editPresupuesto) && (
        <PresupuestoFormDialog
          open={modalCrear || !!editPresupuesto}
          onClose={() => {
            setModalCrear(false);
            setEditPresupuesto(null);
          }}
          editPresupuesto={editPresupuesto}
          onSuccess={() => {
            setModalCrear(false);
            setEditPresupuesto(null);
            cargarDatos();
          }}
        />
      )}

      <Modal
        open={modalDetalle && !!detallePresupuesto}
        onClose={() => setModalDetalle(false)}
        size="xl"
        title={detallePresupuesto ? `Presupuesto #${detallePresupuesto.numero}` : undefined}
        subtitle={
          detallePresupuesto
            ? `${detallePresupuesto.cliente_nombre} · ${formatFecha(detallePresupuesto.fecha)}`
            : undefined
        }
        headerRight={
          detallePresupuesto ? (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold capitalize ${estadoBadge[detallePresupuesto.estado]}`}
            >
              {detallePresupuesto.estado}
            </span>
          ) : undefined
        }
        footer={
          <button type="button" onClick={() => setModalDetalle(false)} className={BTN_CANCEL}>
            Cerrar
          </button>
        }
      >
        {detallePresupuesto && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">
                      Material
                    </th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">
                      Cant.
                    </th>
                    <th className="text-center py-2 text-xs font-semibold text-gray-500 uppercase">
                      Unidad
                    </th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">
                      Precio Unit.
                    </th>
                    <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {detallePresupuesto.items?.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 font-medium text-gray-800">{item.material_nombre}</td>
                      <td className="py-2 text-right text-gray-600">{item.cantidad}</td>
                      <td className="py-2 text-center text-gray-500">{item.material_unidad}</td>
                      <td className="py-2 text-right text-gray-600">
                        {formatMonto(item.precio_unitario)}
                      </td>
                      <td className="py-2 text-right font-semibold text-gray-900">
                        {formatMonto(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatMonto(detallePresupuesto.subtotal)}</span>
              </div>
              {detallePresupuesto.descuento_porcentaje > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Descuento ({detallePresupuesto.descuento_porcentaje}%)
                  </span>
                  <span className="text-red-600">
                    -
                    {formatMonto(
                      (detallePresupuesto.subtotal * detallePresupuesto.descuento_porcentaje) / 100,
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary-500">{formatMonto(detallePresupuesto.total)}</span>
              </div>
            </div>

            {detallePresupuesto.observaciones && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Observaciones</p>
                <p className="text-sm text-gray-700">{detallePresupuesto.observaciones}</p>
              </div>
            )}
          </>
        )}
      </Modal>

      <Modal
        open={modalAceptar}
        onClose={() => setModalAceptar(false)}
        title="Aceptar Presupuesto"
        subtitle={
          selectedPresupuesto
            ? `#${selectedPresupuesto.numero} · ${selectedPresupuesto.cliente_nombre} · ${formatMonto(selectedPresupuesto.total)}`
            : undefined
        }
        onSubmit={handleAceptar}
        submitLabel="Aceptar"
        isLoading={isSubmitting}
      >
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
          Al aceptar se generará una venta y se descontará el stock de los materiales.
        </p>
        <FormField label="Medio de Pago" error={aceptarFormErrors.medioPago}>
          <select
            value={aceptarForm.medioPago}
            onChange={(e) => setAceptarForm((prev) => ({ ...prev, medioPago: e.target.value }))}
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
        <FormField label="Dolar del dia" error={aceptarFormErrors.usdDelDia}>
          <input
            type="number"
            step="any"
            value={aceptarForm.usdDelDia}
            onChange={(e) => setAceptarForm((prev) => ({ ...prev, usdDelDia: e.target.value }))}
            className={INPUT_CLASS}
          />
        </FormField>
      </Modal>

      <ConfirmDialog
        open={modalEliminar}
        title="Eliminar Presupuesto"
        message={`¿Eliminar presupuesto #${selectedPresupuesto?.numero || ''}? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminar}
        onCancel={() => setModalEliminar(false)}
        loading={isSubmitting}
        destructive
      />

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

function PresupuestoFormDialog({
  open,
  onClose,
  editPresupuesto,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  editPresupuesto: Presupuesto | null;
  onSuccess: () => void;
}) {
  const {
    form,
    nombreclientes,
    materiales,
    isSubmitting,
    formErrors,
    itemErrors,
    apiError,
    updateField,
    updateItem,
    addItem,
    removeItem,
    calcularSubtotal,
    calcularTotal,
    getItemSubtotal,
    handleSubmit,
    snackbar,
  } = usePresupuestoForm(editPresupuesto);

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none';

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        size="full"
        title={
          editPresupuesto ? `Editar Presupuesto #${editPresupuesto.numero}` : 'Nuevo Presupuesto'
        }
        onSubmit={() => handleSubmit(onSuccess)}
        submitLabel={editPresupuesto ? 'Guardar' : 'Crear'}
        isLoading={isSubmitting}
        scrollable
      >
        {apiError && <p className="text-sm text-red-600">{apiError}</p>}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Cliente *" error={formErrors.cliente_id}>
            <select
              value={form.cliente_id}
              onChange={(e) => updateField('cliente_id', e.target.value)}
              className={`${inputCls} bg-white`}
            >
              <option value="" disabled>
                Seleccione
              </option>
              {nombreclientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Fecha *" error={formErrors.fecha}>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => updateField('fecha', e.target.value)}
              className={inputCls}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Válido hasta</label>
            <input
              type="date"
              value={form.fecha_validez}
              onChange={(e) => updateField('fecha_validez', e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Descuento (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.descuento_porcentaje}
              onChange={(e) => updateField('descuento_porcentaje', e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Items</label>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary-500 bg-primary-500/10 rounded-lg hover:bg-primary-500/20 transition-colors"
            >
              <MdAdd className="text-sm" /> Agregar línea
            </button>
          </div>
          <div className="space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="flex items-end gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex-[3]">
                  <FormField
                    label={<span className="text-xs text-gray-500">Material</span>}
                    error={itemErrors[i]?.material_id}
                  >
                    <select
                      value={item.material_id}
                      onChange={(e) => updateItem(i, 'material_id', e.target.value)}
                      className={`${inputCls} bg-white text-xs py-1.5`}
                    >
                      <option value="" disabled>
                        Seleccione
                      </option>
                      {materiales.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre} ({m.stock_actual} {m.unidad_abreviatura})
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField
                    label={<span className="text-xs text-gray-500">Cantidad</span>}
                    error={itemErrors[i]?.cantidad}
                  >
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.cantidad}
                      onChange={(e) => updateItem(i, 'cantidad', e.target.value)}
                      className={`${inputCls} text-xs py-1.5`}
                    />
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField
                    label={<span className="text-xs text-gray-500">Precio</span>}
                    error={itemErrors[i]?.precio_unitario}
                  >
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.precio_unitario}
                      onChange={(e) => updateItem(i, 'precio_unitario', e.target.value)}
                      className={`${inputCls} text-xs py-1.5`}
                    />
                  </FormField>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-0.5">Subtotal</label>
                  <p className="text-sm font-semibold text-gray-900 py-1.5">
                    {formatMonto(getItemSubtotal(i))}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors mb-0.5"
                  title="Quitar línea"
                >
                  <MdClose className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Observaciones</label>
          <textarea
            value={form.observaciones}
            onChange={(e) => updateField('observaciones', e.target.value)}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-900 font-medium">{formatMonto(calcularSubtotal())}</span>
          </div>
          {parseFloat(form.descuento_porcentaje) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Descuento ({form.descuento_porcentaje}%)</span>
              <span className="text-red-600">
                -{formatMonto((calcularSubtotal() * parseFloat(form.descuento_porcentaje)) / 100)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-primary-500">{formatMonto(calcularTotal())}</span>
          </div>
        </div>
      </Modal>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={snackbar.close}
        isMobile={false}
      />
    </>
  );
}

export default PresupuestosPage;
