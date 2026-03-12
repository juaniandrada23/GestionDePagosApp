import { useState, useEffect, useCallback } from 'react';
import { proveedoresService } from '@/services/proveedores.service';
import { useSnackbar } from './useSnackbar';
import { validateForm, type FieldErrors } from '@/lib/validation';
import { proveedorSchema, type ProveedorFormData } from '@/schemas';
import type { Proveedor } from '@/types/proveedor';

export function useProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({ nombre: '' });
  const [formErrors, setFormErrors] = useState<FieldErrors<ProveedorFormData>>({});
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const snackbar = useSnackbar();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [proveedorAEliminar, setProveedorAEliminar] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editFormErrors, setEditFormErrors] = useState<FieldErrors<ProveedorFormData>>({});
  const [editLoading, setEditLoading] = useState(false);

  const cargarDatos = useCallback(() => {
    proveedoresService
      .obtenerTodos()
      .then((data) => {
        setProveedores(data);
        setIsLoadingSkeleton(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleNuevoProveedorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoProveedor({ ...nuevoProveedor, [e.target.name]: e.target.value });
    setFormErrors({});
  };

  const agregarProveedor = () => {
    const result = validateForm(proveedorSchema, { nombre: nuevoProveedor.nombre });
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    if (proveedores.find((p) => p.nombre === result.data.nombre)) {
      setFormErrors({ nombre: 'Ya existe un proveedor con ese nombre' });
      return;
    }

    setIsLoading(true);
    proveedoresService
      .crear({ nombre: result.data.nombre })
      .then(() => {
        setNuevoProveedor({ nombre: '' });
        setFormErrors({});
        snackbar.show('Proveedor agregado correctamente');
        setIsLoading(false);
        cargarDatos();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const abrirEditDialog = (id: number) => {
    const proveedor = proveedores.find((p) => p.id === id);
    if (proveedor) {
      setEditId(id);
      setEditNombre(proveedor.nombre);
      setEditFormErrors({});
      setEditDialogOpen(true);
    }
  };

  const cerrarEditDialog = () => {
    setEditDialogOpen(false);
    setEditId(null);
    setEditNombre('');
    setEditFormErrors({});
  };

  const editarProveedor = () => {
    const result = validateForm(proveedorSchema, { nombre: editNombre });
    if (!result.success) {
      setEditFormErrors(result.errors);
      return;
    }

    if (proveedores.find((p) => p.nombre === result.data.nombre && p.id !== editId)) {
      setEditFormErrors({ nombre: 'Ya existe un proveedor con ese nombre' });
      return;
    }

    setEditLoading(true);
    proveedoresService
      .actualizar(editId!, { nombre: result.data.nombre })
      .then(() => {
        snackbar.show('Proveedor modificado correctamente');
        setEditLoading(false);
        cerrarEditDialog();
        cargarDatos();
      })
      .catch(() => {
        setEditLoading(false);
      });
  };

  const abrirDeleteDialog = (id: number, nombre: string) => {
    setDeleteDialogOpen(true);
    setProveedorAEliminar({ id, nombre });
  };

  const borrarProveedor = (id: number) => {
    setDeleteDialogOpen(false);
    proveedoresService
      .eliminar(id)
      .then(() => {
        snackbar.show('Proveedor borrado correctamente');
        cargarDatos();
      })
      .catch(() => {});
  };

  return {
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
  };
}
