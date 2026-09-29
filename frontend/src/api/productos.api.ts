import api from './axios';
import type { ApiResponse, PaginatedResponse, Producto, ProductoFormData } from '@/types';

export interface FiltrosProducto {
  page?:        number;
  limit?:       number;
  categoriaId?: number;
  search?:      string;
  estado?:      string;
  destacado?:   boolean;
}

export const productosApi = {
  listar: async (filtros: FiltrosProducto = {}) => {
    const { data } = await api.get<PaginatedResponse<Producto>>('/productos', { params: filtros });
    return data;
  },

  obtenerPorId: async (id: number) => {
    const { data } = await api.get<ApiResponse<Producto>>(`/productos/${id}`);
    return data.data;
  },

  crear: async (formData: FormData) => {
    const { data } = await api.post<ApiResponse<Producto>>('/productos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  actualizar: async (id: number, formData: FormData) => {
    const { data } = await api.put<ApiResponse<Producto>>(`/productos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  eliminar: async (id: number) => {
    await api.delete(`/productos/${id}`);
  },

  estadisticas: async () => {
    const { data } = await api.get<ApiResponse<{ total: number; activos: number; agotados: number }>>('/productos/stats');
    return data.data;
  },
};
