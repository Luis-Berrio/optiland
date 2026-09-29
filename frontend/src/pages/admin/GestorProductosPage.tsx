import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { productosApi } from '@/api/productos.api';
import { formatCOP } from '@/lib/utils';
import type { Producto } from '@/types';
import ProductoFormAdmin from '@/components/productos/ProductoFormAdmin';

export default function GestorProductosPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState<Producto | null>(null);
  const [editando, setEditando] = useState<Producto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-productos', search],
    queryFn:  () => productosApi.listar({ search: search || undefined, limit: 50 }),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id: number) => productosApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-productos'] });
      toast({ title: 'Producto eliminado' });
      setConfirmarEliminar(null);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    },
  });

  const abrirCrear = () => { setEditando(null); setModalAbierto(true); };
  const abrirEditar = (p: Producto) => { setEditando(p); setModalAbierto(true); };

  const ESTADO_BADGE: Record<string, JSX.Element> = {
    ACTIVO:   <Badge className="bg-green-100 text-green-800">Activo</Badge>,
    INACTIVO: <Badge variant="secondary">Inactivo</Badge>,
    AGOTADO:  <Badge variant="destructive">Agotado</Badge>,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground mt-1">{data?.meta.total ?? 0} productos</p>
        </div>
        <Button onClick={abrirCrear}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo producto
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => (
                    <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-muted overflow-hidden flex-shrink-0">
                      {p.imagen && <img src={p.imagen} alt={p.nombre} className="h-full w-full object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{p.nombre}</p>
                      {p.marca && <p className="text-xs text-muted-foreground">{p.marca}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{p.categoria.nombre}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{formatCOP(Number(p.precio))}</p>
                    {p.precioOferta && (
                      <p className="text-xs text-green-600">{formatCOP(Number(p.precioOferta))}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={p.stock <= 5 ? 'text-red-600 font-semibold' : ''}>{p.stock}</span>
                </TableCell>
                <TableCell>{ESTADO_BADGE[p.estado]}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => abrirEditar(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive"
                      onClick={() => setConfirmarEliminar(p)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal crear/editar */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          </DialogHeader>
          <ProductoFormAdmin
            producto={editando}
            onExito={() => {
              setModalAbierto(false);
              queryClient.invalidateQueries({ queryKey: ['admin-productos'] });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal confirmar eliminar */}
      <Dialog open={!!confirmarEliminar} onOpenChange={() => setConfirmarEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente{' '}
              <strong>{confirmarEliminar?.nombre}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmarEliminar(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={eliminarMutation.isPending}
              onClick={() => confirmarEliminar && eliminarMutation.mutate(confirmarEliminar.id)}
            >
              {eliminarMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
