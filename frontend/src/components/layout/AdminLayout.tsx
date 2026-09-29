import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut, ChevronRight, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/productos', label: 'Productos',   icon: Package },
  { to: '/admin/pedidos',   label: 'Pedidos',     icon: ShoppingBag },
  { to: '/admin/usuarios',  label: 'Usuarios',    icon: Users },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary">
            <Package className="h-5 w-5" />
            <span>Optiland Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === to
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {pathname === to && <ChevronRight className="ml-auto h-4 w-4" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-3">
          <div className="text-sm">
            <p className="font-medium">{usuario?.nombre} {usuario?.apellido}</p>
            <p className="text-muted-foreground text-xs">{usuario?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link to="/"><Eye className="h-4 w-4 mr-1" />Ver tienda</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
