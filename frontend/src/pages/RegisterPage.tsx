import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { MdErrorOutline } from 'react-icons/md';
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiBriefcase,
} from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRegistro } from '@/hooks/useRegistro';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    step,
    form,
    isLoading,
    formErrors,
    apiError,
    updateField,
    nextStep,
    prevStep,
    handleSubmit,
  } = useRegistro();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/dashboard/${user.id}`);
    }
  }, [isAuthenticated, user, navigate]);

  const stepLabels = ['Datos Personales', 'Datos Empresa', 'Credenciales'];

  const inputClass =
    'w-full pl-11 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#006989]/20 focus:border-[#006989] outline-none transition-all placeholder:text-gray-400';
  const iconClass =
    'w-[18px] h-[18px] text-gray-400 group-focus-within:text-[#006989] transition-colors';

  const fieldError = (field: string) => {
    const err = (formErrors as Record<string, string | undefined>)[field];
    if (!err) return null;
    return (
      <span className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <MdErrorOutline className="text-sm" />
        {err}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAEBED] px-4 py-8">
      <div className="w-full max-w-[520px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#006989] flex items-center justify-center mb-4 shadow-lg shadow-[#006989]/20">
            <span className="text-white font-bold text-xl">GP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Registra tu empresa</h1>
          <p className="text-sm text-gray-400 mt-1">Crea tu cuenta de administrador</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  i + 1 <= step ? 'bg-[#006989] text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${i + 1 <= step ? 'text-[#006989]' : 'text-gray-400'}`}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 && <div className="w-6 h-px bg-gray-300" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-7 pt-6 pb-1">
            <h2 className="text-lg font-bold text-gray-800">{stepLabels[step - 1]}</h2>
          </div>

          <div className="px-7 pt-4 pb-6">
            {apiError && (
              <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                <MdErrorOutline className="text-red-500 text-lg flex-shrink-0" />
                <p className="flex-1 text-sm text-red-700 font-medium">{apiError}</p>
              </div>
            )}

            <div className="space-y-4">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Nombre *
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiUser className={iconClass} />
                        </div>
                        <input
                          type="text"
                          value={form.nombre}
                          onChange={(e) => updateField('nombre', e.target.value)}
                          placeholder="Tu nombre"
                          autoFocus
                          className={inputClass}
                        />
                      </div>
                      {fieldError('nombre')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Apellido *
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiUser className={iconClass} />
                        </div>
                        <input
                          type="text"
                          value={form.apellido}
                          onChange={(e) => updateField('apellido', e.target.value)}
                          placeholder="Tu apellido"
                          className={inputClass}
                        />
                      </div>
                      {fieldError('apellido')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FiMail className={iconClass} />
                      </div>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="tu@email.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Telefono
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiPhone className={iconClass} />
                        </div>
                        <input
                          type="text"
                          value={form.telefono}
                          onChange={(e) => updateField('telefono', e.target.value)}
                          placeholder="+54..."
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">DNI</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiUser className={iconClass} />
                        </div>
                        <input
                          type="text"
                          value={form.dni}
                          onChange={(e) => updateField('dni', e.target.value)}
                          placeholder="12345678"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Fecha de nacimiento
                    </label>
                    <input
                      type="date"
                      value={form.fecha_nacimiento}
                      onChange={(e) => updateField('fecha_nacimiento', e.target.value)}
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#006989]/20 focus:border-[#006989] outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Nombre de la empresa *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FiBriefcase className={iconClass} />
                      </div>
                      <input
                        type="text"
                        value={form.empresa_nombre}
                        onChange={(e) => updateField('empresa_nombre', e.target.value)}
                        placeholder="Mi Empresa S.A."
                        autoFocus
                        className={inputClass}
                      />
                    </div>
                    {fieldError('empresa_nombre')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Direccion
                    </label>
                    <input
                      type="text"
                      value={form.empresa_direccion}
                      onChange={(e) => updateField('empresa_direccion', e.target.value)}
                      placeholder="Av. Siempreviva 742"
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#006989]/20 focus:border-[#006989] outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Telefono empresa
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiPhone className={iconClass} />
                        </div>
                        <input
                          type="text"
                          value={form.empresa_telefono}
                          onChange={(e) => updateField('empresa_telefono', e.target.value)}
                          placeholder="+54..."
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Email empresa
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <FiMail className={iconClass} />
                        </div>
                        <input
                          type="email"
                          value={form.empresa_email}
                          onChange={(e) => updateField('empresa_email', e.target.value)}
                          placeholder="info@empresa.com"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">CUIT</label>
                      <input
                        type="text"
                        value={form.empresa_cuit}
                        onChange={(e) => updateField('empresa_cuit', e.target.value)}
                        placeholder="20-12345678-9"
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#006989]/20 focus:border-[#006989] outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Rubro
                      </label>
                      <input
                        type="text"
                        value={form.empresa_rubro}
                        onChange={(e) => updateField('empresa_rubro', e.target.value)}
                        placeholder="Construccion"
                        className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#006989]/20 focus:border-[#006989] outline-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Usuario *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FiUser className={iconClass} />
                      </div>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        placeholder="Nombre de usuario"
                        autoFocus
                        autoComplete="username"
                        className={inputClass}
                      />
                    </div>
                    {fieldError('username')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Contrasena *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FiLock className={iconClass} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        placeholder="Minimo 6 caracteres"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#006989]/20 focus:border-[#006989] outline-none transition-all placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <FiEyeOff className="w-[18px] h-[18px]" />
                        ) : (
                          <FiEye className="w-[18px] h-[18px]" />
                        )}
                      </button>
                    </div>
                    {fieldError('password')}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Confirmar contrasena *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FiLock className={iconClass} />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        placeholder="Repite tu contrasena"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#006989]/20 focus:border-[#006989] outline-none transition-all placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirm ? (
                          <FiEyeOff className="w-[18px] h-[18px]" />
                        ) : (
                          <FiEye className="w-[18px] h-[18px]" />
                        )}
                      </button>
                    </div>
                    {fieldError('confirmPassword')}
                  </div>
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <FiArrowLeft className="w-4 h-4" /> Anterior
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="text-sm font-medium text-[#006989] hover:text-[#053F61] transition-colors"
                  >
                    Ya tengo cuenta
                  </Link>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#006989] text-white font-semibold text-sm rounded-xl hover:bg-[#053F61] transition-colors"
                  >
                    Siguiente <FiArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006989] text-white font-semibold text-sm rounded-xl hover:bg-[#053F61] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <>
                        Registrar <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
