import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useCarritoStore } from '@/store/carritoStore';
import { useEffect, useRef, useState } from 'react';
import { carritoApi } from '@/api/carrito.api';

export default function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, usuario, logout, isAdmin } = useAuthStore();
  const { totalItems, openCarrito, setCarrito } = useCarritoStore();

  // ─── Auto hide/show según dirección de scroll ───
  const [hidden,    setHidden]    = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const lastYRef = useRef(0);
  const rafRef   = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const y    = window.scrollY;
        const diff = y - lastYRef.current;

        // Threshold pequeño para ignorar micro-scrolls
        if (Math.abs(diff) < 6) return;

        // Ocultar solo después de haber bajado suficiente
        if (diff > 0 && y > 120) {
          setHidden(true);
        } else if (diff < 0) {
          setHidden(false);
        }

        setScrolled(y > 10);
        lastYRef.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      carritoApi.obtener().then(setCarrito).catch(() => {});
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${hidden ? '-translate-y-full' : 'translate-y-0'}
                  ${scrolled
                    ? 'bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
                    : 'bg-background/70 backdrop-blur-md border-b border-transparent'}`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Package className="h-6 w-6" />
          <span>Optiland</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/"          className="hover:text-primary transition-colors">Inicio</Link>
          <Link to="/productos" className="hover:text-primary transition-colors">Productos</Link>
          <Link to="/productos?categoriaId=1" className="hover:text-primary transition-colors">Armazones</Link>
          <Link to="/productos?categoriaId=2" className="hover:text-primary transition-colors">Lentes de Sol</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Carrito */}
          <Button variant="ghost" size="icon" className="relative" onClick={openCarrito}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems() > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {totalItems()}
              </Badge>
            )}
          </Button>

          {/* Usuario */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{usuario?.nombre} {usuario?.apellido}</p>
                  <p className="text-muted-foreground text-xs">{usuario?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/mis-pedidos">
                    <Package className="mr-2 h-4 w-4" /> Mis pedidos
                  </Link>
                </DropdownMenuItem>
                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Ingresar</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/registro">Registrarse</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
