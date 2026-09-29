import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, ArrowLeft, Star, Package, Minus, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCOP, calcularDescuento } from '@/lib/utils';
import { productosApi } from '@/api/productos.api';
import { carritoApi } from '@/api/carrito.api';
import { useCarritoStore } from '@/store/carritoStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCarrito, openCarrito } = useCarritoStore();
  const { isLoggedIn } = useAuthStore();
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);

  const { data: producto, isLoading } = useQuery({
    queryKey: ['producto', id],
    queryFn:  () => productosApi.obtenerPorId(Number(id)),
    enabled:  !!id,
  });

  const handleAgregar = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setAgregando(true);
    try {
      const carrito = await carritoApi.agregar(producto!.id, cantidad);
      setCarrito(carrito);
      openCarrito();
      toast({ title: 'Agregado al carrito', description: `${cantidad} × ${producto!.nombre}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message ?? 'No se pudo agregar', variant: 'destructive' });
    } finally {
      setAgregando(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  const descuento = producto.precioOferta
    ? calcularDescuento(Number(producto.precio), Number(producto.precioOferta))
    : null;

  return (
    <div className="container py-10">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/productos"><ArrowLeft className="h-4 w-4 mr-2" />Volver</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="aspect-square rounded-2xl bg-muted overflow-hidden relative">
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Package className="h-32 w-32 text-muted-foreground opacity-20" />
            </div>
          )}
          {descuento && (
            <Badge variant="destructive" className="absolute top-4 left-4 text-base px-3 py-1">
              -{descuento}%
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">{producto.categoria.nombre}</Badge>
            <h1 className="text-3xl font-bold">{producto.nombre}</h1>
            {producto.marca && <p className="text-muted-foreground mt-1">{producto.marca}</p>}
          </div>

          {/* Precio */}
          <div className="flex items-end gap-3">
            {producto.precioOferta ? (
              <>
                <span className="text-4xl font-bold text-primary">{formatCOP(Number(producto.precioOferta))}</span>
                <span className="text-xl text-muted-foreground line-through">{formatCOP(Number(producto.precio))}</span>
                <Badge className="bg-green-100 text-green-800">Ahorras {formatCOP(Number(producto.precio) - Number(producto.precioOferta))}</Badge>
              </>
            ) : (
              <span className="text-4xl font-bold text-primary">{formatCOP(Number(producto.precio))}</span>
            )}
          </div>

          {/* Estado stock */}
          <div className="flex items-center gap-2">
            {producto.estado === 'AGOTADO' || producto.stock === 0 ? (
              <Badge variant="destructive">Agotado</Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <Check className="h-3 w-3 mr-1" /> En stock ({producto.stock} disponibles)
              </Badge>
            )}
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <p className="text-muted-foreground leading-relaxed">{producto.descripcion}</p>
          )}

          <Separator />

          {/* Specs */}
          {(producto.material || producto.color || producto.modelo) && (
            <div className="grid grid-cols-2 gap-4">
              {producto.material && (
                <div>
                  <p className="text-xs text-muted-foreground">Material</p>
                  <p className="font-medium">{producto.material}</p>
                </div>
              )}
              {producto.color && (
                <div>
                  <p className="text-xs text-muted-foreground">Color</p>
                  <p className="font-medium">{producto.color}</p>
                </div>
              )}
              {producto.modelo && (
                <div>
                  <p className="text-xs text-muted-foreground">Modelo</p>
                  <p className="font-medium">{producto.modelo}</p>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Cantidad + Agregar */}
          {producto.estado === 'ACTIVO' && producto.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Cantidad:</span>
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="icon" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{cantidad}</span>
                  <Button variant="ghost" size="icon" onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button size="lg" className="w-full" onClick={handleAgregar} disabled={agregando}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                {agregando ? 'Agregando...' : 'Agregar al carrito'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
