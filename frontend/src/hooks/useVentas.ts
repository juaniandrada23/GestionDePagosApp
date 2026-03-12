import { useState, useEffect, useCallback } from 'react';
import { pagosService } from '@/services/pagos.service';
import { clientesService } from '@/services/clientes.service';
import { proveedoresService } from '@/services/proveedores.service';
import { mediosPagoService } from '@/services/mediosPago.service';
import { usuariosService } from '@/services/usuarios.service';
import { bluelyticsService } from '@/services/external/bluelytics.service';
import { useAuth } from '@/hooks/useAuth';
import { useSnackbar } from './useSnackbar';
import { validateForm, type FieldErrors } from '@/lib/validation';
import { ventaSchema, type VentaFormData } from '@/schemas';
import { ITEMS_PER_PAGE } from '@/config/constants';
import type { Pago } from '@/types/pago';
import type { ClienteNombre } from '@/types/cliente';
import type { ProveedorNombre } from '@/types/proveedor';
import type { MedioPago } from '@/types/medioPago';
import type { UsuarioNombre } from '@/types/usuario';

const EMPTY_FORM: VentaFormData = {
  cliente: '',
  proveedor: '',
  monto: '',
  medioPago: '',
  fecha: '',
  usdDelDia: '',
  descripcion: '',
};

function parseEntidad(raw: string): { cliente: string; proveedor: string } {
  if (raw.startsWith('proveedor:')) return { cliente: '', proveedor: raw.slice(10) };
  if (raw.startsWith('cliente:')) return { cliente: raw.slice(8), proveedor: '' };
  return { cliente: '', proveedor: '' };
}

export function useVentas() {
  const { user, isAdmin } = useAuth();
  const snackbar = useSnackbar();

  const [pagos, setPagos] = useState<Pago[]>([]);
  const [nombreclientes, setNombreClientes] = useState<ClienteNombre[]>([]);
  const [nombreproveedores, setNombreProveedores] = useState<ProveedorNombre[]>([]);
  const [mediodepago, setMedioDePago] = useState<MedioPago[]>([]);
  const [nombreusuarios, setNombreUsuarios] = useState<UsuarioNombre[]>([]);
  const [usdActualizado, setUsdActualizado] = useState(0);

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [nombreClienteFiltro, setNombreClienteFiltro] = useState('');
  const [nombreUsuarioFiltro, setNombreUsuarioFiltro] = useState('');

  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cargandoForm, setCargandoForm] = useState(false);

  const [formData, setFormData] = useState<VentaFormData>({ ...EMPTY_FORM });
  const [formErrors, setFormErrors] = useState<FieldErrors<VentaFormData>>({});
  const [entidadValue, setEntidadValue] = useState('');

  const [editPago, setEditPago] = useState<Pago | null>(null);
  const [editData, setEditData] = useState<VentaFormData>({ ...EMPTY_FORM });
  const [editFormErrors, setEditFormErrors] = useState<FieldErrors<VentaFormData>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editEntidadValue, setEditEntidadValue] = useState('');

  const resetForm = useCallback(() => {
    setFormData({ ...EMPTY_FORM, usdDelDia: usdActualizado.toString() });
    setFormErrors({});
    setEntidadValue('');
  }, [usdActualizado]);

  const cargarPagos = useCallback(() => {
    const promise = isAdmin
      ? pagosService.obtenerTodos({ tipo: 'venta' })
      : pagosService.obtenerPorUsuario(user!.id);
    promise
      .then((data) => {
        const ventas = isAdmin ? data : data.filter((p) => p.tipo === 'venta' || p.monto >= 0);
        setPagos(ventas);
        setIsLoadingSkeleton(false);
      })
      .catch(() => {});
  }, [isAdmin, user]);

  useEffect(() => {
    if (user) cargarPagos();
  }, [cargarPagos, user]);

  useEffect(() => {
    clientesService
      .obtenerNombres()
      .then(setNombreClientes)
      .catch(() => {});
    proveedoresService
      .obtenerNombres()
      .then(setNombreProveedores)
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
    const { cliente, proveedor } = parseEntidad(value);
    if (isEdit) {
      setEditEntidadValue(value);
      setEditData((prev) => ({ ...prev, cliente, proveedor }));
      setEditFormErrors((prev) => ({ ...prev, cliente: undefined }));
    } else {
      setEntidadValue(value);
      setFormData((prev) => ({ ...prev, cliente, proveedor }));
      setFormErrors((prev) => ({ ...prev, cliente: undefined }));
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
    if (!formData.cliente && !formData.proveedor) {
      setFormErrors({ cliente: 'Debe seleccionar un cliente o proveedor' });
      return;
    }
    const result = validateForm(ventaSchema, formData);
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setCargandoForm(true);
    pagosService
      .crearVenta(user!.id, result.data)
      .then(() => {
        snackbar.show('Venta registrada correctamente');
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
    if (!fechaDesde && !fechaHasta && !nombreClienteFiltro && !nombreUsuarioFiltro) {
      setError('Debe ingresar los datos para filtrar');
      return;
    }

    setIsLoading(true);
    pagosService
      .filtrar({
        fechadesde: fechaDesde,
        fechahasta: fechaHasta,
        usuarioFiltrado: nombreUsuarioFiltro,
        tipo: 'venta',
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
    const clienteVal = isCliente ? pago.nombre : '';
    const provVal = isCliente ? '' : pago.nombre;
    setEditData({
      cliente: clienteVal,
      proveedor: provVal,
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
    if (!editData.cliente && !editData.proveedor) {
      setEditFormErrors({ cliente: 'Debe seleccionar un cliente o proveedor' });
      return;
    }
    const result = validateForm(ventaSchema, editData);
    if (!result.success) {
      setEditFormErrors(result.errors);
      return;
    }

    setEditLoading(true);
    const submitData = {
      nombre: result.data.proveedor || undefined,
      cliente: result.data.cliente || undefined,
      monto: String(Math.abs(parseFloat(result.data.monto))),
      medioPago: result.data.medioPago,
      fecha: result.data.fecha,
      usdDelDia: result.data.usdDelDia,
      descripcion: result.data.descripcion,
    };
    pagosService
      .actualizar(editPago.idPago, submitData)
      .then(() => {
        snackbar.show('Venta actualizada correctamente');
        setEditPago(null);
        setEditLoading(false);
        cargarPagos();
      })
      .catch(() => {
        snackbar.show('Error al actualizar la venta', 'error');
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
    nombreclientes,
    nombreproveedores,
    mediodepago,
    nombreusuarios,
    fechaDesde,
    setFechaDesde,
    fechaHasta,
    setFechaHasta,
    nombreClienteFiltro,
    setNombreClienteFiltro,
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
