import { useState, useEffect } from 'react';
import { presupuestosService } from '@/services/presupuestos.service';
import { clientesService } from '@/services/clientes.service';
import { materialesService } from '@/services/materiales.service';
import { useSnackbar } from './useSnackbar';
import { validateForm, type FieldErrors } from '@/lib/validation';
import {
  presupuestoSchema,
  type PresupuestoFormData,
  type PresupuestoItemFormData,
} from '@/schemas';
import type { PresupuestoForm, PresupuestoItemForm, Presupuesto } from '@/types/presupuesto';
import type { ClienteNombre } from '@/types/cliente';
import type { Material } from '@/types/material';

const EMPTY_ITEM: PresupuestoItemForm = { material_id: '', cantidad: '1', precio_unitario: '' };

const INITIAL_FORM: PresupuestoForm = {
  cliente_id: '',
  fecha: new Date().toISOString().slice(0, 10),
  fecha_validez: '',
  observaciones: '',
  descuento_porcentaje: '0',
  items: [{ ...EMPTY_ITEM }],
};

export function usePresupuestoForm(editPresupuesto?: Presupuesto | null) {
  const snackbar = useSnackbar();

  const [form, setForm] = useState<PresupuestoForm>(INITIAL_FORM);
  const [nombreclientes, setNombreClientes] = useState<ClienteNombre[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors<PresupuestoFormData>>({});
  const [itemErrors, setItemErrors] = useState<Array<FieldErrors<PresupuestoItemFormData>>>([]);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    clientesService
      .obtenerNombres()
      .then(setNombreClientes)
      .catch(() => {});
    materialesService
      .obtenerTodos({ activo: true })
      .then(setMateriales)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (editPresupuesto && editPresupuesto.items) {
      setForm({
        cliente_id: String(editPresupuesto.cliente_id),
        fecha: editPresupuesto.fecha.slice(0, 10),
        fecha_validez: editPresupuesto.fecha_validez?.slice(0, 10) || '',
        observaciones: editPresupuesto.observaciones || '',
        descuento_porcentaje: String(editPresupuesto.descuento_porcentaje),
        items: editPresupuesto.items.map((item) => ({
          material_id: String(item.material_id),
          cantidad: String(item.cantidad),
          precio_unitario: String(item.precio_unitario),
        })),
      });
    }
  }, [editPresupuesto]);

  const updateField = (field: keyof Omit<PresupuestoForm, 'items'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateItem = (index: number, field: keyof PresupuestoItemForm, value: string) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };

      if (field === 'material_id' && value) {
        const material = materiales.find((m) => m.id === Number(value));
        if (material) {
          items[index].precio_unitario = String(material.precio_venta);
        }
      }

      return { ...prev, items };
    });
    setItemErrors((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: undefined };
      }
      return updated;
    });
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => {
      if (prev.items.length <= 1) return prev;
      return { ...prev, items: prev.items.filter((_, i) => i !== index) };
    });
    setItemErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const calcularSubtotal = () => {
    return form.items.reduce((sum, item) => {
      const cantidad = parseFloat(item.cantidad) || 0;
      const precio = parseFloat(item.precio_unitario) || 0;
      return sum + cantidad * precio;
    }, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const descuento = parseFloat(form.descuento_porcentaje) || 0;
    return subtotal * (1 - descuento / 100);
  };

  const getItemSubtotal = (index: number) => {
    const item = form.items[index];
    return (parseFloat(item.cantidad) || 0) * (parseFloat(item.precio_unitario) || 0);
  };

  const handleSubmit = async (onSuccess: () => void) => {
    const result = validateForm(presupuestoSchema, form);
    if (!result.success) {
      const topErrors: FieldErrors<PresupuestoFormData> = {};
      const newItemErrors: Array<FieldErrors<PresupuestoItemFormData>> = [];

      const parseResult = presupuestoSchema.safeParse(form);
      if (!parseResult.success) {
        for (const issue of parseResult.error.issues) {
          if (issue.path[0] === 'items' && typeof issue.path[1] === 'number') {
            const idx = issue.path[1];
            const field = issue.path[2] as keyof PresupuestoItemFormData;
            if (!newItemErrors[idx]) newItemErrors[idx] = {};
            if (field && !newItemErrors[idx][field]) {
              newItemErrors[idx][field] = issue.message;
            }
          } else {
            const key = issue.path[0] as keyof PresupuestoFormData;
            if (!topErrors[key]) topErrors[key] = issue.message;
          }
        }
      }

      setFormErrors(topErrors);
      setItemErrors(newItemErrors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setItemErrors([]);
    setApiError('');
    try {
      const data = {
        cliente_id: Number(result.data.cliente_id),
        fecha: result.data.fecha,
        fecha_validez: result.data.fecha_validez || undefined,
        observaciones: result.data.observaciones || undefined,
        descuento_porcentaje: parseFloat(result.data.descuento_porcentaje) || 0,
        items: result.data.items.map((item) => ({
          material_id: Number(item.material_id),
          cantidad: parseFloat(item.cantidad),
          precio_unitario: parseFloat(item.precio_unitario),
        })),
      };

      if (editPresupuesto) {
        await presupuestosService.actualizar(editPresupuesto.id, data);
        snackbar.show('Presupuesto actualizado');
      } else {
        await presupuestosService.crear(data);
        snackbar.show('Presupuesto creado');
      }
      onSuccess();
    } catch {
      setApiError(
        editPresupuesto ? 'Error al actualizar presupuesto' : 'Error al crear presupuesto',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setItemErrors([]);
    setApiError('');
  };

  return {
    form,
    nombreclientes,
    materiales,
    isSubmitting,
    formErrors,
    itemErrors,
    apiError,
    snackbar,
    updateField,
    updateItem,
    addItem,
    removeItem,
    calcularSubtotal,
    calcularTotal,
    getItemSubtotal,
    handleSubmit,
    resetForm,
  };
}
