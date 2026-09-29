import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductoCard from '@/components/productos/ProductoCard';
import type { Producto } from '@/types';

interface ProductosCarouselProps {
  productos: Producto[];
  titulo:    string;
  subtitulo?: string;
  variant?:  'default' | 'featured';
}

const CARD_WIDTH = 320;
const GAP        = 32;

export default function ProductosCarousel({
  productos,
  titulo,
  subtitulo,
  variant = 'default',
}: ProductosCarouselProps) {
  const trackRef   = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const [index,  setIndex]  = useState(0);
  const [visibles, setVisibles] = useState(4);

  // Responsive visibles
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if      (w < 640)  setVisibles(1);
      else if (w < 1024) setVisibles(2);
      else if (w < 1280) setVisibles(3);
      else               setVisibles(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, productos.length - visibles);

  // ─── Slide animation on index change ───
  useEffect(() => {
    if (!trackRef.current) return;
    const offset = -(index * (CARD_WIDTH + GAP));

    anime({
      targets:   trackRef.current,
      translateX: offset,
      duration:  900,
      easing:    'easeOutExpo',
    });

    // Per-card perspective effect: inactive cards recede
    const cards = trackRef.current.querySelectorAll<HTMLElement>('[data-slide-item]');
    cards.forEach((card, i) => {
      const isInView = i >= index && i < index + visibles;
      anime({
        targets:   card,
        scale:     isInView ? 1    : 0.88,
        opacity:   isInView ? 1    : 0.45,
        translateZ: isInView ? 0   : -60,
        rotateY:    isInView ? 0   : (i < index ? 15 : -15),
        duration:  900,
        easing:    'easeOutExpo',
      });
    });
  }, [index, visibles]);

  // ─── Header + initial stagger entrance (IntersectionObserver) ───
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;

          // Title reveal with filter blur
          anime({
            targets: headerRef.current?.querySelectorAll('[data-header-el]') ?? [],
            opacity:    [0, 1],
            translateY: [40, 0],
            filter:     ['blur(10px)', 'blur(0px)'],
            delay:      anime.stagger(120),
            duration:   800,
            easing:     'easeOutExpo',
          });

          // Cards stagger with 3D rotation
          anime({
            targets: containerRef.current?.querySelectorAll('[data-slide-item]') ?? [],
            opacity:    [0, 1],
            translateY: [60, 0],
            rotateY:    [-15, 0],
            scale:      [0.85, 1],
            delay:      anime.stagger(100, { start: 200 }),
            duration:   1000,
            easing:     'easeOutExpo',
          });

          obs.disconnect();
        });
      },
      { threshold: 0.1 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  if (!productos.length) return null;

  const isFeatured = variant === 'featured';

  return (
    <section
      ref={containerRef}
      className={`relative py-24 overflow-hidden ${
        isFeatured
          ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
          : 'bg-white'
      }`}
    >
      {/* Decorative blobs for featured */}
      {isFeatured && (
        <>
          <div className="absolute top-20 -left-40 h-96 w-96 rounded-full
                          bg-gradient-to-br from-primary/15 to-purple-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 -right-40 h-96 w-96 rounded-full
                          bg-gradient-to-br from-pink-400/10 to-cyan-400/10 blur-3xl pointer-events-none" />
        </>
      )}

      <div className="container relative z-10 px-4">
        {/* ═══ Header ═══ */}
        <div
          ref={headerRef}
          className="flex items-end justify-between gap-6 mb-14 flex-wrap"
        >
          <div className="max-w-xl">
            <div
              data-header-el
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                         bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 opacity-0"
            >
              <Sparkles className="h-3 w-3" />
              {isFeatured ? 'Selección del mes' : 'Catálogo'}
            </div>
            <h2
              data-header-el
              className="text-4xl md:text-5xl font-black tracking-tight opacity-0"
            >
              {titulo.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? (
                    <span className="text-gradient">{word}</span>
                  ) : (
                    <>{word} </>
                  )}
                </span>
              ))}
            </h2>
            {subtitulo && (
              <p data-header-el className="text-slate-500 mt-3 text-lg opacity-0">
                {subtitulo}
              </p>
            )}
          </div>

          <div data-header-el className="flex gap-3 opacity-0">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              disabled={index === 0}
              className="h-12 w-12 rounded-full border-2 hover:border-primary hover:bg-primary hover:text-white
                         transition-all disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              disabled={index >= maxIndex}
              className="h-12 w-12 rounded-full border-2 hover:border-primary hover:bg-primary hover:text-white
                         transition-all disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* ═══ Track with perspective ═══ */}
        <div
          className="overflow-visible"
          style={{ perspective: '1800px', perspectiveOrigin: 'center' }}
        >
          <div
            ref={trackRef}
            className="flex"
            style={{
              width: 'max-content',
              gap:   `${GAP}px`,
              transformStyle: 'preserve-3d',
            }}
          >
            {productos.map((p) => (
              <div
                key={p.id}
                data-slide-item
                className="flex-shrink-0 opacity-0"
                style={{ width: CARD_WIDTH, transformStyle: 'preserve-3d' }}
              >
                <ProductoCard producto={p} />
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Progress bar indicator ═══ */}
        {productos.length > visibles && (
          <div className="mt-12 flex items-center gap-4 max-w-md mx-auto">
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 h-[3px] bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500
                           rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${((index + 1) / (maxIndex + 1)) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {String(maxIndex + 1).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
