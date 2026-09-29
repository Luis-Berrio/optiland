import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout  from '@/components/layout/AdminLayout';

// Páginas públicas
import HomePage           from '@/pages/HomePage';
import ProductosPage      from '@/pages/ProductosPage';
import ProductoDetallePage from '@/pages/ProductoDetallePage';
import CarritoPage        from '@/pages/CarritoPage';
import CheckoutPage       from '@/pages/CheckoutPage';
import LoginPage          from '@/pages/LoginPage';
import RegisterPage       from '@/pages/RegisterPage';
import MisPedidosPage     from '@/pages/MisPedidosPage';

// Páginas admin
import DashboardPage       from '@/pages/admin/DashboardPage';
import GestorProductosPage from '@/pages/admin/GestorProductosPage';
import PedidosAdminPage    from '@/pages/admin/PedidosAdminPage';
import UsuariosAdminPage   from '@/pages/admin/UsuariosAdminPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/"               element={<HomePage />} />
          <Route path="/productos"      element={<ProductosPage />} />
          <Route path="/productos/:id"  element={<ProductoDetallePage />} />
          <Route path="/carrito"        element={<CarritoPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/registro"       element={<RegisterPage />} />

          {/* Rutas protegidas para usuarios */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout"     element={<CheckoutPage />} />
            <Route path="/mis-pedidos"  element={<MisPedidosPage />} />
          </Route>
        </Route>

        {/* Rutas admin */}
        <Route element={<ProtectedRoute soloAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin"                element={<DashboardPage />} />
            <Route path="/admin/productos"      element={<GestorProductosPage />} />
            <Route path="/admin/pedidos"        element={<PedidosAdminPage />} />
            <Route path="/admin/usuarios"       element={<UsuariosAdminPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
