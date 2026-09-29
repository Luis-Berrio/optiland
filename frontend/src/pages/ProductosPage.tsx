import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductoCard from '@/components/productos/ProductoCard';
import { productosApi } from '@/api/productos.api';
import { categoriasApi } from '@/api/categorias.api';

export default function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const categoriaId = searchParams.get('categoriaId') ? Number(searchParams.get('categoriaId')) : undefined;
  const page        = Number(searchParams.get('page') || 1);

  const { data, isLoading } = useQuery({
    queryKey: ['productos', { categoriaId, search, page }],
    queryFn:  () => productosApi.listar({ categoriaId, search: search || undefined, page, limit: 12 }),
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn:  () => categoriasApi.listar(),
  });

  const setCategoria = (id?: number) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set('categoriaId', String(id));
    else params.delete('categoriaId');
    params.set('page', '1');
    setSearchParams(params);
  };

  const categoriaActual = categorias?.find((c) => c.id === categoriaId);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {categoriaActual ? categoriaActual.nombre : 'Todos los productos'}
        </h1>
        {data && <p className="text-muted-foreground mt-1">{data.meta.total} productos encontrados</p>}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearch('')}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Select
          value={categoriaId ? String(categoriaId) : 'todas'}
          onValueChange={(v) => setCategoria(v === 'todas' ? undefined : Number(v))}
        >
          <SelectTrigger className="w-48">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las categorías</SelectItem>
            {categorias?.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chips categorías */}
      {categorias && (
        <div className="flex gap-2 flex-wrap mb-8">
          <Badge
            variant={!categoriaId ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setCategoria(undefined)}
          >
            Todos
          </Badge>
          {categorias.map((c) => (
            <Badge
              key={c.id}
              variant={categoriaId === c.id ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCategoria(c.id)}
            >
              {c.nombre}
            </Badge>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.data.map((p) => <ProductoCard key={p.id} producto={p} />)}
        </div>
      )}

      {/* Paginación */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page - 1) })}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Página {page} de {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= data.meta.totalPages}
            onClick={() => setSearchParams({ ...Object.fromEntries(searchParams), page: String(page + 1) })}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
