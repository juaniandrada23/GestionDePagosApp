import { apiClient } from './api-client';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export const authService = {
  iniciarSesion(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/login/iniciosesion', credentials);
  },

  crearEmpleado(username: string, password: string) {
    return apiClient.post('/usuarios', { username, password });
  },

  cerrarSesion(): Promise<void> {
    return apiClient.post('/login/logout');
  },
};
