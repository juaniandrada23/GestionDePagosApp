import { apiClient } from './api-client';
import type { Usuario, UsuarioNombre, UsuarioSesion } from '@/types/usuario';

interface UploadImagenResponse {
  message: string;
  url: string;
}

export const usuariosService = {
  obtenerTodos(): Promise<Usuario[]> {
    return apiClient.get<Usuario[]>('/usuarios/total');
  },

  obtenerNombres(): Promise<UsuarioNombre[]> {
    return apiClient.get<UsuarioNombre[]>('/usuarios/nombres');
  },

  obtenerDatosSesion(idUsuario: string): Promise<UsuarioSesion[]> {
    return apiClient.get<UsuarioSesion[]>(`/usuarios/datosusuariosesion?idUsuario=${idUsuario}`);
  },

  eliminar(userId: number): Promise<void> {
    return apiClient.delete(`/usuarios/${userId}`);
  },

  subirImagen(file: File, idUsuario: string): Promise<UploadImagenResponse> {
    const formData = new FormData();
    formData.append('imagen', file);
    formData.append('idUsuario', idUsuario);
    return apiClient.postFormData<UploadImagenResponse>('/usuarios/imagen', formData);
  },
};
