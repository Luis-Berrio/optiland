import { useEffect, useRef } from 'react';
import anime from 'animejs';

const MARCAS = [
  { nombre: 'Ray-Ban',       logo: 'RB' },
  { nombre: 'Oakley',        logo: 'OA' },
  { nombre: 'Vogue',         logo: 'VG' },
  { nombre: 'Guess',         logo: 'GS' },
  { nombre: 'Acuvue',        logo: 'AV' },
  { nombre: 'Air Optix',     logo: 'AO' },
  { nombre: 'FreshLook',     logo: 'FL' },
  { nombre: 'Miraflex',      logo: 'MF' },
  { nombre: 'Ray-Optic',     logo: 'RO' },
  { nombre: 'Prada',         logo: 'PR' },
  { nombre: 'Dolce&Gabbana', logo: 'DG' },
  { nombre: 'Versace',       logo: 'VS' },
];

export default function MarcasCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Infinite scroll anime.js
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const totalWidth = track.scrollWidth / 2;

    const anim = anime({
      targets:    track,
      translateX: [0, -totalWidth],
      duration:   30000,
      easing:     'linear',
      loop:       true,
    });

    return () => anim.pause();
  }, []);

  // Scroll reveal for header
  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          anime({
            targets:    sectionRef.current?.querySelectorAll('[data-brand-header]') ?? [],
            opacity:    [0, 1],
            translateY: [30, 0],
            delay:      anime.stagger(120),
            duration:   800,
            easing:     'easeOutExpo',
          });
          obs.disconnect();
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const items = [...MARCAS, ...MARCAS];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden mesh-bg text-white"
    >
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      <div className="container relative z-10 text-center mb-14 px-4">
        <div
          data-brand-header
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                     glass-dark text-xs font-semibold uppercase tracking-wider mb-4 opacity-0"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          Alianzas
        </div>
        <h2
          data-brand-header
          className="text-4xl md:text-5xl font-black tracking-tight opacity-0"
        >
          Las <span className="text-gradient">mejores marcas</span> del mundo
        </h2>
        <p
          data-brand-header
          className="text-white/60 mt-3 max-w-xl mx-auto opacity-0"
        >
          Trabajamos con los referentes globales en óptica y moda visual
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none
                        bg-gradient-to-r from-[#0a0118] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none
                        bg-gradient-to-l from-[#0a0118] to-transparent" />

        <div
          ref={trackRef}
          className="flex gap-6 items-center w-max"
        >
          {items.map((marca, i) => (
            <div
              key={`${marca.nombre}-${i}`}
              className="group flex-shrink-0 w-44 h-28 rounded-2xl
                         glass-dark flex flex-col items-center justify-center gap-2
                         hover:border-cyan-400/50 transition-all duration-500
                         cursor-default relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-cyan-400/10
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-12 w-12 rounded-full
                              bg-gradient-to-br from-white/10 to-white/5
                              border border-white/20 flex items-center justify-center
                              group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <span className="text-base font-black text-gradient-cyan">
                  {marca.logo}
                </span>
              </div>
              <span className="relative text-xs text-white/70 font-semibold whitespace-nowrap
                               group-hover:text-white transition-colors">
                {marca.nombre}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
