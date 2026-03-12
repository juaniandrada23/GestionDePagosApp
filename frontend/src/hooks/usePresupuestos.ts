import { useState, useEffect, useCallback } from 'react';
import { presupuestosService } from '@/services/presupuestos.service';
import { clientesService } from '@/services/clientes.service';
import { mediosPagoService } from '@/services/mediosPago.service';
import { bluelyticsService } from '@/services/external/bluelytics.service';
import { useSnackbar } from './useSnackbar';
import { validateForm, type FieldErrors } from '@/lib/validation';
import { aceptarPresupuestoSchema, type AceptarPresupuestoFormData } from '@/schemas';
import type { Presupuesto, AceptarPresupuestoForm } from '@/types/presupuesto';
import type { ClienteNombre } from '@/types/cliente';
import type { MedioPago } from '@/types/medioPago';

export function usePresupuestos() {
  const snackbar = useSnackbar();

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [nombreclientes, setNombreClientes] = useState<ClienteNombre[]>([]);
  const [mediodepago, setMedioDePago] = useState<MedioPago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aceptarFormErrors, setAceptarFormErrors] = useState<
    FieldErrors<AceptarPresupuestoFormData>
  >({});
  const [error, setError] = useState('');

  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  const [modalAceptar, setModalAceptar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);

  const [aceptarForm, setAceptarForm] = useState<AceptarPresupuestoForm>({
    medioPago: '',
    usdDelDia: '',
  });

  const cargarDatos = useCallback(() => {
    setIsLoading(true);
    const filters: { estado?: string; cliente_id?: string } = {};
    if (filtroEstado) filters.estado = filtroEstado;
    if (filtroCliente) filters.cliente_id = filtroCliente;

    presupuestosService
      .obtenerTodos(filters)
      .then(setPresupuestos)
      .catch(() => setError('Error al cargar presupuestos'))
      .finally(() => setIsLoading(false));
  }, [filtroEstado, filtroCliente]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    clientesService
      .obtenerNombres()
      .then(setNombreClientes)
      .catch(() => {});
    mediosPagoService
      .obtenerTodos()
      .then(setMedioDePago)
      .catch(() => {});
  }, []);

  useEffect(() => {
    bluelyticsService
      .obtenerUltimo()
      .then((data) => {
        setAceptarForm((prev) => ({ ...prev, usdDelDia: data.blue.value_sell.toString() }));
      })
      .catch(() => {});
  }, []);

  const handleEnviar = async (id: number) => {
    setIsSubmitting(true);
    try {
      await presupuestosService.cambiarEstado(id, 'enviado');
      snackbar.show('Presupuesto enviado');
      cargarDatos();
    } catch {
      snackbar.show('Error al enviar presupuesto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRechazar = async (id: number) => {
    setIsSubmitting(true);
    try {
      await presupuestosService.cambiarEstado(id, 'rechazado');
      snackbar.show('Presupuesto rechazado');
      cargarDatos();
    } catch {
      snackbar.show('Error al rechazar presupuesto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirAceptar = (presupuesto: Presupuesto) => {
    setSelectedPresupuesto(presupuesto);
    setAceptarFormErrors({});
    setModalAceptar(true);
  };

  const handleAceptar = async () => {
    if (!selectedPresupuesto) return;
    const result = validateForm(aceptarPresupuestoSchema, aceptarForm);
    if (!result.success) {
      setAceptarFormErrors(result.errors);
      return;
    }
    setIsSubmitting(true);
    try {
      await presupuestosService.aceptar(selectedPresupuesto.id, {
        medioPago: aceptarForm.medioPago,
        usdDelDia: parseFloat(aceptarForm.usdDelDia),
      });
      snackbar.show('Presupuesto aceptado - Venta y stock actualizados');
      setModalAceptar(false);
      cargarDatos();
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message.includes('400')
          ? 'Stock insuficiente para aceptar este presupuesto'
          : 'Error al aceptar presupuesto';
      snackbar.show(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const abrirEliminar = (presupuesto: Presupuesto) => {
    setSelectedPresupuesto(presupuesto);
    setModalEliminar(true);
  };

  const handleEliminar = async () => {
    if (!selectedPresupuesto) return;
    setIsSubmitting(true);
    try {
      await presupuestosService.eliminar(selectedPresupuesto.id);
      snackbar.show('Presupuesto eliminado');
      setModalEliminar(false);
      cargarDatos();
    } catch {
      snackbar.show('Error al eliminar presupuesto', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    presupuestos,
    nombreclientes,
    mediodepago,
    isLoading,
    isSubmitting,
    error,
    setError,
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
  };
}
