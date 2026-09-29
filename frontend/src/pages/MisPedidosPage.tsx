import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCOP, ESTADO_PEDIDO_LABEL, ESTADO_PEDIDO_COLOR } from '@/lib/utils';
import { pedidosApi } from '@/api/pedidos.api';
import { cn } from '@/lib/utils';

export default function MisPedidosPage() {
  const { data: pedidos, isLoading } = useQuery({
    queryKey: ['mis-pedidos'],
    queryFn:  () => pedidosApi.misPedidos(),
  });

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Mis pedidos</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : !pedidos?.length ? (
        <div className="text-center py-24 space-y-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Aún no tienes pedidos</p>
          <Link to="/productos" className="text-primary hover:underline">Ver productos</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold">Pedido #{pedido.id}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', ESTADO_PEDIDO_COLOR[pedido.estado])}>
                        {ESTADO_PEDIDO_LABEL[pedido.estado]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(pedido.createdAt).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pedido.items.length} producto(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">{formatCOP(Number(pedido.total))}</p>
                    <Link to={`/pedidos/${pedido.id}`} className="text-sm text-primary hover:underline flex items-center justify-end gap-1 mt-1">
                      Ver detalle <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
