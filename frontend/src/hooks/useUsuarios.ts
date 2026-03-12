import { useState, useEffect, useCallback } from 'react';
import { usuariosService } from '@/services/usuarios.service';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import type { Usuario, NuevoUsuario } from '@/types/usuario';

export function useUsuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [imagenUsuario, setImagenUsuario] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<{ id: number; username: string } | null>(
    null,
  );
  const [nuevoUsuario, setNuevoUsuario] = useState<NuevoUsuario>({ nombre: '', contraseña: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

  const cargarDatos = useCallback(() => {
    usuariosService
      .obtenerTodos()
      .then((data) => {
        setUsuarios(data);
        setIsLoadingSkeleton(false);
      })
      .catch(() => {
        setIsLoadingSkeleton(false);
      });

    if (user) {
      usuariosService
        .obtenerDatosSesion(user.id)
        .then((data) => {
          if (data[0]) setImagenUsuario(data[0].imagen || '');
        })
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleNuevoUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoUsuario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAceptarClick = () => {
    setIsLoading(true);
    authService
      .crearEmpleado(nuevoUsuario.nombre, nuevoUsuario.contraseña)
      .then(() => {
        setModalOpen(false);
        setIsLoading(false);
        setNuevoUsuario({ nombre: '', contraseña: '' });
        cargarDatos();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const abrirModalBorrar = (id: number, username: string) => {
    setModalOpen2(true);
    setUsuarioAEliminar({ id, username });
  };

  const handleBorrarClick = (userId: number) => {
    setIsLoading2(true);
    usuariosService
      .eliminar(userId)
      .then(() => {
        cargarDatos();
        setModalOpen2(false);
        setIsLoading2(false);
      })
      .catch(() => {
        setIsLoading2(false);
      });
  };

  return {
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
  };
}
