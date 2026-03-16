import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdClose, MdErrorOutline } from 'react-icons/md';
import { Spinner } from '@/components/shared/Modal';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import EstadoServicio from '@/components/feedback/EstadoServicio';
import LoadingModal from '@/components/feedback/LoadingModal';
import ErrorAlert from '@/components/shared/ErrorAlert';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { validateForm, type FieldErrors } from '@/lib/validation';
import { loginSchema, type LoginFormData } from '@/schemas';
import fotoEdificio from '@/assets/images/fotoedificio.jpeg';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors<LoginFormData>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalText, setModalText] = useState('Cargando...');

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/dashboard/${user.id}`);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isLoading) {
      timer = setTimeout(() => setModalText('Iniciando servidor, por favor espere...'), 11000);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateForm(loginSchema, { username, password });
    if (!result.success) {
      setFormErrors(result.errors);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setFormErrors({});
      const data = await authService.iniciarSesion({ username, password });

      if (data.token) {
        login(data);
        navigate(`/dashboard/${data.userId}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('401')) {
        setErrorMessage('Nombre de usuario o contrasena incorrectos');
      } else if (err instanceof Error && err.message.includes('404')) {
        setErrorMessage('Usuario no encontrado');
      } else {
        setErrorMessage('Error de red al iniciar sesion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 relative items-end"
        style={{
          backgroundImage: `url(${fotoEdificio})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-primary-800/90 via-primary-700/60 to-primary-500/30" />

        <div className="relative z-10 px-12 pb-14 max-w-lg">
          <div className="w-11 h-11 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center mb-5 border border-white/20">
            <span className="text-white font-bold text-base">GP</span>
          </div>
          <h1 className="text-white font-bold text-3xl leading-tight">Gestion de Pagos</h1>
          <p className="text-white/60 mt-3 text-sm leading-relaxed">
            Gestiona pagos, cobros, proveedores y usuarios. Simplifica tu contabilidad y realiza
            seguimiento de transacciones de forma eficiente.
          </p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-surface px-5 py-12">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center mb-10 lg:hidden">
            <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-bold text-xl">GP</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Gestion de Pagos</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in-up">
            <div className="px-7 pt-8 pb-1">
              <h2 className="text-xl font-bold text-gray-800">Bienvenido</h2>
              <p className="text-sm text-gray-400 mt-1">Ingresa tus credenciales para continuar</p>
            </div>

            <div className="px-7 pt-5 pb-8">
              <form onSubmit={handleLogin} className="space-y-4">
                {errorMessage && (
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1">
                      <ErrorAlert message={errorMessage} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setErrorMessage('')}
                      className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors flex-shrink-0"
                    >
                      <MdClose className="text-base" />
                    </button>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Usuario
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiUser className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      placeholder="Nombre de usuario"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setFormErrors((prev) => ({ ...prev, username: undefined }));
                      }}
                      autoFocus
                      autoComplete="username"
                      className="w-full pl-11 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                  {formErrors.username && (
                    <span className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <MdErrorOutline className="text-sm" />
                      {formErrors.username}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-600 mb-1.5"
                  >
                    Contrasena
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FiLock className="w-[18px] h-[18px] text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Contrasena"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      autoComplete="current-password"
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
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
                  {formErrors.password && (
                    <span className="flex items-center gap-1 text-red-500 text-xs mt-1">
                      <MdErrorOutline className="text-sm" />
                      {formErrors.password}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-primary-500 text-white font-semibold text-sm rounded-xl hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <Spinner className="h-4.5 w-4.5" />
                    ) : (
                      <>
                        Iniciar sesion <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <Link
                  to="/registro"
                  className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  ¿No tienes cuenta? Registra tu empresa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-50 group">
        <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-lg font-bold cursor-default select-none border border-gray-300">
          ?
        </div>
        <div className="absolute bottom-12 right-0 w-64 px-4 py-3 bg-gray-900 text-white text-xs rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
          <p className="font-semibold text-sm mb-1">Modo desarrollo</p>
          <p className="text-gray-300 leading-relaxed">
            Usuario: <span className="font-mono text-white">admin</span>
            <br />
            Contrasena: <span className="font-mono text-white">admin123</span>
          </p>
        </div>
      </div>

      <EstadoServicio />
      <LoadingModal open={isLoading} text={modalText} />
    </div>
  );
};

export default LoginPage;
