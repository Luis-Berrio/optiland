import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  soloAdmin?: boolean;
}

export default function ProtectedRoute({ soloAdmin = false }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuthStore();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (soloAdmin && !isAdmin()) return <Navigate to="/" replace />;

  return <Outlet />;
}
