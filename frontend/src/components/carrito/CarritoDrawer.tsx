import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCarritoStore } from '@/store/carritoStore';
import { carritoApi } from '@/api/carrito.api';
import { formatCOP } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

export default function CarritoDrawer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isOpen, closeCarrito, carrito, setCarrito, totalItems, totalPrecio } = useCarritoStore();
  const { isLoggedIn } = useAuthStore();

  if (!isOpen) return null;

  const handleActualizar = async (productoId: number, cantidad: number) => {
    if (!isLoggedIn) return;
    try {
      const updated = await carritoApi.actualizar(productoId, cantidad);
      setCarrito(updated);
    } catch { }
  };

  const handleEliminar = async (productoId: number) => {
    if (!isLoggedIn) return;
    try {
      const updated = await carritoApi.eliminarItem(productoId);
      setCarrito(updated);
    } catch { }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      closeCarrito();
      navigate('/login');
      return;
    }
    closeCarrito();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={closeCarrito}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="font-semibold text-lg">Carrito ({totalItems()})</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCarrito}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isLoggedIn ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Inicia sesión para ver tu carrito</p>
              <Button onClick={() => { closeCarrito(); navigate('/login'); }}>Ingresar</Button>
            </div>
          ) : !carrito?.items.length ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Button variant="outline" onClick={() => { closeCarrito(); navigate('/productos'); }}>
                Ver productos
              </Button>
            </div>
          ) : (
            carrito.items.map((item) => {
              const precio = Number(item.producto.precioOferta ?? item.producto.precio);
              return (
                <div key={item.id} className="flex gap-4 p-3 rounded-lg border bg-card">
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.producto.imagen ? (
                      <img src={item.producto.imagen} alt={item.producto.nombre} className="h-full w-full object-cover" />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.producto.nombre}</p>
                    <p className="text-sm font-bold text-primary">{formatCOP(precio)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline" size="icon" className="h-6 w-6"
                        onClick={() => handleActualizar(item.productoId, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center">{item.cantidad}</span>
                      <Button
                        variant="outline" size="icon" className="h-6 w-6"
                        onClick={() => handleActualizar(item.productoId, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="h-6 w-6 text-destructive ml-auto"
                        onClick={() => handleEliminar(item.productoId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {isLoggedIn && (carrito?.items.length ?? 0) > 0 && (
          <div className="p-6 border-t space-y-4">
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCOP(totalPrecio())}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceder al pago
            </Button>
            <Button variant="outline" className="w-full" onClick={() => { closeCarrito(); navigate('/carrito'); }}>
              Ver carrito completo
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
