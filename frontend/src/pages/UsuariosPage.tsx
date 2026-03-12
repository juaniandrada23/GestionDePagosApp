import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { FiUserPlus, FiUsers } from 'react-icons/fi';
import { MdDeleteOutline, MdPersonOutline } from 'react-icons/md';
import PageLayout from '@/components/layout/PageLayout';
import FileUpload from '@/components/shared/FileUpload';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import EmptyState from '@/components/shared/EmptyState';
import FormField from '@/components/shared/FormField';
import FormDialog from '@/components/shared/FormDialog';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useAuth } from '@/hooks/useAuth';
import { BTN_ICON_DANGER } from '@/config/constants';

const UsuariosPage: React.FC = () => {
  useRequireAuth();
  const { user, isAdmin } = useAuth();
  const {
    usuarios,
    imagenUsuario,
    modalOpen,
    setModalOpen,
    modalOpen2,
    setModalOpen2,
    usuarioAEliminar,
    nuevoUsuario,
    isLoading,
    isLoading2,
    isLoadingSkeleton,
    cargarDatos,
    handleNuevoUsuarioChange,
    handleAceptarClick,
    abrirModalBorrar,
    handleBorrarClick,
  } = useUsuarios();

  return (
    <PageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div
          className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 ${!isAdmin ? 'max-w-md mx-auto' : ''}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#006989]/10 flex items-center justify-center flex-shrink-0">
              {imagenUsuario ? (
                <img
                  className="w-full h-full object-cover"
                  src={imagenUsuario}
                  alt={user?.name || 'Usuario'}
                />
              ) : (
                <span className="text-2xl font-bold text-[#006989]">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-lg font-bold text-gray-900">{user?.name}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#006989]/10 text-[#006989] mt-0.5">
                  <MdPersonOutline className="text-sm" />
                  {user?.role}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <FileUpload idUsuario={user?.id || ''} cargarDatos={cargarDatos} />
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-white rounded-lg bg-[#006989] hover:bg-[#053F61] transition-colors"
                  >
                    <FiUserPlus className="text-[15px]" /> Agregar usuario
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#006989]/10 flex items-center justify-center">
                  <FiUsers className="text-sm text-[#006989]" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Usuarios registrados</h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                {usuarios.length} {usuarios.length === 1 ? 'usuario' : 'usuarios'}
              </span>
            </div>

            {isLoadingSkeleton ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        variant="rounded"
                        width={40}
                        height={40}
                        sx={{ borderRadius: '10px' }}
                      />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton variant="rounded" width="55%" height={14} />
                        <Skeleton variant="rounded" width="35%" height={11} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : usuarios.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16">
                <EmptyState
                  title="No se encontraron usuarios"
                  subtitle="Agrega un nuevo usuario para comenzar"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#006989]/10 flex items-center justify-center flex-shrink-0">
                        {u.imagen ? (
                          <img
                            className="w-full h-full object-cover"
                            src={u.imagen}
                            alt={u.username}
                          />
                        ) : (
                          <span className="text-sm font-bold text-[#006989]">
                            {u.username?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{u.username}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {u.email || 'Sin email'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => abrirModalBorrar(u.id, u.username)}
                        className={BTN_ICON_DANGER}
                        title="Eliminar"
                      >
                        <MdDeleteOutline className="text-lg" />
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          u.role_name === 'Administrador'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {u.role_name}
                      </span>
                      {u.descripcion && (
                        <span className="text-xs text-gray-400 truncate" title={u.descripcion}>
                          {u.descripcion}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <FormDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={<FiUserPlus className="text-xl text-[#006989]" />}
        title="Agregar usuario"
        subtitle="Crear una nueva cuenta de usuario"
        onSubmit={handleAceptarClick}
        submitLabel="Agregar"
        isLoading={isLoading}
      >
        <FormField label="Nombre de usuario">
          <input
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={handleNuevoUsuarioChange}
            autoFocus
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none transition"
          />
        </FormField>
        <FormField label="Contraseña">
          <input
            type="password"
            name="contraseña"
            value={nuevoUsuario.contraseña}
            onChange={handleNuevoUsuarioChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#006989] focus:border-[#006989] outline-none transition"
          />
        </FormField>
      </FormDialog>

      <ConfirmDialog
        open={modalOpen2}
        title="Borrar Usuario"
        message={`¿Está seguro de que quiere borrar el usuario "${usuarioAEliminar?.username || ''}"?`}
        onConfirm={() => usuarioAEliminar && handleBorrarClick(usuarioAEliminar.id)}
        onCancel={() => setModalOpen2(false)}
        loading={isLoading2}
        destructive
      />
    </PageLayout>
  );
};

export default UsuariosPage;
