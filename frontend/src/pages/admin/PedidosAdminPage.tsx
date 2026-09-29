import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCOP, ESTADO_PEDIDO_LABEL, ESTADO_PEDIDO_COLOR } from '@/lib/utils';
import { pedidosApi } from '@/api/pedidos.api';
import { useToast } from '@/hooks/use-toast';
import type { Pedido } from '@/types';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const ESTADOS = ['PENDIENTE','CONFIRMADO','EN_PREPARACION','ENVIADO','ENTREGADO','CANCELADO'];

export default function PedidosAdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filtroEstado, setFiltroEstado] = useState('');
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pedidos', filtroEstado],
    queryFn:  () => pedidosApi.listar({ estado: filtroEstado || undefined }),
  });

  const estadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) => pedidosApi.actualizarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pedidos'] });
      toast({ title: 'Estado actualizado' });
    },
    onError: () => toast({ title: 'Error', variant: 'destructive' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground mt-1">{data?.meta.total ?? 0} pedidos</p>
        </div>
        <Select value={filtroEstado || 'todos'} onValueChange={(v) => setFiltroEstado(v === 'todos' ? '' : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            {ESTADOS.map((e) => (
              <SelectItem key={e} value={e}>{ESTADO_PEDIDO_LABEL[e]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cambiar estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">#{p.id}</TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{p.usuario.nombre} {p.usuario.apellido}</p>
                  <p className="text-xs text-muted-foreground">{p.usuario.email}</p>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(p.createdAt).toLocaleDateString('es-CO')}
                </TableCell>
                <TableCell className="font-bold text-primary">{formatCOP(Number(p.total))}</TableCell>
                <TableCell>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', ESTADO_PEDIDO_COLOR[p.estado])}>
                    {ESTADO_PEDIDO_LABEL[p.estado]}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    value={p.estado}
                    onValueChange={(estado) => estadoMutation.mutate({ id: p.id, estado })}
                    disabled={estadoMutation.isPending}
                  >
                    <SelectTrigger className="w-44 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((e) => (
                        <SelectItem key={e} value={e} className="text-xs">{ESTADO_PEDIDO_LABEL[e]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setPedidoDetalle(p)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detalle pedido */}
      <Dialog open={!!pedidoDetalle} onOpenChange={() => setPedidoDetalle(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido #{pedidoDetalle?.id}</DialogTitle>
          </DialogHeader>
          {pedidoDetalle && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-medium">{pedidoDetalle.usuario.nombre} {pedidoDetalle.usuario.apellido}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dirección</p>
                  <p className="font-medium">{pedidoDetalle.direccion}, {pedidoDetalle.ciudad}</p>
                </div>
              </div>
              <div className="border rounded-lg divide-y">
                {pedidoDetalle.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 text-sm">
                    <span>{item.producto.nombre} × {item.cantidad}</span>
                    <span className="font-medium">{formatCOP(Number(item.subtotal))}</span>
                  </div>
                ))}
                <div className="flex justify-between p-3 font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCOP(Number(pedidoDetalle.total))}</span>
                </div>
              </div>
              {pedidoDetalle.notas && (
                <div>
                  <p className="text-xs text-muted-foreground">Notas</p>
                  <p className="text-sm">{pedidoDetalle.notas}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
