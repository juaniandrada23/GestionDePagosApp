import React from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { TiEdit, TiUserDelete } from 'react-icons/ti';
import { MdAdd } from 'react-icons/md';
import PageLayout from '@/components/layout/PageLayout';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import AppSnackbar from '@/components/feedback/AppSnackbar';
import TableContainer from '@/components/shared/TableContainer';
import TableSkeleton from '@/components/shared/TableSkeleton';
import EmptyState from '@/components/shared/EmptyState';
import FormField from '@/components/shared/FormField';
import FormDialog from '@/components/shared/FormDialog';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProveedores } from '@/hooks/useProveedores';
import { useMobileScreen } from '@/hooks/useMobileScreen';
import { INPUT_CLASS, BTN_ICON_PRIMARY, BTN_ICON_DANGER } from '@/config/constants';

const ProveedoresPage: React.FC = () => {
  useRequireAuth();
  const isMobile = useMobileScreen();
  const {
    proveedores,
    nuevoProveedor,
    formErrors,
    isLoadingSkeleton,
    isLoading,
    snackbar,
    handleNuevoProveedorChange,
    agregarProveedor,
    editDialogOpen,
    editNombre,
    editFormErrors,
    editLoading,
    setEditNombre,
    abrirEditDialog,
    cerrarEditDialog,
    editarProveedor,
    deleteDialogOpen,
    setDeleteDialogOpen,
    proveedorAEliminar,
    abrirDeleteDialog,
    borrarProveedor,
  } = useProveedores();

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-5" style={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <TableContainer
              title="Proveedores"
              count={proveedores.length}
              countLabel="proveedores"
              countLabelSingular="proveedor"
            >
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20`}
                    >
                      ID
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider`}
                    >
                      Nombre
                    </th>
                    <th
                      className={`px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32`}
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingSkeleton ? (
                    <TableSkeleton rows={4} columns={3} />
                  ) : proveedores.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center">
                        <EmptyState
                          title="No hay proveedores registrados"
                          subtitle="Agrega uno desde el formulario"
                        />
                      </td>
                    </tr>
                  ) : (
                    proveedores.map((proveedor) => (
                      <tr key={proveedor.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                            {proveedor.id}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-800">
                          {proveedor.nombre}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              className={BTN_ICON_PRIMARY}
                              onClick={() => abrirEditDialog(proveedor.id)}
                              title="Editar proveedor"
                            >
                              <TiEdit className="text-lg" />
                            </button>
                            <button
                              className={BTN_ICON_DANGER}
                              onClick={() => abrirDeleteDialog(proveedor.id, proveedor.nombre)}
                              title="Eliminar proveedor"
                            >
                              <TiUserDelete className="text-lg" />
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

          <Grid item xs={12} lg={4}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <span className="flex items-center gap-2 text-gray-700 font-semibold">
                  <MdAdd className="text-lg text-[#006989]" /> Nuevo Proveedor
                </span>
              </div>
              <div className="px-5 pb-5">
                <form
                  className="space-y-4 pt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    agregarProveedor();
                  }}
                >
                  <FormField label="Nombre del proveedor" error={formErrors.nombre}>
                    <input
                      type="text"
                      name="nombre"
                      value={nuevoProveedor.nombre}
                      onChange={handleNuevoProveedorChange}
                      placeholder="Ej: Distribuidora Norte"
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
                      'Agregar Proveedor'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <FormDialog
        open={editDialogOpen}
        onClose={cerrarEditDialog}
        icon={<TiEdit className="text-xl text-[#006989]" />}
        title="Editar proveedor"
        onSubmit={editarProveedor}
        isLoading={editLoading}
      >
        <FormField label="Nombre del proveedor" error={editFormErrors.nombre}>
          <input
            type="text"
            value={editNombre}
            onChange={(e) => {
              setEditNombre(e.target.value);
            }}
            autoFocus
            className={INPUT_CLASS}
          />
        </FormField>
      </FormDialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Borrar proveedor"
        message={`¿Está seguro de que quiere borrar el proveedor "${proveedorAEliminar?.nombre || ''}"? Se borrarán todos los pagos relacionados.`}
        onConfirm={() => proveedorAEliminar && borrarProveedor(proveedorAEliminar.id)}
        onCancel={() => setDeleteDialogOpen(false)}
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

export default ProveedoresPage;
