import api from './axios';
import type { ApiResponse, Carrito } from '@/types';

export const carritoApi = {
  obtener: async () => {
    const { data } = await api.get<ApiResponse<Carrito>>('/carrito');
    return data.data;
  },

  agregar: async (productoId: number, cantidad: number) => {
    const { data } = await api.post<ApiResponse<Carrito>>('/carrito/items', { productoId, cantidad });
    return data.data;
  },

  actualizar: async (productoId: number, cantidad: number) => {
    const { data } = await api.put<ApiResponse<Carrito>>(`/carrito/items/${productoId}`, { cantidad });
    return data.data;
  },

  eliminarItem: async (productoId: number) => {
    const { data } = await api.delete<ApiResponse<Carrito>>(`/carrito/items/${productoId}`);
    return data.data;
  },

  vaciar: async () => {
    const { data } = await api.delete<ApiResponse<Carrito>>('/carrito');
    return data.data;
  },
};
