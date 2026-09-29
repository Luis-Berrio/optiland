import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCarritoStore } from '@/store/carritoStore';
import { pedidosApi } from '@/api/pedidos.api';
import { formatCOP } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  direccion: z.string().min(5, 'Dirección requerida'),
  ciudad:    z.string().min(2, 'Ciudad requerida'),
  telefono:  z.string().optional(),
  notas:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { carrito, limpiar, totalPrecio } = useCarritoStore();
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (datos: FormData) => {
    try {
      const pedido = await pedidosApi.crear(datos);
      limpiar();
      toast({ title: '¡Pedido realizado!', description: `Pedido #${pedido.id} confirmado.` });
      navigate('/mis-pedidos');
    } catch (err: any) {
      toast({
        title: 'Error al crear pedido',
        description: err.response?.data?.message ?? 'Inténtalo de nuevo',
        variant: 'destructive',
      });
    }
  };

  const subtotal = totalPrecio();
  const envio    = subtotal > 200000 ? 0 : 15000;

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <MapPin className="h-8 w-8" /> Datos de entrega
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección de entrega</FormLabel>
                  <FormControl><Input placeholder="Calle 123 # 45-67, Barrio" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl><Input placeholder="Bogotá" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono de contacto (opcional)</FormLabel>
                  <FormControl><Input placeholder="+57 300 000 0000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="notas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales (opcional)</FormLabel>
                  <FormControl><Textarea placeholder="Instrucciones para la entrega..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
              <CheckCircle className="h-5 w-5 mr-2" />
              {form.formState.isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
            </Button>
          </form>
        </Form>

        {/* Resumen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" /> Resumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {carrito?.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="flex-1 truncate">{item.producto.nombre} × {item.cantidad}</span>
                <span className="font-medium ml-4">
                  {formatCOP(Number(item.producto.precioOferta ?? item.producto.precio) * item.cantidad)}
                </span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span>{envio === 0 ? 'Gratis' : formatCOP(envio)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCOP(subtotal + envio)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
