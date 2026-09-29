import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style:    'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

export function calcularDescuento(precio: number, precioOferta: number): number {
  return Math.round(((precio - precioOferta) / precio) * 100);
}

export const ESTADO_PEDIDO_LABEL: Record<string, string> = {
  PENDIENTE:       'Pendiente',
  CONFIRMADO:      'Confirmado',
  EN_PREPARACION:  'En preparación',
  ENVIADO:         'Enviado',
  ENTREGADO:       'Entregado',
  CANCELADO:       'Cancelado',
};

export const ESTADO_PEDIDO_COLOR: Record<string, string> = {
  PENDIENTE:       'bg-yellow-100 text-yellow-800',
  CONFIRMADO:      'bg-blue-100 text-blue-800',
  EN_PREPARACION:  'bg-purple-100 text-purple-800',
  ENVIADO:         'bg-indigo-100 text-indigo-800',
  ENTREGADO:       'bg-green-100 text-green-800',
  CANCELADO:       'bg-red-100 text-red-800',
};
