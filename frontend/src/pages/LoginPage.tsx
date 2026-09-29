import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, isAdmin } = useAuthStore();
  const { toast } = useToast();

  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (datos: FormData) => {
    try {
      const { token, usuario } = await authApi.login(datos.email, datos.password);
      setAuth(usuario, token);
      toast({ title: `Bienvenido, ${usuario.nombre}!` });
      navigate(usuario.rol === 'ADMIN' ? '/admin' : '/');
    } catch (err: any) {
      toast({
        title: 'Error al ingresar',
        description: err.response?.data?.message ?? 'Credenciales incorrectas',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Bienvenido a Optiland</CardTitle>
          <CardDescription>Ingresa con tu cuenta para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control} name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control} name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">Regístrate</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
