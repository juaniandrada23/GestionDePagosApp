import { useState, useEffect, useCallback } from 'react';
import { clientesService } from '@/services/clientes.service';
import { validateForm, type FieldErrors } from '@/lib/validation';
import { clienteSchema, type ClienteFormData } from '@/schemas';
import type { Cliente } from '@/types/cliente';
import type { ClienteForm } from '@/types/cliente';

const INITIAL_FORM: ClienteForm = {
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
  cuit_dni: '',
};

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors<ClienteFormData>>({});
  const [apiError, setApiError] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState(true);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [form, setForm] = useState<ClienteForm>(INITIAL_FORM);

  const cargarDatos = useCallback(() => {
    setIsLoading(true);
    const filters: { activo?: boolean; busqueda?: string } = {};
    if (filtroActivo !== undefined) filters.activo = filtroActivo;
    if (busqueda) filters.busqueda = busqueda;

    clientesService
      .obtenerTodos(filters)
      .then(setClientes)
      .catch(() => setApiError('Error al cargar clientes'))
      .finally(() => setIsLoading(false));
  }, [busqueda, filtroActivo]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const updateForm = (field: keyof ClienteForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const abrirCrear = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setApiError('');
    setModalCrear(true);
  };

  const abrirEditar = (cliente: Cliente) => {
    setForm({
      nombre: cliente.nombre,
      direccion: cliente.direccion || '',
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      cuit_dni: cliente.cuit_dni || '',
    });
    setSelectedCliente(cliente);
    setFormErrors({});
    setApiError('');
    setModalEditar(true);
  };

  const abrirDetalle = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalDetalle(true);
  };

  const abrirEliminar = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalEliminar(true);
  };

  const handleCrear = async () => {
    const result = validateForm(clienteSchema, form);
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await clientesService.crear({
        nombre: result.data.nombre,
        direccion: result.data.direccion || undefined,
        telefono: result.data.telefono || undefined,
        email: result.data.email || undefined,
        cuit_dni: result.data.cuit_dni || undefined,
      });
      setModalCrear(false);
      cargarDatos();
    } catch {
      setApiError('Error al crear cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditar = async () => {
    if (!selectedCliente) return;
    const result = validateForm(clienteSchema, form);
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await clientesService.actualizar(selectedCliente.id, {
        nombre: result.data.nombre,
        direccion: result.data.direccion || undefined,
        telefono: result.data.telefono || undefined,
        email: result.data.email || undefined,
        cuit_dni: result.data.cuit_dni || undefined,
      });
      setModalEditar(false);
      cargarDatos();
    } catch {
      setApiError('Error al actualizar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async () => {
    if (!selectedCliente) return;
    setIsSubmitting(true);
    try {
      await clientesService.eliminar(selectedCliente.id);
      setModalEliminar(false);
      cargarDatos();
    } catch {
      setApiError('Error al eliminar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    clientes,
    selectedCliente,
    isLoading,
    isSubmitting,
    formErrors,
    apiError,
    setApiError,
    busqueda,
    setBusqueda,
    filtroActivo,
    setFiltroActivo,
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
    cargarDatos,
  };
}
