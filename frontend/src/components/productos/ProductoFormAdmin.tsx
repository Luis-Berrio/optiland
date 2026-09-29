import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Upload, Link2, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { productosApi } from '@/api/productos.api';
import { categoriasApi } from '@/api/categorias.api';
import { useToast } from '@/hooks/use-toast';
import type { Producto } from '@/types';

const schema = z.object({
  nombre:       z.string().min(2, 'Mínimo 2 caracteres'),
  descripcion:  z.string().optional(),
  precio:       z.coerce.number().positive('Debe ser mayor a 0'),
  precioOferta: z.coerce.number().positive().optional().or(z.literal('')),
  stock:        z.coerce.number().int().min(0),
  marca:        z.string().optional(),
  modelo:       z.string().optional(),
  material:     z.string().optional(),
  color:        z.string().optional(),
  categoriaId:  z.coerce.number().int().positive('Selecciona una categoría'),
  estado:       z.enum(['ACTIVO', 'INACTIVO', 'AGOTADO']).default('ACTIVO'),
  destacado:    z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

interface Props {
  producto?: Producto | null;
  onExito:   () => void;
}

type ImageMode = 'file' | 'url';

export default function ProductoFormAdmin({ producto, onExito }: Props) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Estado de imagen (independiente del form para manejar file upload) ───
  const [mode,     setMode]     = useState<ImageMode>('file');
  const [file,     setFile]     = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(producto?.imagen ?? null);
  const [imageUrl, setImageUrl] = useState<string>(
    producto?.imagen && !producto.imagen.startsWith('/uploads') ? producto.imagen : ''
  );
  const [removed,  setRemoved]  = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Liberar URL object cuando cambie el archivo
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setRemoved(false);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn:  () => categoriasApi.listar(),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: producto ? {
      nombre:       producto.nombre,
      descripcion:  producto.descripcion ?? '',
      precio:       Number(producto.precio),
      precioOferta: producto.precioOferta ? Number(producto.precioOferta) : undefined,
      stock:        producto.stock,
      marca:        producto.marca ?? '',
      modelo:       producto.modelo ?? '',
      material:     producto.material ?? '',
      color:        producto.color ?? '',
      categoriaId:  producto.categoriaId,
      estado:       producto.estado,
      destacado:    producto.destacado,
    } : { estado: 'ACTIVO', destacado: false },
  });

  // ─── Handlers imagen ───
  const handleFilePick = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      toast({ title: 'Archivo inválido', description: 'Solo imágenes (JPG, PNG, WebP)', variant: 'destructive' });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: 'Archivo muy grande', description: 'Máximo 5 MB', variant: 'destructive' });
      return;
    }
    setFile(f);
    setImageUrl('');
    setRemoved(false);
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url || null);
    setFile(null);
    setRemoved(false);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageUrl('');
    setPreviewUrl(null);
    setRemoved(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFilePick(f);
  };

  // ─── Submit ───
  const onSubmit = async (datos: FormData) => {
    const fd = new FormData();

    // Campos normales
    Object.entries(datos).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) fd.append(k, String(v));
    });

    // Imagen
    if (mode === 'file' && file) {
      fd.append('imagen', file); // multer lo toma como req.file
    } else if (mode === 'url' && imageUrl.trim()) {
      fd.append('imagen', imageUrl.trim()); // string que va a req.body.imagen
    } else if (removed && producto) {
      fd.append('imagen', '__remove__'); // señal para limpiar en el backend
    }

    try {
      if (producto) {
        await productosApi.actualizar(producto.id, fd);
        toast({ title: 'Producto actualizado', description: producto.nombre });
      } else {
        await productosApi.crear(fd);
        toast({ title: 'Producto creado', description: datos.nombre });
      }
      onExito();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message ?? 'Error al guardar',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* ═══════════════ IMAGEN ═══════════════ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Imagen del producto</label>
            <div className="flex gap-1 rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMode('file')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  mode === 'file'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Upload className="h-3 w-3" /> Archivo
              </button>
              <button
                type="button"
                onClick={() => setMode('url')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  mode === 'url'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Link2 className="h-3 w-3" /> URL
              </button>
            </div>
          </div>

          {/* Preview + dropzone / URL input */}
          {previewUrl ? (
            <div className="relative group">
              <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 aspect-video bg-slate-50">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={() => {
                    toast({
                      title: 'Imagen inaccesible',
                      description: 'La URL no devuelve una imagen válida',
                      variant: 'destructive',
                    });
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500/90 hover:bg-red-600
                             text-white flex items-center justify-center shadow-lg
                             opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {mode === 'file' && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs text-primary hover:underline font-medium"
                >
                  Cambiar archivo
                </button>
              )}
              {mode === 'url' && (
                <Input
                  className="mt-2"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              )}
            </div>
          ) : mode === 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8
                          flex flex-col items-center justify-center gap-2 text-center
                          transition-all ${
                            dragOver
                              ? 'border-primary bg-primary/5 scale-[1.01]'
                              : 'border-slate-300 hover:border-primary hover:bg-slate-50'
                          }`}
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Arrastra una imagen o haz click
              </p>
              <p className="text-xs text-slate-500">
                PNG, JPG o WebP · Máx. 5 MB
              </p>
            </div>
          ) : (
            <Input
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* ═══════════════ DATOS ═══════════════ */}
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="nombre"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nombre *</FormLabel>
                <FormControl><Input placeholder="Armazón Titanio..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="precio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio COP *</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="precioOferta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio oferta</FormLabel>
                <FormControl><Input type="number" placeholder="Opcional" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock *</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="categoriaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría *</FormLabel>
                <Select onValueChange={field.onChange} value={String(field.value || '')}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="marca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl><Input placeholder="Ray-Ban..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <FormControl><Input placeholder="Titanio, Acetato..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl><Input placeholder="Negro, Dorado..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="INACTIVO">Inactivo</SelectItem>
                    <SelectItem value="AGOTADO">Agotado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField control={form.control} name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl><Textarea placeholder="Descripción del producto..." rows={3} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={form.control} name="destacado"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 rounded-lg border p-4">
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel className="cursor-pointer">Producto destacado</FormLabel>
                <p className="text-xs text-muted-foreground">Aparece en la sección de destacados del inicio</p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-12 text-base" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? 'Guardando...'
            : producto ? 'Actualizar producto' : 'Crear producto'
          }
        </Button>
      </form>
    </Form>
  );
}
