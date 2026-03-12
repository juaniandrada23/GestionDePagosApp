import { useState, useEffect, useCallback } from 'react';
import { materialesService } from '@/services/materiales.service';
import { validateForm, type FieldErrors } from '@/lib/validation';
import {
  materialSchema,
  movimientoSchema,
  type MaterialFormData,
  type MovimientoFormData,
} from '@/schemas';
import type {
  Material,
  MaterialForm,
  MovimientoForm,
  MovimientoStock,
  CategoriaMaterial,
  Unidad,
} from '@/types/material';

const INITIAL_FORM: MaterialForm = {
  nombre: '',
  descripcion: '',
  codigo: '',
  categoria_id: '',
  precio_venta: '',
  precio_costo: '',
  stock_actual: '0',
  stock_minimo: '0',
  unidad_id: '',
};

const INITIAL_MOV: MovimientoForm = { cantidad: '', tipo: 'entrada', motivo: '' };

export function useMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [lowStock, setLowStock] = useState<Material[]>([]);
  const [categorias, setCategorias] = useState<CategoriaMaterial[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors<MaterialFormData>>({});
  const [movFormErrors, setMovFormErrors] = useState<FieldErrors<MovimientoFormData>>({});
  const [apiError, setApiError] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroActivo, setFiltroActivo] = useState(true);

  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalMovimiento, setModalMovimiento] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [form, setForm] = useState<MaterialForm>(INITIAL_FORM);
  const [movForm, setMovForm] = useState<MovimientoForm>(INITIAL_MOV);

  const cargarDatos = useCallback(() => {
    setIsLoading(true);
    const filters: { activo?: boolean; categoria_id?: string; busqueda?: string } = {};
    if (filtroActivo !== undefined) filters.activo = filtroActivo;
    if (filtroCategoria) filters.categoria_id = filtroCategoria;
    if (busqueda) filters.busqueda = busqueda;

    Promise.all([
      materialesService.obtenerTodos(filters),
      materialesService.obtenerStockBajo(),
      materialesService.obtenerCategorias(),
      materialesService.obtenerUnidades(),
    ])
      .then(([mats, low, cats, units]) => {
        setMateriales(mats);
        setLowStock(low);
        setCategorias(cats);
        setUnidades(units);
      })
      .catch(() => setApiError('Error al cargar materiales'))
      .finally(() => setIsLoading(false));
  }, [busqueda, filtroCategoria, filtroActivo]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const updateForm = (field: keyof MaterialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateMovForm = (field: keyof MovimientoForm, value: string) => {
    setMovForm((prev) => ({ ...prev, [field]: value }));
    setMovFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const abrirCrear = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setApiError('');
    setModalCrear(true);
  };

  const abrirEditar = (material: Material) => {
    setForm({
      nombre: material.nombre,
      descripcion: material.descripcion || '',
      codigo: material.codigo || '',
      categoria_id: material.categoria_id ? String(material.categoria_id) : '',
      precio_venta: String(material.precio_venta),
      precio_costo: String(material.precio_costo),
      stock_actual: String(material.stock_actual),
      stock_minimo: String(material.stock_minimo),
      unidad_id: String(material.unidad_id),
    });
    setSelectedMaterial(material);
    setFormErrors({});
    setApiError('');
    setModalEditar(true);
  };

  const abrirDetalle = async (material: Material) => {
    setSelectedMaterial(material);
    setModalDetalle(true);
    try {
      const movs = await materialesService.obtenerMovimientos(material.id);
      setMovimientos(movs);
    } catch {
      setMovimientos([]);
    }
  };

  const abrirMovimiento = (material: Material) => {
    setSelectedMaterial(material);
    setMovForm(INITIAL_MOV);
    setMovFormErrors({});
    setApiError('');
    setModalMovimiento(true);
  };

  const abrirEliminar = (material: Material) => {
    setSelectedMaterial(material);
    setModalEliminar(true);
  };

  const handleCrear = async () => {
    const result = validateForm(materialSchema, form);
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await materialesService.crear({
        nombre: result.data.nombre,
        descripcion: result.data.descripcion || undefined,
        codigo: result.data.codigo || undefined,
        categoria_id: result.data.categoria_id ? Number(result.data.categoria_id) : undefined,
        precio_venta: Number(result.data.precio_venta),
        precio_costo: Number(result.data.precio_costo) || 0,
        stock_actual: Number(result.data.stock_actual) || 0,
        stock_minimo: Number(result.data.stock_minimo) || 0,
        unidad_id: Number(result.data.unidad_id),
      });
      setModalCrear(false);
      cargarDatos();
    } catch {
      setApiError('Error al crear material');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditar = async () => {
    if (!selectedMaterial) return;
    const result = validateForm(materialSchema, form);
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await materialesService.actualizar(selectedMaterial.id, {
        nombre: result.data.nombre,
        descripcion: result.data.descripcion || undefined,
        codigo: result.data.codigo || undefined,
        categoria_id: result.data.categoria_id ? Number(result.data.categoria_id) : undefined,
        precio_venta: Number(result.data.precio_venta),
        precio_costo: Number(result.data.precio_costo) || 0,
        stock_minimo: Number(result.data.stock_minimo) || 0,
        unidad_id: Number(result.data.unidad_id),
      });
      setModalEditar(false);
      cargarDatos();
    } catch {
      setApiError('Error al actualizar material');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEliminar = async () => {
    if (!selectedMaterial) return;
    setIsSubmitting(true);
    try {
      await materialesService.eliminar(selectedMaterial.id);
      setModalEliminar(false);
      cargarDatos();
    } catch {
      setApiError('Error al eliminar material');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMovimiento = async () => {
    if (!selectedMaterial) return;
    const result = validateForm(movimientoSchema, movForm);
    if (!result.success) {
      setMovFormErrors(result.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await materialesService.registrarMovimiento(selectedMaterial.id, {
        cantidad: Number(result.data.cantidad),
        tipo: result.data.tipo,
        motivo: result.data.motivo || undefined,
      });
      setModalMovimiento(false);
      cargarDatos();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('400')) {
        setApiError('Stock insuficiente para realizar la salida');
      } else {
        setApiError('Error al registrar movimiento');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    materiales,
    lowStock,
    categorias,
    unidades,
    selectedMaterial,
    movimientos,
    isLoading,
    isSubmitting,
    formErrors,
    movFormErrors,
    apiError,
    setApiError,
    busqueda,
    setBusqueda,
    filtroCategoria,
    setFiltroCategoria,
    filtroActivo,
    setFiltroActivo,
    modalCrear,
    setModalCrear,
    modalEditar,
    setModalEditar,
    modalMovimiento,
    setModalMovimiento,
    modalDetalle,
    setModalDetalle,
    modalEliminar,
    setModalEliminar,
    form,
    updateForm,
    movForm,
    updateMovForm,
    abrirCrear,
    abrirEditar,
    abrirDetalle,
    abrirMovimiento,
    abrirEliminar,
    handleCrear,
    handleEditar,
    handleEliminar,
    handleMovimiento,
    cargarDatos,
  };
}
