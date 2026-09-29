import api from './axios';
import type { ApiResponse, AuthResponse, Usuario } from '@/types';

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return data.data;
  },

  registro: async (datos: { nombre: string; apellido: string; email: string; password: string; telefono?: string }) => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/registro', datos);
    return data.data;
  },

  perfil: async () => {
    const { data } = await api.get<ApiResponse<Usuario>>('/auth/perfil');
    return data.data;
  },
};
