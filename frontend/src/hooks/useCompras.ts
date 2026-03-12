import { useState, useEffect, useCallback } from 'react';
import { pagosService } from '@/services/pagos.service';
import { proveedoresService } from '@/services/proveedores.service';
import { clientesService } from '@/services/clientes.service';
import { mediosPagoService } from '@/services/mediosPago.service';
import { usuariosService } from '@/services/usuarios.service';
import { bluelyticsService } from '@/services/external/bluelytics.service';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from './useSnackbar';
import { validateForm, type FieldErrors } from '@/lib/validation';
import { compraSchema, type CompraFormData } from '@/schemas';
import { ITEMS_PER_PAGE } from '@/config/constants';
import type { Pago } from '@/types/pago';
import type { ProveedorNombre } from '@/types/proveedor';
import type { ClienteNombre } from '@/types/cliente';
import type { MedioPago } from '@/types/medioPago';
import type { UsuarioNombre } from '@/types/usuario';

const EMPTY_FORM: CompraFormData = {
  nombre: '',
  cliente: '',
  monto: '',
  medioPago: '',
  fecha: '',
  usdDelDia: '',
  descripcion: '',
};

function parseEntidad(raw: string): { nombre: string; cliente: string } {
  if (raw.startsWith('cliente:')) return { nombre: '', cliente: raw.slice(8) };
  if (raw.startsWith('proveedor:')) return { nombre: raw.slice(10), cliente: '' };
  return { nombre: '', cliente: '' };
}

