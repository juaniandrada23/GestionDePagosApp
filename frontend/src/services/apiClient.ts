import { env } from '@/config/env';

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.baseUrl = env.API_URL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('imagen');
    localStorage.removeItem('empresaId');
    localStorage.removeItem('empresaNombre');
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  private async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/login/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) return false;

        const data = await response.json();
        localStorage.setItem('token', data.token);
        if (data.userName) localStorage.setItem('userName', data.userName);
        if (data.userRole) localStorage.setItem('userRole', data.userRole);
        if (data.userId) localStorage.setItem('userId', data.userId);
        if (data.imagen !== undefined) localStorage.setItem('imagen', data.imagen || '');
        if (data.empresaId) localStorage.setItem('empresaId', String(data.empresaId));
        if (data.empresaNombre) localStorage.setItem('empresaNombre', data.empresaNombre);
        return true;
      } catch {
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async handleResponse<T>(
    response: Response,
    retryFn?: () => Promise<Response>,
  ): Promise<T> {
    if (response.status === 401 && retryFn) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        const retryResponse = await retryFn();
        if (!retryResponse.ok) {
          let errorMessage = `Error ${retryResponse.status}: ${retryResponse.statusText}`;
          try {
            const body = await retryResponse.json();
            if (body.error) errorMessage = body.error;
          } catch {
            /* use default message */
          }
          throw new Error(errorMessage);
        }
        return retryResponse.json();
      }
      this.clearAuth();
      throw new Error('Sesión expirada');
    }

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const body = await response.json();
        if (body.error) errorMessage = body.error;
      } catch {
        /* use default message */
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  private buildFetchOptions(method: string, body?: unknown): RequestInit {
    return {
      method,
      headers: this.getHeaders(),
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    };
  }

  async get<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, this.buildFetchOptions('GET'));
    return this.handleResponse<T>(response, () => fetch(url, this.buildFetchOptions('GET')));
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, this.buildFetchOptions('POST', body));
    const isAuthRoute = path.startsWith('/login/') || path.startsWith('/register');
    return this.handleResponse<T>(
      response,
      isAuthRoute ? undefined : () => fetch(url, this.buildFetchOptions('POST', body)),
    );
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, this.buildFetchOptions('PUT', body));
    return this.handleResponse<T>(response, () => fetch(url, this.buildFetchOptions('PUT', body)));
  }

  async delete<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, this.buildFetchOptions('DELETE'));
    return this.handleResponse<T>(response, () => fetch(url, this.buildFetchOptions('DELETE')));
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, this.buildFetchOptions('PATCH', body));
    return this.handleResponse<T>(response, () =>
      fetch(url, this.buildFetchOptions('PATCH', body)),
    );
  }

  async postFormData<T>(path: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const options: RequestInit = {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    };
    const response = await fetch(url, options);
    return this.handleResponse<T>(response, () => {
      const retryToken = localStorage.getItem('token');
      const retryHeaders: HeadersInit = {};
      if (retryToken) {
        retryHeaders['Authorization'] = `Bearer ${retryToken}`;
      }
      return fetch(url, {
        method: 'POST',
        headers: retryHeaders,
        credentials: 'include',
        body: formData,
      });
    });
  }

  async refreshToken(): Promise<boolean> {
    return this.tryRefresh();
  }

  async getRaw(path: string): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, this.buildFetchOptions('GET'));
  }

  async putRaw(path: string): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, this.buildFetchOptions('PUT'));
  }
}

export const apiClient = new ApiClient();
