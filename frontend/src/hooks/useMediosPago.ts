import { useState, useEffect, useCallback } from 'react';
import { mediosPagoService } from '@/services/mediosPago.service';
import { useSnackbar } from './useSnackbar';
import { validateForm, type FieldErrors } from '@/lib/validation';
import { medioPagoSchema, type MedioPagoFormData } from '@/schemas';
import type { MedioPago } from '@/types/medioPago';

export function useMediosPago() {
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([]);
  const [nuevoMedioPago, setNuevoMedioPago] = useState('');
  const [actualizarMedioPago, setActualizarMedioPago] = useState('');
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [medioPagoToDelete, setMedioPagoToDelete] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [formErrors, setFormErrors] = useState<FieldErrors<MedioPagoFormData>>({});
  const [editFormErrors, setEditFormErrors] = useState<FieldErrors<MedioPagoFormData>>({});
  const snackbar = useSnackbar();

  const cargarDatos = useCallback(() => {
    mediosPagoService
      .obtenerTodos()
      .then((data) => {
        setMediosPago(data);
        setIsLoadingSkeleton(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleBorrarClick = (nombre: string) => {
    setMedioPagoToDelete(nombre);
    setShowModal(true);
  };

  const handleBorrar = () => {
    setIsLoadingDelete(true);
    mediosPagoService
      .eliminar(medioPagoToDelete)
      .then(() => {
        setIsLoadingDelete(false);
        snackbar.show('Medio de pago borrado correctamente', 'success', 'Borrado realizado');
        cargarDatos();
      })
      .catch(() => {
        snackbar.show('No se pudo borrar el medio de pago', 'error', 'Ocurrio un problema');
        setIsLoadingDelete(false);
      })
      .finally(() => setShowModal(false));
  };

  const handleAgregar = () => {
    const result = validateForm(medioPagoSchema, { nombre: nuevoMedioPago });
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setFormErrors({});
    setIsLoading(true);
    mediosPagoService
      .crear(result.data.nombre)
      .then(() => {
        setNuevoMedioPago('');
        snackbar.show('Medio de pago agregado correctamente', 'success', 'Agregado realizado');
        setIsLoading(false);
        cargarDatos();
      })
      .catch(() => {
        setFormErrors({ nombre: 'No se pudo agregar el medio de pago' });
        setIsLoading(false);
      });
  };

  const handleActualizar = () => {
    if (!medioPagoSeleccionado) return;
    const result = validateForm(medioPagoSchema, { nombre: actualizarMedioPago });
    if (!result.success) {
      setEditFormErrors(result.errors);
      return;
    }

    if (result.data.nombre === medioPagoSeleccionado) {
      setEditFormErrors({ nombre: 'El nombre es igual al actual' });
      return;
    }

    setEditFormErrors({});
    setIsLoadingEdit(true);
    mediosPagoService
      .actualizar(medioPagoSeleccionado, result.data.nombre)
      .then(() => {
        cargarDatos();
        setMedioPagoSeleccionado(null);
        setActualizarMedioPago('');
        snackbar.show(
          'Medio de pago modificado correctamente',
          'success',
          'Modificacion realizada',
        );
        setIsLoadingEdit(false);
      })
      .catch(() => {
        setEditFormErrors({ nombre: 'No se pudo modificar el medio de pago' });
        setIsLoadingEdit(false);
      });
  };

  const handleCancelar = () => {
    setMedioPagoSeleccionado(null);
    setActualizarMedioPago('');
    setEditFormErrors({});
  };

  return {
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
  };
}
