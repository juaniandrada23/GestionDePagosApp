import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SESSION_TIMEOUT_MS } from '@/config/constants';

export function useRequireAuth() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      logout();
      navigate('/', { replace: true });
    }, SESSION_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [logout, navigate]);

  return { user, isAdmin };
}