export function useCompras() {
  const { user, isAdmin } = useAuth();
  const snackbar = useSnackbar();

  const [pagos, setPagos] = useState<Pago[]>([]);
  const [nombreproveedores, setNombreProveedores] = useState<ProveedorNombre[]>([]);
  const [nombreclientes, setNombreClientes] = useState<ClienteNombre[]>([]);
  const [mediodepago, setMedioDePago] = useState<MedioPago[]>([]);
  const [nombreusuarios, setNombreUsuarios] = useState<UsuarioNombre[]>([]);
  const [usdActualizado, setUsdActualizado] = useState(0);

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [nombreProveedorFiltro, setNombreProveedorFiltro] = useState('');
  const [nombreUsuarioFiltro, setNombreUsuarioFiltro] = useState('');

  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);

  const [formData, setFormData] = useState<CompraFormData>({ ...EMPTY_FORM });
  const [formErrors, setFormErrors] = useState<FieldErrors<CompraFormData>>({});
  const [entidadValue, setEntidadValue] = useState('');

  const [editPago, setEditPago] = useState<Pago | null>(null);
  const [editData, setEditData] = useState<CompraFormData>({ ...EMPTY_FORM });
  const [editFormErrors, setEditFormErrors] = useState<FieldErrors<CompraFormData>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editEntidadValue, setEditEntidadValue] = useState('');

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM, usdDelDia: usdActualizado.toString() });
    setFormErrors({});
    setEntidadValue('');
  }, [usdActualizado]);

  const cargarPagos = useCallback(() => {
    const promise = isAdmin
      ? pagosService.obtenerTodos({ tipo: 'compra' })
      : pagosService.obtenerPorUsuario(user!.id);
    promise
      .then((data) => {
        const compras = isAdmin ? data : data.filter((p) => p.tipo === 'compra' || p.monto < 0);
        setPagos(compras);
        setIsLoadingSkeleton(false);
      })
      .catch(() => {});
  }, [isAdmin, user]);

  useEffect(() => {
    if (user) cargarPagos();
  }, [cargarPagos, user]);

  useEffect(() => {
    proveedoresService
      .obtenerNombres()
      .then(setNombreProveedores)
      .catch(() => {});
    clientesService
      .obtenerNombres()
      .then(setNombreClientes)
      .catch(() => {});
    mediosPagoService
      .obtenerTodos()
      .then(setMedioDePago)
      .catch(() => {});
    if (isAdmin)
      usuariosService
        .obtenerNombres()
        .then(setNombreUsuarios)
        .catch(() => {});
  }, [isAdmin]);

  useEffect(() => {
    bluelyticsService
      .obtenerUltimo()
      .then((data) => {
        setUsdActualizado(data.blue.value_sell);
        setFormData((prev) => ({ ...prev, usdDelDia: data.blue.value_sell.toString() }));
      })
      .catch(() => {});
  }, []);

  const handleEntidadChange = (value: string, isEdit = false) => {
    const { nombre, cliente } = parseEntidad(value);
    if (isEdit) {
      setEditEntidadValue(value);
      setEditData((prev) => ({ ...prev, nombre, cliente }));
      setEditFormErrors((prev) => ({ ...prev, nombre: undefined }));
    } else {
      setEntidadValue(value);
      setFormData((prev) => ({ ...prev, nombre, cliente }));
      setFormErrors((prev) => ({ ...prev, nombre: undefined }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === '_entidad') {
      handleEntidadChange(value);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre && !formData.cliente) {
      setFormErrors({ nombre: 'Debe seleccionar un proveedor o cliente' });
      return;
    }
    const result = validateForm(compraSchema, formData);
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setCargandoForm(true);
    pagosService
      .crearCompra(user!.id, result.data)
      .then(() => {
        snackbar.show('Compra registrada correctamente');
        setCargandoForm(false);
        resetForm();
        cargarPagos();
      })
      .catch(() => {
        snackbar.show('Error con la conexion del servidor, intente nuevamente', 'error');
        setCargandoForm(false);
      });
  };

  const aplicarFiltros = () => {
    if (fechaDesde > fechaHasta) {
      setError('La fecha desde es mayor que la fecha hasta');
      return;
    }
    if (!fechaDesde && !fechaHasta && !nombreProveedorFiltro && !nombreUsuarioFiltro) {
      setError('Debe ingresar los datos para filtrar');
      return;
    }

    setIsLoading(true);
    pagosService
      .filtrar({
        fechadesde: fechaDesde,
        fechahasta: fechaHasta,
        nombreProveedor: nombreProveedorFiltro,
        usuarioFiltrado: nombreUsuarioFiltro,
        tipo: 'compra',
      })
      .then((data) => {
        setPagos(data);
        setError('');
        setIsLoading(false);
        setCurrentPage(1);
      })
      .catch(() => {
        setError('Error de conexion con el servidor');
        setIsLoading(false);
      });
  };

  const abrirEditDialog = (pago: Pago) => {
    setEditPago(pago);
    const isCliente = !!pago.cliente_nombre;
    const nombreVal = isCliente ? '' : pago.nombre;
    const clienteVal = isCliente ? pago.nombre : '';
    setEditData({
      nombre: nombreVal,
      cliente: clienteVal,
      monto: String(Math.abs(pago.monto)),
      medioPago: pago.nombreMedioPago,
      fecha: pago.fecha.slice(0, 10),
      usdDelDia: String(pago.usdDelDia),
      descripcion: pago.descripcion || '',
    });
    setEditEntidadValue(isCliente ? `cliente:${pago.nombre}` : `proveedor:${pago.nombre}`);
    setEditFormErrors({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === '_entidad') {
      handleEntidadChange(value, true);
      return;
    }
    setEditData((prev) => ({ ...prev, [name]: value }));
    setEditFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleEditSubmit = () => {
    if (!editPago) return;
    if (!editData.nombre && !editData.cliente) {
      setEditFormErrors({ nombre: 'Debe seleccionar un proveedor o cliente' });
      return;
    }
    const result = validateForm(compraSchema, editData);
    if (!result.success) {
      setEditFormErrors(result.errors);
      return;
    }

    setEditLoading(true);
    const submitData = {
      nombre: result.data.nombre || undefined,
      cliente: result.data.cliente || undefined,
      monto: `-${Math.abs(parseFloat(result.data.monto))}`,
      medioPago: result.data.medioPago,
      fecha: result.data.fecha,
      usdDelDia: result.data.usdDelDia,
      descripcion: result.data.descripcion,
    };
    pagosService
      .actualizar(editPago.idPago, submitData)
      .then(() => {
        snackbar.show('Compra actualizada correctamente');
        setEditPago(null);
        setEditLoading(false);
        cargarPagos();
      })
      .catch(() => {
        snackbar.show('Error al actualizar la compra', 'error');
        setEditLoading(false);
      });
  };

  const cerrarEditDialog = () => setEditPago(null);
  const actualizarPagos = () => cargarPagos();

  const totalPages = Math.ceil(pagos.length / ITEMS_PER_PAGE);
  const paginatedPagos = pagos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return {
    pagos,
    paginatedPagos,
    totalPages,
    currentPage,
    setCurrentPage,
    nombreproveedores,
    nombreclientes,
    mediodepago,
    nombreusuarios,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    nombreProveedorFiltro,
    setNombreProveedorFiltro,
    nombreUsuarioFiltro,
    setNombreUsuarioFiltro,
    error,
    isLoadingSkeleton,
    isLoading,
    cargandoForm,
    formData,
    formErrors,
    snackbar,
    entidadValue,
    editEntidadValue,
    handleInputChange,
    handleFormSubmit,
    aplicarFiltros,
    actualizarPagos,
    editPago,
    editData,
    editFormErrors,
    editLoading,
    abrirEditDialog,
    handleEditChange,
    handleEditSubmit,
    cerrarEditDialog,
  };
}
