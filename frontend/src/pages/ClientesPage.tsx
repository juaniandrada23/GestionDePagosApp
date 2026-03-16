import React from 'react';
import { MdSearch, MdAdd, MdEdit, MdDeleteOutline } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import Modal from '@/components/shared/Modal';
import ErrorAlert from '@/components/shared/ErrorAlert';
import FormField from '@/components/shared/FormField';
import { BTN_CANCEL } from '@/config/constants';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useClientes } from '@/hooks/useClientes';

const ClientesPage: React.FC = () => {
  const { isAdmin } = useRequireAuth();
  const {
    clientes,
    selectedCliente,
    isLoading,
    isSubmitting,
    formErrors,
    apiError,
    busqueda,
    setBusqueda,
    modalCrear,
    setModalCrear,
    modalEditar,
    setModalEditar,
    modalDetalle,
    setModalDetalle,
    modalEliminar,
    setModalEliminar,
    form,
    updateForm,
    abrirCrear,
    abrirEditar,
    abrirDetalle,
    abrirEliminar,
    handleCrear,
    handleEditar,
    handleEliminar,
  } = useClientes();

  const inputCls =
    'w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none';

  const renderFormFields = () => (
    <div className="space-y-3">
      <FormField label="Nombre *" error={formErrors.nombre}>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => updateForm('nombre', e.target.value)}
          className={inputCls}
        />
      </FormField>
      <FormField label="CUIT / DNI" error={formErrors.cuit_dni}>
        <input
          type="text"
          value={form.cuit_dni}
          onChange={(e) => updateForm('cuit_dni', e.target.value)}
          className={inputCls}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Telefono" error={formErrors.telefono}>
          <input
            type="text"
            value={form.telefono}
            onChange={(e) => updateForm('telefono', e.target.value)}
            className={inputCls}
          />
        </FormField>
        <FormField label="Email" error={formErrors.email}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
            className={inputCls}
          />
        </FormField>
      </div>
      <FormField label="Direccion" error={formErrors.direccion}>
        <input
          type="text"
          value={form.direccion}
          onChange={(e) => updateForm('direccion', e.target.value)}
          className={inputCls}
        />
      </FormField>
    </div>
  );

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <FiUsers className="text-lg text-primary-500" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Clientes</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              {clientes.length}
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
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none w-48"
              />
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={abrirCrear}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
              >
                <MdAdd className="text-lg" /> Nuevo
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-2/5 mt-2" />
                <div className="h-10 bg-gray-200 rounded mt-3" />
              </div>
            ))}
          </div>
        ) : clientes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <FiUsers className="text-2xl text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No se encontraron clientes</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {clientes.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-card-hover"
                onClick={() => abrirDetalle(c)}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.nombre}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.cuit_dni || 'Sin CUIT/DNI'}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${c.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {c.telefono && <span>{c.telefono}</span>}
                    {c.email && <span>{c.email}</span>}
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => abrirEditar(c)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Editar"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirEliminar(c)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Desactivar"
                      >
                        <MdDeleteOutline className="w-4 h-4" />
                      </button>
                    </div>
                  )}
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
        title="Nuevo cliente"
        onSubmit={handleCrear}
        submitLabel="Crear"
        isLoading={isSubmitting}
      >
        <ErrorAlert message={apiError} />
        {renderFormFields()}
      </Modal>

      <Modal
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        size="md"
        title="Editar cliente"
        onSubmit={handleEditar}
        submitLabel="Guardar"
        isLoading={isSubmitting}
      >
        <ErrorAlert message={apiError} />
        {renderFormFields()}
      </Modal>

      <Modal
        open={modalDetalle && !!selectedCliente}
        onClose={() => setModalDetalle(false)}
        size="md"
        title={selectedCliente?.nombre}
        headerRight={
          selectedCliente ? (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${selectedCliente.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
            >
              {selectedCliente.activo ? 'Activo' : 'Inactivo'}
            </span>
          ) : undefined
        }
        footer={
          <button type="button" onClick={() => setModalDetalle(false)} className={BTN_CANCEL}>
            Cerrar
          </button>
        }
      >
        {selectedCliente && (
          <div className="space-y-2">
            {selectedCliente.cuit_dni && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">CUIT/DNI</span>
                <span className="text-gray-900">{selectedCliente.cuit_dni}</span>
              </div>
            )}
            {selectedCliente.telefono && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Telefono</span>
                <span className="text-gray-900">{selectedCliente.telefono}</span>
              </div>
            )}
            {selectedCliente.email && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900">{selectedCliente.email}</span>
              </div>
            )}
            {selectedCliente.direccion && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Direccion</span>
                <span className="text-gray-900">{selectedCliente.direccion}</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={modalEliminar}
        title="Desactivar Cliente"
        message={`¿Desactivar "${selectedCliente?.nombre || ''}"? Podra reactivarse luego.`}
        onConfirm={handleEliminar}
        onCancel={() => setModalEliminar(false)}
        loading={isSubmitting}
        destructive
      />
    </PageLayout>
  );
};

export default ClientesPage;
