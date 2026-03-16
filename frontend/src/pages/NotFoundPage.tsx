import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      navigate(`/dashboard/${user.id}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <p className="text-sm font-semibold tracking-widest text-[#006989] uppercase">Error 404</p>

      <h1 className="mt-2 text-7xl sm:text-8xl font-extrabold text-gray-800">404</h1>

      <div className="mt-4 h-1 w-16 rounded-full bg-[#006989]" />

      <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-md">
        La página que buscás no existe o fue movida.
      </p>

      <button
        type="button"
        onClick={handleGoHome}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#006989] rounded-lg hover:bg-[#053F61] transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFoundPage;
