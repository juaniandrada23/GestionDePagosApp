import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { AuthState, LoginResponse, UserRole } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadFromStorage(): AuthState {
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('userId');
  const name = localStorage.getItem('userName');
  const role = localStorage.getItem('userRole') as UserRole | null;
  const imagen = localStorage.getItem('imagen');
  const empresaId = localStorage.getItem('empresaId');
  const empresaNombre = localStorage.getItem('empresaNombre');

  if (token && id && name && role) {
    return {
      token,
      user: {
        id,
        name,
        role,
        imagen: imagen || '',
        empresaId: empresaId || '',
        empresaNombre: empresaNombre || '',
      },
      isAuthenticated: true,
      isAdmin: role === 'Administrador',
    };
  }

  return { token: null, user: null, isAuthenticated: false, isAdmin: false };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(loadFromStorage);

  useEffect(() => {
    const onExpired = () => {
      setState({ token: null, user: null, isAuthenticated: false, isAdmin: false });
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const login = useCallback((data: LoginResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('userName', data.userName);
    localStorage.setItem('userRole', data.userRole);
    localStorage.setItem('imagen', data.imagen || '');
    localStorage.setItem('empresaId', String(data.empresaId || ''));
    localStorage.setItem('empresaNombre', data.empresaNombre || '');

    setState({
      token: data.token,
      user: {
        id: String(data.userId),
        name: data.userName,
        role: data.userRole,
        imagen: data.imagen || '',
        empresaId: String(data.empresaId || ''),
        empresaNombre: data.empresaNombre || '',
      },
      isAuthenticated: true,
      isAdmin: data.userRole === 'Administrador',
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.cerrarSesion();
    } catch {
      /* continue regardless */
    }

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('imagen');
    localStorage.removeItem('empresaId');
    localStorage.removeItem('empresaNombre');

    setState({ token: null, user: null, isAuthenticated: false, isAdmin: false });
  }, []);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export type { AuthContextType };
