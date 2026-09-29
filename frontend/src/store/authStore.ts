import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '@/types';

interface AuthState {
  usuario:    Usuario | null;
  token:      string | null;
  isLoggedIn: boolean;
  setAuth:    (usuario: Usuario, token: string) => void;
  logout:     () => void;
  isAdmin:    () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario:    null,
      token:      null,
      isLoggedIn: false,

      setAuth: (usuario, token) => {
        localStorage.setItem('token', token);
        set({ usuario, token, isLoggedIn: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ usuario: null, token: null, isLoggedIn: false });
      },

      isAdmin: () => get().usuario?.rol === 'ADMIN',
    }),
    {
      name: 'optiland-auth',
      partialize: (state) => ({ usuario: state.usuario, token: state.token, isLoggedIn: state.isLoggedIn }),
    }
  )
);
