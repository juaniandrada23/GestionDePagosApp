import React from 'react';
import Grid from '@mui/material/Grid';
import { MdAdd, MdEdit, MdDeleteOutline } from 'react-icons/md';
import CircularProgress from '@mui/material/CircularProgress';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import AppSnackbar from '@/components/feedback/AppSnackbar';
import CollapsibleSection from '@/components/shared/CollapsibleSection';
import TableContainer from '@/components/shared/TableContainer';
import TableSkeleton from '@/components/shared/TableSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import FormField from '@/components/shared/FormField';
import FormDialog from '@/components/shared/FormDialog';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useMediosPago } from '@/hooks/useMediosPago';
import { useMobileScreen } from '@/hooks/useMobileScreen';
import { INPUT_CLASS, BTN_ICON_PRIMARY, BTN_ICON_DANGER, TH_CLASS } from '@/config/constants';

const MediosPagoPage: React.FC = () => {
  useRequireAuth();
  const isMobile = useMobileScreen();
  const {
    mediosPago,
    nuevoMedioPago,
    setNuevoMedioPago,
    actualizarMedioPago,
    setActualizarMedioPago,
    medioPagoSeleccionado,
    setMedioPagoSeleccionado,
    showModal,
    setShowModal,
    medioPagoToDelete,
    isLoading,
    isLoadingEdit,
    isLoadingDelete,
    isLoadingSkeleton,
    formErrors,
    editFormErrors,
    snackbar,
    handleBorrarClick,
    handleBorrar,
    handleAgregar,
    handleActualizar,
    handleCancelar,
  } = useMediosPago();

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <CollapsibleSection
              title="Nuevo Medio de Pago"
              icon={<MdAdd className="text-lg text-[#006989]" />}
            >
              <form
                className="space-y-4 pt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAgregar();
                }}
              >
                <FormField label="Nombre" error={formErrors.nombre}>
                  <input
                    type="text"
                    value={nuevoMedioPago}
                    onChange={(e) => setNuevoMedioPago(e.target.value)}
                    placeholder="Ej: Transferencia, Efectivo..."
                    className={INPUT_CLASS}
                  />
                </FormField>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#006989] text-white font-semibold text-sm rounded-lg hover:bg-[#053F61] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={18} color="inherit" /> Agregando...
                    </>
                  ) : (
                    'Agregar'
                  )}
                </button>
              </form>
            </CollapsibleSection>
          </Grid>

          <Grid item xs={12} lg={8}>
            <TableContainer
              title="Medios de Pago"
              count={mediosPago.length}
              countLabel="registros"
              countLabelSingular="registro"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th className={TH_CLASS}>Medio de Pago</th>
                    <th className={`${TH_CLASS} text-center`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingSkeleton ? (
                    <TableSkeleton columns={2} />
                  ) : mediosPago.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-16 text-center">
                        <EmptyState
                          title="No se encontraron medios de pago"
                          subtitle="Agrega un nuevo medio de pago"
                        />
                      </td>
                    </tr>
                  ) : (
                    mediosPago.map((mp) => (
                      <tr
                        key={mp.nombreMedioPago}
                        className="hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {mp.nombreMedioPago}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setMedioPagoSeleccionado(mp.nombreMedioPago);
                                setActualizarMedioPago(mp.nombreMedioPago);
                              }}
                              className={BTN_ICON_PRIMARY}
                              title="Editar"
                            >
                              <MdEdit className="text-lg" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBorrarClick(mp.nombreMedioPago)}
                              className={BTN_ICON_DANGER}
                              title="Eliminar"
                            >
                              <MdDeleteOutline className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>

      <FormDialog
        open={!!medioPagoSeleccionado}
        onClose={handleCancelar}
        icon={<MdEdit className="text-xl text-[#006989]" />}
        title="Editar medio de pago"
        subtitle={`Renombrar \u201C${medioPagoSeleccionado}\u201D`}
        onSubmit={handleActualizar}
        isLoading={isLoadingEdit}
      >
        <FormField label="Nuevo nombre" error={editFormErrors.nombre}>
          <input
            type="text"
            value={actualizarMedioPago}
            onChange={(e) => setActualizarMedioPago(e.target.value)}
            placeholder="Nuevo nombre..."
            autoFocus
            className={INPUT_CLASS}
          />
        </FormField>
      </FormDialog>

      <ConfirmDialog
        open={showModal}
        title="Confirmar borrado"
        message={`¿Está seguro que desea borrar el medio de pago '${medioPagoToDelete}'?`}
        onConfirm={handleBorrar}
        onCancel={() => setShowModal(false)}
        loading={isLoadingDelete}
        confirmText="Borrar"
        destructive
      />

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        title={snackbar.title}
        onClose={snackbar.close}
        isMobile={isMobile}
      />
    </PageLayout>
  );
};

export default MediosPagoPage;
