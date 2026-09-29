import api from './axios';
import type { ApiResponse, Categoria } from '@/types';

export const categoriasApi = {
  listar: async () => {
    const { data } = await api.get<ApiResponse<Categoria[]>>('/categorias');
    return data.data;
  },
};
