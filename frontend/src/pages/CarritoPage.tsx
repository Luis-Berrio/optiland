import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCOP } from '@/lib/utils';
import { useCarritoStore } from '@/store/carritoStore';
import { carritoApi } from '@/api/carrito.api';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';

export default function CarritoPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { carrito, setCarrito, totalPrecio } = useCarritoStore();
  const { isLoggedIn } = useAuthStore();

  const handleActualizar = async (productoId: number, cantidad: number) => {
    try {
      const updated = await carritoApi.actualizar(productoId, cantidad);
      setCarrito(updated);
    } catch { }
  };

  const handleEliminar = async (productoId: number) => {
    try {
      const updated = await carritoApi.eliminarItem(productoId);
      setCarrito(updated);
      toast({ title: 'Producto eliminado del carrito' });
    } catch { }
  };

  const handleVaciar = async () => {
    try {
      const updated = await carritoApi.vaciar();
      setCarrito(updated);
    } catch { }
  };

  if (!isLoggedIn) {
    return (
      <div className="container py-24 text-center space-y-4">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">Inicia sesión para ver tu carrito</h2>
        <Button asChild><Link to="/login">Ingresar</Link></Button>
      </div>
    );
  }

  if (!carrito?.items.length) {
    return (
      <div className="container py-24 text-center space-y-4">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <p className="text-muted-foreground">Agrega productos para comenzar</p>
        <Button asChild><Link to="/productos">Ver productos</Link></Button>
      </div>
    );
  }

  const subtotal = totalPrecio();
  const envio    = subtotal > 200000 ? 0 : 15000;
  const total    = subtotal + envio;

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link to="/productos"><ArrowLeft className="h-4 w-4 mr-2" />Seguir comprando</Link>
        </Button>
        <h1 className="text-3xl font-bold">Mi carrito</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {carrito.items.map((item) => {
            const precio = Number(item.producto.precioOferta ?? item.producto.precio);
            return (
              <div key={item.id} className="flex gap-6 p-6 rounded-xl border bg-card">
                <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {item.producto.imagen ? (
                    <img src={item.producto.imagen} alt={item.producto.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.producto.nombre}</h3>
                  <p className="text-primary font-bold mt-1">{formatCOP(precio)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border rounded-lg">
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => handleActualizar(item.productoId, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.cantidad}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => handleActualizar(item.productoId, item.cantidad + 1)}
                        disabled={item.cantidad >= item.producto.stock}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive"
                      onClick={() => handleEliminar(item.productoId)}>
                      <Trash2 className="h-4 w-4 mr-1" />Eliminar
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCOP(precio * item.cantidad)}</p>
                </div>
              </div>
            );
          })}

          <Button variant="outline" className="text-destructive border-destructive/30" onClick={handleVaciar}>
            Vaciar carrito
          </Button>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-bold text-lg">Resumen del pedido</h2>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>{envio === 0 ? <span className="text-green-600">Gratis</span> : formatCOP(envio)}</span>
              </div>
              {envio === 0 && (
                <p className="text-xs text-green-600">¡Envío gratis en compras mayores a $200.000!</p>
              )}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCOP(total)}</span>
            </div>
            <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
              Proceder al pago <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
