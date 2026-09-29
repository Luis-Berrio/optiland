import { useQuery } from '@tanstack/react-query';
import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productosApi } from '@/api/productos.api';
import { pedidosApi } from '@/api/pedidos.api';
import { Badge } from '@/components/ui/badge';
import { formatCOP, ESTADO_PEDIDO_LABEL, ESTADO_PEDIDO_COLOR } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { data: statsProductos } = useQuery({
    queryKey: ['stats-productos'],
    queryFn:  () => productosApi.estadisticas(),
  });

  const { data: pedidosRecientes } = useQuery({
    queryKey: ['pedidos-admin', { page: 1, limit: 5 }],
    queryFn:  () => pedidosApi.listar({ page: 1 }),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general de Optiland</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Productos</CardTitle>
            <div className="bg-blue-50 p-2 rounded-lg"><Package className="h-4 w-4 text-blue-600" /></div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statsProductos?.total ?? '—'}</p>
            <p className="text-xs text-muted-foreground mt-1">{statsProductos?.activos} activos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos totales</CardTitle>
            <div className="bg-purple-50 p-2 rounded-lg"><ShoppingBag className="h-4 w-4 text-purple-600" /></div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pedidosRecientes?.meta.total ?? '—'}</p>
            <p className="text-xs text-muted-foreground mt-1">Todos los tiempos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Agotados</CardTitle>
            <div className="bg-red-50 p-2 rounded-lg"><TrendingUp className="h-4 w-4 text-red-600" /></div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{statsProductos?.agotados ?? '—'}</p>
            <p className="text-xs text-muted-foreground mt-1">Requieren restock</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            <div className="bg-amber-50 p-2 rounded-lg"><Users className="h-4 w-4 text-amber-600" /></div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground mt-1">Por procesar</p>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {!pedidosRecientes?.data.length ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No hay pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {pedidosRecientes.data.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">Pedido #{pedido.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {pedido.usuario.nombre} {pedido.usuario.apellido} · {new Date(pedido.createdAt).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', ESTADO_PEDIDO_COLOR[pedido.estado])}>
                      {ESTADO_PEDIDO_LABEL[pedido.estado]}
                    </span>
                    <span className="font-bold text-primary">{formatCOP(Number(pedido.total))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
