import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { MdSearch, MdAdd, MdEdit, MdDeleteOutline, MdWarning, MdInventory } from 'react-icons/md';
import { FiPackage, FiAlertTriangle, FiArrowUp, FiArrowDown, FiRefreshCw } from 'react-icons/fi';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import Modal from '@/components/shared/Modal';
import ErrorAlert from '@/components/shared/ErrorAlert';
import FormField from '@/components/shared/FormField';
import { BTN_CANCEL } from '@/config/constants';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useMateriales } from '@/hooks/useMateriales';

const MaterialesPage: React.FC = () => {
  const { isAdmin } = useRequireAuth();
  const {
    materiales,
    lowStock,
    categorias,
    unidades,
    selectedMaterial,
    movimientos,
    isLoading,
    isSubmitting,
    formErrors,
    movFormErrors,
    apiError,
    busqueda,
    setBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    modalCrear,
    setModalCrear,
    modalEditar,
    setModalEditar,
    modalMovimiento,
    setModalMovimiento,
    modalDetalle,
    setModalDetalle,
    modalEliminar,
    setModalEliminar,
    form,
    updateForm,
    movForm,
    updateMovForm,
    abrirCrear,
    abrirEditar,
    abrirDetalle,
    abrirMovimiento,
    abrirEliminar,
    handleCrear,
    handleEditar,
    handleEliminar,
    handleMovimiento,
  } = useMateriales();

  const stockColor = (m: { stock_actual: number; stock_minimo: number }) =>
    m.stock_actual <= m.stock_minimo
      ? 'bg-red-100 text-red-700'
      : 'bg-emerald-100 text-emerald-700';

  const tipoIcon = (tipo: string) => {
    if (tipo === 'entrada') return <FiArrowDown className="text-emerald-500" />;
    if (tipo === 'salida') return <FiArrowUp className="text-red-500" />;
    return <FiRefreshCw className="text-blue-500" />;
  };

  const inputCls =
    'w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none';

  const renderFormFields = (isEdit: boolean) => (
    <div className="space-y-3">
      <FormField label="Nombre *" error={formErrors.nombre}>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => updateForm('nombre', e.target.value)}
          className={inputCls}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Precio venta *" error={formErrors.precio_venta}>
          <input
            type="number"
            step="0.01"
            value={form.precio_venta}
            onChange={(e) => updateForm('precio_venta', e.target.value)}
            className={inputCls}
          />
        </FormField>
        <FormField label="Precio costo" error={formErrors.precio_costo}>
          <input
            type="number"
            step="0.01"
            value={form.precio_costo}
            onChange={(e) => updateForm('precio_costo', e.target.value)}
            className={inputCls}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Codigo" error={formErrors.codigo}>
          <input
            type="text"
            value={form.codigo}
            onChange={(e) => updateForm('codigo', e.target.value)}
            className={inputCls}
          />
        </FormField>
        <FormField label="Unidad *" error={formErrors.unidad_id}>
          <select
            value={form.unidad_id}
            onChange={(e) => updateForm('unidad_id', e.target.value)}
            className={`${inputCls} bg-white`}
          >
            <option value="">Seleccione</option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} ({u.abreviatura})
              </option>
            ))}
          </select>
        </FormField>
      </div>
      {!isEdit && (
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Stock inicial" error={formErrors.stock_actual}>
            <input
              type="number"
              step="0.01"
              value={form.stock_actual}
              onChange={(e) => updateForm('stock_actual', e.target.value)}
              className={inputCls}
            />
          </FormField>
          <FormField label="Stock minimo" error={formErrors.stock_minimo}>
            <input
              type="number"
              step="0.01"
              value={form.stock_minimo}
              onChange={(e) => updateForm('stock_minimo', e.target.value)}
              className={inputCls}
            />
          </FormField>
        </div>
      )}
      {isEdit && (
        <FormField label="Stock minimo" error={formErrors.stock_minimo}>
          <input
            type="number"
            step="0.01"
            value={form.stock_minimo}
            onChange={(e) => updateForm('stock_minimo', e.target.value)}
            className={inputCls}
          />
        </FormField>
      )}
      <FormField label="Categoria" error={formErrors.categoria_id}>
        <select
          value={form.categoria_id}
          onChange={(e) => updateForm('categoria_id', e.target.value)}
          className={`${inputCls} bg-white`}
        >
          <option value="">Sin categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Descripcion" error={formErrors.descripcion}>
        <textarea
          value={form.descripcion}
          onChange={(e) => updateForm('descripcion', e.target.value)}
          rows={2}
          className={`${inputCls} resize-none`}
        />
      </FormField>
    </div>
  );

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {lowStock.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="text-amber-600" />
              <h3 className="text-sm font-semibold text-amber-800">
                Stock bajo ({lowStock.length} materiales)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStock.slice(0, 5).map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-xs font-medium text-amber-800"
                >
                  <MdWarning className="text-sm" /> {m.nombre}: {m.stock_actual}/{m.stock_minimo}{' '}
                  {m.unidad_abreviatura}
                </span>
              ))}
              {lowStock.length > 5 && (
                <span className="text-xs text-amber-600">+{lowStock.length - 5} mas</span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#006989]/10 flex items-center justify-center">
              <FiPackage className="text-lg text-[#006989]" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Materiales</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              {materiales.length}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar..."
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none w-48"
              />
            </div>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none bg-white"
            >
              <option value="">Todas las categorias</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {isAdmin && (
              <button
                type="button"
                onClick={abrirCrear}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white rounded-lg bg-[#006989] hover:bg-[#053F61] transition-colors"
              >
                <MdAdd className="text-lg" /> Nuevo
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <Skeleton variant="rounded" width="70%" height={16} />
                <Skeleton variant="rounded" width="40%" height={12} sx={{ mt: 1 }} />
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={40}
                  sx={{ mt: 2, borderRadius: '8px' }}
                />
              </div>
            ))}
          </div>
        ) : materiales.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <MdInventory className="text-2xl text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No se encontraron materiales</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {materiales.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                onClick={() => abrirDetalle(m)}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{m.nombre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {m.codigo || 'Sin codigo'}{' '}
                      {m.categoria_nombre ? `| ${m.categoria_nombre}` : ''}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${stockColor(m)}`}
                  >
                    {m.stock_actual} {m.unidad_abreviatura}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      Venta:{' '}
                      <strong className="text-gray-700">
                        ${Number(m.precio_venta).toLocaleString()}
                      </strong>
                    </span>
                    <span>
                      Costo:{' '}
                      <strong className="text-gray-700">
                        ${Number(m.precio_costo).toLocaleString()}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => abrirMovimiento(m)}
                      className="p-1.5 rounded-lg text-[#006989] hover:bg-[#006989]/10 transition-colors"
                      title="Movimiento"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => abrirEditar(m)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                          title="Editar"
                        >
                          <MdEdit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => abrirEliminar(m)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <MdDeleteOutline className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modalCrear}
        onClose={() => setModalCrear(false)}
        size="md"
        title="Nuevo material"
        onSubmit={handleCrear}
        submitLabel="Crear"
        isLoading={isSubmitting}
      >
        <ErrorAlert message={apiError} />
        {renderFormFields(false)}
      </Modal>

      <Modal
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        size="md"
        title="Editar material"
        onSubmit={handleEditar}
        submitLabel="Guardar"
        isLoading={isSubmitting}
      >
        <ErrorAlert message={apiError} />
        {renderFormFields(true)}
      </Modal>

      <Modal
        open={modalMovimiento}
        onClose={() => setModalMovimiento(false)}
        title="Registrar movimiento"
        subtitle={
          selectedMaterial
            ? `${selectedMaterial.nombre} (Stock: ${selectedMaterial.stock_actual} ${selectedMaterial.unidad_abreviatura})`
            : undefined
        }
        onSubmit={handleMovimiento}
        submitLabel="Registrar"
        isLoading={isSubmitting}
      >
        <ErrorAlert message={apiError} />
        <FormField label="Tipo" error={movFormErrors.tipo}>
          <select
            value={movForm.tipo}
            onChange={(e) => updateMovForm('tipo', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none bg-white"
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </FormField>
        <FormField
          label={movForm.tipo === 'ajuste' ? 'Nuevo stock' : 'Cantidad'}
          error={movFormErrors.cantidad}
        >
          <input
            type="number"
            step="0.01"
            min="0"
            value={movForm.cantidad}
            onChange={(e) => updateMovForm('cantidad', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none"
          />
        </FormField>
        <FormField label="Motivo" error={movFormErrors.motivo}>
          <input
            type="text"
            value={movForm.motivo}
            onChange={(e) => updateMovForm('motivo', e.target.value)}
            placeholder="Descripcion opcional"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none"
          />
        </FormField>
      </Modal>

      <Modal
        open={modalDetalle && !!selectedMaterial}
        onClose={() => setModalDetalle(false)}
        size="lg"
        title={selectedMaterial?.nombre}
        subtitle={
          selectedMaterial
            ? `${selectedMaterial.codigo || 'Sin codigo'} ${selectedMaterial.categoria_nombre ? `| ${selectedMaterial.categoria_nombre}` : ''}`
            : undefined
        }
        headerRight={
          selectedMaterial ? (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${stockColor(selectedMaterial)}`}
            >
              {selectedMaterial.stock_actual} {selectedMaterial.unidad_abreviatura}
            </span>
          ) : undefined
        }
        footer={
          <button type="button" onClick={() => setModalDetalle(false)} className={BTN_CANCEL}>
            Cerrar
          </button>
        }
      >
        {selectedMaterial && (
          <>
            {selectedMaterial.descripcion && (
              <p className="text-sm text-gray-600">{selectedMaterial.descripcion}</p>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Venta</p>
                <p className="text-sm font-bold text-gray-900">
                  ${Number(selectedMaterial.precio_venta).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Costo</p>
                <p className="text-sm font-bold text-gray-900">
                  ${Number(selectedMaterial.precio_costo).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Stock min.</p>
                <p className="text-sm font-bold text-gray-900">
                  {selectedMaterial.stock_minimo} {selectedMaterial.unidad_abreviatura}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Historial de movimientos</h3>
              {movimientos.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  Sin movimientos registrados
                </p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {movimientos.map((mov) => (
                    <div
                      key={mov.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50"
                    >
                      {tipoIcon(mov.tipo)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {mov.tipo}: {mov.cantidad}
                        </p>
                        <p className="text-xs text-gray-400">
                          {mov.motivo || 'Sin motivo'} &middot; {mov.username}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-600">
                          Stock: {mov.stock_resultante}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(mov.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={modalEliminar}
        title="Desactivar Material"
        message={`¿Desactivar "${selectedMaterial?.nombre || ''}"? Podra reactivarse luego.`}
        onConfirm={handleEliminar}
        onCancel={() => setModalEliminar(false)}
        loading={isSubmitting}
        destructive
      />
    </PageLayout>
  );
};

export default MaterialesPage;
