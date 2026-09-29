import api from './axios';
import type { ApiResponse, PaginatedResponse, Pedido } from '@/types';

export const pedidosApi = {
  listar: async (params?: { page?: number; estado?: string }) => {
    const { data } = await api.get<PaginatedResponse<Pedido>>('/pedidos', { params });
    return data;
  },

  misPedidos: async () => {
    const { data } = await api.get<ApiResponse<Pedido[]>>('/pedidos/mis-pedidos');
    return data.data;
  },

  obtenerPorId: async (id: number) => {
    const { data } = await api.get<ApiResponse<Pedido>>(`/pedidos/${id}`);
    return data.data;
  },

  crear: async (datos: { direccion: string; ciudad: string; telefono?: string; notas?: string }) => {
    const { data } = await api.post<ApiResponse<Pedido>>('/pedidos', datos);
    return data.data;
  },

  actualizarEstado: async (id: number, estado: string) => {
    const { data } = await api.patch<ApiResponse<Pedido>>(`/pedidos/${id}/estado`, { estado });
    return data.data;
  },
};
