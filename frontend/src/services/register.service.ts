import { apiClient } from './api-client';
import type { LoginResponse } from '@/types/auth';
import type { RegisterForm } from '@/types/empresa';

export const registerService = {
  registrar(form: Omit<RegisterForm, 'confirmPassword'>): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/register', form);
  },
};
