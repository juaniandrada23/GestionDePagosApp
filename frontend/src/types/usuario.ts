export interface Usuario {
  id: number;
  username: string;
  role_name: string;
  email?: string;
  descripcion?: string;
  imagen?: string;
}

export interface UsuarioNombre {
  username: string;
}

export interface UsuarioSesion {
  imagen: string;
}

export interface NuevoUsuario {
  nombre: string;
  contraseña: string;
}
