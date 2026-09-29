import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import {
  ArrowRight, Eye, Sun, Package, Sparkles, Shield, Truck,
  Zap, Award, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductosCarousel from '@/components/home/ProductosCarousel';
import MarcasCarousel from '@/components/home/MarcasCarousel';
import ScrollShowcase from '@/components/home/ScrollShowcase';
import { productosApi } from '@/api/productos.api';
import { categoriasApi } from '@/api/categorias.api';

const ICONOS_CATEGORIA: Record<string, React.ReactNode> = {
  'armazones':          <Eye className="h-10 w-10" />,
  'lentes-de-sol':      <Sun className="h-10 w-10" />,
  'lentes-de-contacto': <Target className="h-10 w-10" />,
  'accesorios':         <Package className="h-10 w-10" />,
};

const BENEFICIOS = [
  { icono: Sparkles, titulo: 'Calidad Premium', desc: 'Solo las mejores marcas del mundo óptico' },
  { icono: Shield,   titulo: 'Garantía 1 año',  desc: 'Respaldamos cada producto que vendemos' },
  { icono: Truck,    titulo: 'Envío gratis',    desc: 'En compras mayores a $200.000 COP' },
  { icono: Zap,      titulo: 'Entrega rápida',  desc: 'Despacho en menos de 24 horas' },
];

// ─── Helper: split text into individual character spans ───
const splitChars = (text: string, className = '') =>
  text.split('').map((ch, i) => (
    <span
      key={i}
      className={`inline-block opacity-0 ${className}`}
      data-char
      style={{ whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
    >
      {ch}
    </span>
  ));

// ─── Counter component with anime.js ───
function Contador({ valor, sufijo = '+' }: { valor: number; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obj = { v: 0 };
    anime({
      targets: obj,
      v:        valor,
      round:    1,
      duration: 2000,
      easing:   'easeOutExpo',
      delay:    400,
      update: () => {
        if (ref.current) ref.current.textContent = obj.v.toLocaleString('es-CO') + sufijo;
      },
    });
  }, [valor, sufijo]);
  return <span ref={ref}>0{sufijo}</span>;
}

export default function HomePage() {
  const heroRef   = useRef<HTMLDivElement>(null);
  const statsRef  = useRef<HTMLDivElement>(null);
  const catRef    = useRef<HTMLDivElement>(null);
  const benRef    = useRef<HTMLDivElement>(null);

  const { data: destacados } = useQuery({
    queryKey: ['productos', 'destacados'],
    queryFn: () => productosApi.listar({ destacado: true, limit: 8 }),
  });

  const { data: recientes } = useQuery({
    queryKey: ['productos', 'recientes'],
    queryFn: () => productosApi.listar({ limit: 8 }),
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => categoriasApi.listar(),
  });

  // ─── Hero entrance animation (multiple anime.js timelines) ───
  useEffect(() => {
    if (!heroRef.current) return;

    // 1. Background blob floating animation (continuous)
    anime({
      targets:  '.hero-blob',
      translateX: () => anime.random(-30, 30),
      translateY: () => anime.random(-30, 30),
      scale:    () => anime.random(0.9, 1.15),
      duration: 6000,
      easing:   'easeInOutQuad',
      direction: 'alternate',
      loop:     true,
      delay:    anime.stagger(400),
    });

    // 2. Main hero timeline: badge → title chars → subtitle → buttons → visual
    const tl = anime.timeline({ easing: 'easeOutExpo' });

    tl.add({
      targets:    '.hero-badge',
      opacity:    [0, 1],
      translateY: [-30, 0],
      scale:      [0.8, 1],
      duration:   700,
    })
    .add({
      targets:    '.hero-title [data-char]',
      opacity:    [0, 1],
      translateY: [80, 0],
      rotateZ:    [10, 0],
      filter:     ['blur(10px)', 'blur(0px)'],
      duration:   900,
      delay:      anime.stagger(28),
    }, '-=400')
    .add({
      targets:    '.hero-subtitle',
      opacity:    [0, 1],
      translateY: [30, 0],
      duration:   700,
    }, '-=500')
    .add({
      targets:    '.hero-buttons',
      opacity:    [0, 1],
      translateY: [30, 0],
      scale:      [0.9, 1],
      duration:   600,
    }, '-=400')
    .add({
      targets:    '.hero-visual',
      opacity:    [0, 1],
      scale:      [0.85, 1],
      rotate:     [-8, 0],
      duration:   1000,
    }, '-=800')
    .add({
      targets:    '.hero-stat',
      opacity:    [0, 1],
      translateY: [20, 0],
      duration:   500,
      delay:      anime.stagger(120),
    }, '-=400');

    // 3. Scan line infinite loop over hero visual
    anime({
      targets: '.hero-scan',
      translateY: ['-100%', '100%'],
      opacity:    [0, 0.6, 0],
      duration:   3500,
      easing:     'easeInOutQuad',
      loop:       true,
    });

    // 4. Orbit dots around the visual
    anime({
      targets: '.orbit-dot',
      rotate:  '1turn',
      duration: 12000,
      easing:  'linear',
      loop:    true,
    });
  }, []);

  // ─── Scroll-triggered reveals using IntersectionObserver + anime.js ───
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const preset = el.dataset.animPreset || 'fadeUp';

            if (preset === 'cards') {
              anime({
                targets:    el.querySelectorAll('[data-anim-item]'),
                opacity:    [0, 1],
                translateY: [60, 0],
                scale:      [0.92, 1],
                rotateX:    [-15, 0],
                delay:      anime.stagger(120, { start: 100 }),
                duration:   900,
                easing:     'easeOutExpo',
              });
            } else {
              anime({
                targets:    el,
                opacity:    [0, 1],
                translateY: [50, 0],
                duration:   800,
                easing:     'easeOutExpo',
              });
            }
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    [statsRef, catRef, benRef].forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, [categorias]);

  return (
    <div>
      {/* ═══════════════════════════════════════════════════
          HERO — Futuristic with mesh bg + text reveal + orbit
          ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative mesh-bg text-white min-h-[92vh] flex items-center overflow-hidden"
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay pointer-events-none" />

        {/* Floating gradient blobs */}
        <div className="hero-blob absolute top-20 -left-20 h-96 w-96 rounded-full
                        bg-gradient-to-br from-purple-500/40 to-pink-500/20 blur-3xl" />
        <div className="hero-blob absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full
                        bg-gradient-to-tr from-blue-500/40 to-cyan-400/20 blur-3xl" />
        <div className="hero-blob absolute top-1/3 left-1/2 h-72 w-72 rounded-full
                        bg-gradient-to-r from-fuchsia-500/30 to-indigo-500/20 blur-3xl" />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-24">
          {/* ── Left column: text ── */}
          <div className="space-y-8">
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full
                            glass-dark text-xs uppercase tracking-[0.2em] font-medium">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse-ring" />
              Nueva colección · 2026
            </div>

            <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
              <div className="overflow-hidden">
                {splitChars('Tu visión,')}
              </div>
              <div className="overflow-hidden">
                {splitChars('redefinida.', 'text-gradient')}
              </div>
            </h1>

            <p className="hero-subtitle text-lg md:text-xl text-white/70 max-w-xl leading-relaxed opacity-0">
              Armazones de alta gama, lentes de sol icónicos y tecnología visual
              de última generación. Explora el futuro de la óptica.
            </p>

            <div className="hero-buttons flex gap-4 flex-wrap opacity-0">
              <Button
                size="lg"
                asChild
                className="group bg-white text-slate-900 hover:bg-white/90 h-14 px-8 rounded-full
                           text-base font-semibold shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <Link to="/productos">
                  Explorar catálogo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 rounded-full text-base font-semibold
                           bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white"
              >
                <Link to="/registro">Crear cuenta</Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 pt-6 border-t border-white/10">
              <div className="hero-stat opacity-0">
                <div className="text-3xl md:text-4xl font-black text-gradient-cyan">
                  <Contador valor={1200} />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                  Productos
                </div>
              </div>
              <div className="hero-stat opacity-0">
                <div className="text-3xl md:text-4xl font-black text-gradient-cyan">
                  <Contador valor={50} />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                  Marcas
                </div>
              </div>
              <div className="hero-stat opacity-0">
                <div className="text-3xl md:text-4xl font-black text-gradient-cyan">
                  <Contador valor={15000} />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider mt-1">
                  Clientes
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column: futuristic visual ── */}
          <div className="hero-visual relative h-[480px] hidden lg:flex items-center justify-center opacity-0">
            {/* Outer orbit ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[460px] w-[460px] rounded-full border border-white/15" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[340px] w-[340px] rounded-full border border-white/10" />
            </div>

            {/* Orbiting dots */}
            <div className="orbit-dot absolute h-[460px] w-[460px] pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full
                              bg-cyan-400 shadow-[0_0_20px_4px_rgba(34,211,238,0.6)]" />
            </div>
            <div className="orbit-dot absolute h-[340px] w-[340px] pointer-events-none">
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full
                              bg-fuchsia-400 shadow-[0_0_18px_4px_rgba(232,121,249,0.6)]" />
            </div>

            {/* Central product card with scan line */}
            <div className="relative h-72 w-72 rounded-3xl glass-dark overflow-hidden
                            glow-primary animate-float">
              <img
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
                alt="Gafas destacadas"
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              {/* Scan overlay */}
              <div className="hero-scan absolute left-0 right-0 h-[60%]
                              bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent
                              pointer-events-none" />
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 h-6 w-6 border-l-2 border-t-2 border-cyan-400" />
              <div className="absolute top-3 right-3 h-6 w-6 border-r-2 border-t-2 border-cyan-400" />
              <div className="absolute bottom-3 left-3 h-6 w-6 border-l-2 border-b-2 border-cyan-400" />
              <div className="absolute bottom-3 right-3 h-6 w-6 border-r-2 border-b-2 border-cyan-400" />
            </div>

            {/* Floating info chips */}
            <div className="absolute top-12 -left-4 px-4 py-2 rounded-full glass-dark text-xs
                            flex items-center gap-2 animate-float" style={{ animationDelay: '1s' }}>
              <Award className="h-3.5 w-3.5 text-cyan-400" />
              Premium
            </div>
            <div className="absolute bottom-16 -right-2 px-4 py-2 rounded-full glass-dark text-xs
                            flex items-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
              UV 400
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24
                        bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </section>

      {/* ═══════════════════════════════════════════════════
          BENEFICIOS — Glass cards
          ═══════════════════════════════════════════════════ */}
      <section
        ref={benRef}
        data-anim-preset="cards"
        className="container -mt-16 relative z-20 px-4"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFICIOS.map(({ icono: Icono, titulo, desc }) => (
            <div
              key={titulo}
              data-anim-item
              className="opacity-0 group relative p-6 rounded-2xl
                         bg-white border border-slate-200/70 shadow-sm
                         hover:border-transparent hover:shadow-2xl
                         transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl
                                bg-gradient-to-br from-primary to-purple-600 text-white
                                group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <Icono className="h-6 w-6" />
                </div>
                <p className="mt-4 font-bold text-slate-900">{titulo}</p>
                <p className="text-sm text-slate-500 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORÍAS — 3D cards
          ═══════════════════════════════════════════════════ */}
      {categorias && categorias.length > 0 && (
        <section
          ref={catRef}
          data-anim-preset="cards"
          className="container py-28 px-4"
        >
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="h-3 w-3" /> Explora
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Categorías <span className="text-gradient">destacadas</span>
            </h2>
            <p className="text-slate-500 mt-4">
              Encuentra exactamente lo que buscas en nuestra selección curada
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                to={`/productos?categoriaId=${cat.id}`}
                data-anim-item
                className="opacity-0 group relative overflow-hidden rounded-3xl p-8
                           bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                           border border-white/10 min-h-[260px]
                           flex flex-col justify-between
                           hover:border-primary/50 transition-all duration-500"
              >
                {/* Animated gradient bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-purple-600/20 to-pink-500/20
                                opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-primary/30 blur-3xl
                                opacity-40 group-hover:opacity-80 transition-opacity duration-700" />

                <div className="relative z-10 inline-flex h-16 w-16 items-center justify-center
                                rounded-2xl bg-white/5 border border-white/10 text-white
                                group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                  {ICONOS_CATEGORIA[cat.slug] ?? <Package className="h-10 w-10" />}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white">{cat.nombre}</h3>
                  {cat.descripcion && (
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">{cat.descripcion}</p>
                  )}
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold
                                  text-cyan-400 opacity-0 -translate-x-2
                                  group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    Ver productos <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          SCROLL SHOWCASE — producto animado al hacer scroll
          ═══════════════════════════════════════════════════ */}
      <ScrollShowcase />

      {/* ═══════════════════════════════════════════════════
          CARRUSEL DESTACADOS
          ═══════════════════════════════════════════════════ */}
      {destacados && destacados.data.length > 0 && (
        <ProductosCarousel
          productos={destacados.data}
          titulo="Productos destacados"
          subtitulo="Nuestra selección curada del mes"
          variant="featured"
        />
      )}

      {/* ═══════════════════════════════════════════════════
          MARCAS
          ═══════════════════════════════════════════════════ */}
      <MarcasCarousel />

      {/* ═══════════════════════════════════════════════════
          CARRUSEL NOVEDADES
          ═══════════════════════════════════════════════════ */}
      {recientes && recientes.data.length > 0 && (
        <ProductosCarousel
          productos={recientes.data}
          titulo="Últimas novedades"
          subtitulo="Lo más reciente de la tienda"
        />
      )}

      {/* ═══════════════════════════════════════════════════
          CTA BANNER — Dark futuristic
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden mesh-bg text-white">
        <div className="absolute inset-0 grid-overlay" />
        <div className="hero-blob absolute top-0 left-1/3 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="hero-blob absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="container max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl
                          glass-dark glow-primary">
            <Sparkles className="h-8 w-8 text-cyan-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            ¿Listo para tu <br />
            <span className="text-gradient">nueva mirada?</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-lg">
            Descubre el catálogo completo o habla con nuestros expertos para
            encontrar el producto perfecto para ti.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-4">
            <Button
              size="lg"
              asChild
              className="h-14 px-10 rounded-full bg-white text-slate-900 hover:bg-white/90
                         text-base font-semibold shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <Link to="/productos">
                Ver catálogo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-14 px-10 rounded-full bg-white/5 border-white/30 text-white hover:bg-white/15 hover:text-white"
            >
              <Link to="/registro">Crear cuenta</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
