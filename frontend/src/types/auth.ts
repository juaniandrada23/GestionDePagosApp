export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  imagen: string;
  empresaId: number;
  empresaNombre: string;
}

export type UserRole = 'Administrador' | 'Usuario';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  imagen: string;
  empresaId: string;
  empresaNombre: string;
}
