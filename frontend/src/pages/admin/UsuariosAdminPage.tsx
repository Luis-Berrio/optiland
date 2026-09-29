import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios';
import type { ApiResponse, Usuario } from '@/types';

export default function UsuariosAdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn:  async () => {
      const { data } = await api.get<ApiResponse<Usuario[]>>('/usuarios');
      return data.data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => api.patch(`/usuarios/${id}/toggle`),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({ title: 'Estado de usuario actualizado' });
    },
  });

  const rolMutation = useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: string }) => api.patch(`/usuarios/${id}/rol`, { rol }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({ title: 'Rol actualizado' });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground mt-1">{usuarios?.length ?? 0} usuarios registrados</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead>Activo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => (
                    <TableCell key={j}><div className="h-4 bg-muted rounded animate-pulse" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : usuarios?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <p className="font-medium">{u.nombre} {u.apellido}</p>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Select
                    value={u.rol}
                    onValueChange={(rol) => rolMutation.mutate({ id: u.id, rol })}
                    disabled={rolMutation.isPending}
                  >
                    <SelectTrigger className="w-28 h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Usuario</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString('es-CO')}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={u.activo}
                    onCheckedChange={() => toggleMutation.mutate(u.id)}
                    disabled={toggleMutation.isPending}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
