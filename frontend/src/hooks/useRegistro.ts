import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { registerService } from '@/services/register.service';
import { validateForm, type FieldErrors } from '@/lib/validation';
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  type RegisterFormData,
} from '@/schemas';
import type { RegisterForm } from '@/types/empresa';

const INITIAL_FORM: RegisterForm = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  dni: '',
  fecha_nacimiento: '',
  empresa_nombre: '',
  empresa_direccion: '',
  empresa_telefono: '',
  empresa_email: '',
  empresa_cuit: '',
  empresa_rubro: '',
  username: '',
  password: '',
  confirmPassword: '',
};

export function useRegistro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors<RegisterFormData>>({});
  const [apiError, setApiError] = useState('');

  const updateField = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      const result = validateForm(registerStep1Schema, {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono,
        dni: form.dni,
        fecha_nacimiento: form.fecha_nacimiento,
      });
      if (!result.success) {
        setFormErrors((prev) => ({ ...prev, ...result.errors }));
        return false;
      }
    } else if (step === 2) {
      const result = validateForm(registerStep2Schema, {
        empresa_nombre: form.empresa_nombre,
        empresa_direccion: form.empresa_direccion,
        empresa_telefono: form.empresa_telefono,
        empresa_email: form.empresa_email,
        empresa_cuit: form.empresa_cuit,
        empresa_rubro: form.empresa_rubro,
      });
      if (!result.success) {
        setFormErrors((prev) => ({ ...prev, ...result.errors }));
        return false;
      }
    } else if (step === 3) {
      const result = validateForm(registerStep3Schema, {
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      if (!result.success) {
        setFormErrors((prev) => ({ ...prev, ...result.errors }));
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setFormErrors({});
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setFormErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    setApiError('');
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...payload } = form;
      const data = await registerService.registrar(payload);
      login(data);
      navigate(`/dashboard/${data.userId}`);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('409')) {
        setFormErrors({ username: 'El nombre de usuario ya existe' });
      } else {
        setApiError('Error al registrar. Intente nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    form,
    isLoading,
    formErrors,
    apiError,
    updateField,
    nextStep,
    prevStep,
    handleSubmit,
  };
}
