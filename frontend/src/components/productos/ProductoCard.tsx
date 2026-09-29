import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { ShoppingCart, Eye, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCOP, calcularDescuento } from '@/lib/utils';
import { carritoApi } from '@/api/carrito.api';
import { useCarritoStore } from '@/store/carritoStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import type { Producto } from '@/types';

interface ProductoCardProps {
  producto: Producto;
}

export default function ProductoCard({ producto }: ProductoCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCarrito, openCarrito } = useCarritoStore();
  const { isLoggedIn } = useAuthStore();

  const cardRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // ─── 3D tilt following the cursor (anime.js powered) ───
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rotY = ((x - cx) / cx) * 10;   // max 10deg
    const rotX = -((y - cy) / cy) * 10;

    anime({
      targets: cardRef.current,
      rotateX: rotX,
      rotateY: rotY,
      duration: 300,
      easing:  'easeOutQuad',
    });
    anime({
      targets: imgRef.current,
      translateX: (x - cx) * 0.08,
      translateY: (y - cy) * 0.08,
      scale:   1.12,
      duration: 300,
      easing:  'easeOutQuad',
    });
    if (glareRef.current) {
      glareRef.current.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      glareRef.current.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    }
  };

  const handleMouseLeave = () => {
    anime({
      targets: cardRef.current,
      rotateX: 0,
      rotateY: 0,
      duration: 600,
      easing:  'easeOutElastic(1, 0.6)',
    });
    anime({
      targets: imgRef.current,
      translateX: 0,
      translateY: 0,
      scale:   1,
      duration: 600,
      easing:  'easeOutExpo',
    });
  };

  const handleAgregar = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const btn = e.currentTarget;

    // Visible anime.js button feedback: pulse scale
    anime({
      targets: btn,
      scale:    [1, 0.88, 1.05, 1],
      duration: 500,
      easing:  'easeOutElastic(1, 0.5)',
    });

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      const carrito = await carritoApi.agregar(producto.id, 1);
      setCarrito(carrito);
      openCarrito();
      toast({ title: 'Agregado al carrito', description: producto.nombre });

      // Ripple success on the whole card
      anime({
        targets: cardRef.current,
        scale: [1, 1.04, 1],
        duration: 500,
        easing: 'easeOutQuad',
      });
    } catch (err: any) {
      // Shake on error
      anime({
        targets: cardRef.current,
        translateX: [0, -10, 10, -8, 8, -4, 4, 0],
        duration: 500,
        easing: 'easeInOutSine',
      });
      toast({ title: 'Error', description: err.response?.data?.message ?? 'No se pudo agregar', variant: 'destructive' });
    }
  };

  const descuento = producto.precioOferta
    ? calcularDescuento(Number(producto.precio), Number(producto.precioOferta))
    : null;

  return (
    <div
      className="group relative"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="tilt-card relative rounded-3xl overflow-hidden
                   bg-white border border-slate-200/70
                   shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                   hover:shadow-[0_20px_60px_rgba(80,50,200,0.25)]
                   transition-shadow duration-500"
      >
        {/* ═══ Imagen + overlay ═══ */}
        <div className="relative overflow-hidden aspect-[4/5] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
          {producto.imagen ? (
            <img
              ref={imgRef}
              src={producto.imagen}
              alt={producto.nombre}
              className="h-full w-full object-cover will-change-transform"
              onError={(e) => {
                (e.currentTarget.style as any).display = 'none';
              }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-300">
              <Eye className="h-24 w-24" />
            </div>
          )}

          {/* Glare / spotlight following cursor */}
          <div
            ref={glareRef}
            className="absolute inset-0 spotlight pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Gradient darken on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* ═══ Badges ═══ */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {producto.destacado && (
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0
                                shadow-lg backdrop-blur px-3 py-1">
                <Star className="h-3 w-3 mr-1 fill-white" /> Destacado
              </Badge>
            )}
            {descuento && (
              <Badge className="bg-gradient-to-r from-rose-500 to-pink-600 text-white border-0
                                shadow-lg px-3 py-1">
                <Zap className="h-3 w-3 mr-1 fill-white" /> -{descuento}%
              </Badge>
            )}
            {producto.estado === 'AGOTADO' && (
              <Badge className="bg-slate-900/80 text-white border-0 backdrop-blur">
                Agotado
              </Badge>
            )}
          </div>

          {/* Corner accents (futuristic brackets) */}
          <div className="absolute top-3 right-3 h-5 w-5 border-r-2 border-t-2 border-white/0
                          group-hover:border-cyan-400 transition-colors duration-500" />
          <div className="absolute bottom-3 left-3 h-5 w-5 border-l-2 border-b-2 border-white/0
                          group-hover:border-cyan-400 transition-colors duration-500" />

          {/* Quick action button sliding up */}
          <div className="absolute inset-x-4 bottom-4 z-10
                          translate-y-[120%] group-hover:translate-y-0
                          transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            <Button
              className="w-full h-11 rounded-full bg-white text-slate-900 hover:bg-white/90
                         font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              onClick={handleAgregar}
              disabled={producto.estado !== 'ACTIVO' || producto.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar al carrito
            </Button>
          </div>
        </div>

        {/* ═══ Info ═══ */}
        <Link to={`/productos/${producto.id}`} className="block p-5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold mb-1">
            {producto.categoria.nombre}
            {producto.marca && ` · ${producto.marca}`}
          </p>
          <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-900
                         group-hover:text-primary transition-colors mb-3 min-h-[2.5rem]">
            {producto.nombre}
          </h3>

          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              {producto.precioOferta ? (
                <>
                  <span className="text-xl font-black text-slate-900">
                    {formatCOP(Number(producto.precioOferta))}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formatCOP(Number(producto.precio))}
                  </span>
                </>
              ) : (
                <span className="text-xl font-black text-slate-900">
                  {formatCOP(Number(producto.precio))}
                </span>
              )}
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center
                            group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-purple-600
                            group-hover:text-white transition-all duration-500
                            group-hover:scale-110 group-hover:rotate-12">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Animated gradient border on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500
                        ring-1 ring-inset ring-primary/20" />
      </div>
    </div>
  );
}
