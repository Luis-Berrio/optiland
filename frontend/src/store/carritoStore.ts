import { create } from 'zustand';
import type { Carrito } from '@/types';

interface CarritoState {
  carrito:       Carrito | null;
  isOpen:        boolean;
  setCarrito:    (carrito: Carrito) => void;
  toggleCarrito: () => void;
  openCarrito:   () => void;
  closeCarrito:  () => void;
  totalItems:    () => number;
  totalPrecio:   () => number;
  limpiar:       () => void;
}

export const useCarritoStore = create<CarritoState>((set, get) => ({
  carrito:  null,
  isOpen:   false,

  setCarrito:    (carrito) => set({ carrito }),
  toggleCarrito: () => set((s) => ({ isOpen: !s.isOpen })),
  openCarrito:   () => set({ isOpen: true }),
  closeCarrito:  () => set({ isOpen: false }),
  limpiar:       () => set({ carrito: null }),

  totalItems: () => {
    const { carrito } = get();
    return carrito?.items.reduce((acc, item) => acc + item.cantidad, 0) ?? 0;
  },

  totalPrecio: () => {
    const { carrito } = get();
    return carrito?.items.reduce((acc, item) => {
      const precio = item.producto.precioOferta ?? item.producto.precio;
      return acc + Number(precio) * item.cantidad;
    }, 0) ?? 0;
  },
}));
