import { useEffect, useRef, useState } from 'react';
import { Zap, Shield, Sparkles, Award } from 'lucide-react';

// ─── Pasos del showcase ───
const PASOS = [
  {
    titulo: 'Protección UV 400',
    sub:    'Lentes polarizados',
    desc:   'Cristales certificados que bloquean el 100% de los rayos UVA y UVB dañinos. Ver claro, sin deslumbramientos ni fatiga visual.',
    icono:  Shield,
    color:  'from-cyan-400 to-blue-500',
    tag:    '100% UV',
    stat:   '400',
    statLabel: 'nm UV bloqueados',
  },
  {
    titulo: 'Titanio premium',
    sub:    'Materiales de alta gama',
    desc:   'Armazones fabricados con aleaciones de titanio aeroespacial y acetato italiano. Resistencia, durabilidad y confort en cada detalle.',
    icono:  Award,
    color:  'from-fuchsia-500 to-purple-600',
    tag:    'Titanio',
    stat:   '12g',
    statLabel: 'peso ultraligero',
  },
  {
    titulo: '50+ estilos únicos',
    sub:    'Diseño atemporal',
    desc:   'Desde los clásicos aviador hasta las últimas tendencias en cat eye y geométricos. Miles de combinaciones para tu estilo.',
    icono:  Sparkles,
    color:  'from-amber-400 to-orange-500',
    tag:    '50+ estilos',
    stat:   '1.2k',
    statLabel: 'productos en tienda',
  },
  {
    titulo: 'Entrega en 24h',
    sub:    'Despacho express',
    desc:   'Recibe tu pedido en menos de un día hábil en las principales ciudades. Seguimiento en tiempo real y garantía de 1 año.',
    icono:  Zap,
    color:  'from-green-400 to-emerald-500',
    tag:    '24h',
    stat:   '24h',
    statLabel: 'entrega garantizada',
  },
];

const IMG_BASE = 'https://images.unsplash.com/photo-';
const IMAGENES = [
  `${IMG_BASE}1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80`,
  `${IMG_BASE}1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80`,
  `${IMG_BASE}1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80`,
  `${IMG_BASE}1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80`,
];

export default function ScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);    // 0 → 1
  const [stepIdx,  setStepIdx]  = useState(0);
  const [stepProg, setStepProg] = useState(0);    // progreso dentro del paso actual

  // ─── Scroll listener con rAF ───
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!sectionRef.current) return;
        const rect  = sectionRef.current.getBoundingClientRect();
        const vh    = window.innerHeight;
        const total = rect.height - vh;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        setProgress(p);

        const segment = 1 / PASOS.length;
        const idx     = Math.min(PASOS.length - 1, Math.floor(p / segment));
        const sp      = (p - idx * segment) / segment; // 0-1 dentro del paso
        setStepIdx(idx);
        setStepProg(sp);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // ─── Transformaciones derivadas ───
  const rotY   = progress * 720;                               // 2 vueltas
  const rotZ   = Math.sin(progress * Math.PI * 2) * 12;
  const scale  = 1 + Math.sin(progress * Math.PI) * 0.12;
  const moveX  = Math.sin(progress * Math.PI * 2) * 30;
  const moveY  = Math.cos(progress * Math.PI * 2) * 20;

  const paso = PASOS[stepIdx];
  const ActiveIcon = paso.icono;

  return (
    <section
      ref={sectionRef}
      className="relative mesh-bg text-white"
      style={{ height: '380vh' }}
    >
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* ═══ STICKY CONTAINER ═══ */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Blobs con parallax */}
        <div
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full
                     bg-gradient-to-br from-purple-500/40 to-transparent blur-3xl pointer-events-none"
          style={{ transform: `translate(${progress * 120}px, ${progress * -80}px)` }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full
                     bg-gradient-to-tr from-cyan-400/30 to-transparent blur-3xl pointer-events-none"
          style={{ transform: `translate(${progress * -140}px, ${progress * 60}px)` }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-[400px] w-[400px] rounded-full
                     bg-gradient-to-br from-pink-500/25 to-transparent blur-3xl pointer-events-none"
          style={{ transform: `translate(${-200 + progress * 400}px, -50%)` }}
        />

        {/* ═══ Header fijo arriba ═══ */}
        <div className="absolute top-24 left-0 right-0 z-20 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          glass-dark text-[10px] md:text-xs font-semibold uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Experiencia Optiland
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-center px-4">
            La tecnología detrás de <span className="text-gradient">cada producto</span>
          </h2>
        </div>

        {/* ═══ Progress rail vertical (izq desktop) ═══ */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">Scroll</div>
          <div className="relative h-64 w-[3px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500
                         rounded-full"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
          <div className="text-xs font-mono tabular-nums text-white">
            {String(Math.round(progress * 100)).padStart(2, '0')}%
          </div>
        </div>

        {/* ═══ CONTENIDO PRINCIPAL CENTRADO ═══ */}
        <div className="h-full w-full flex items-center justify-center px-4 pt-20">
          <div className="container grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl">
            {/* ─── IZQUIERDA: texto del paso ─── */}
            <div className="relative h-[420px] lg:h-[480px]">
              {PASOS.map((p, i) => {
                const active = i === stepIdx;
                const past   = i < stepIdx;
                const Icono  = p.icono;
                return (
                  <div
                    key={i}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active
                        ? 'translateY(0) scale(1)'
                        : past
                          ? 'translateY(-60px) scale(0.95)'
                          : 'translateY(60px) scale(0.95)',
                      pointerEvents: active ? 'auto' : 'none',
                    }}
                  >
                    {/* Número grande */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl
                                    bg-gradient-to-br ${p.color}
                                    shadow-[0_0_40px_rgba(120,80,255,0.5)]`}
                      >
                        <Icono className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.25em]">
                        Paso<br />
                        <span className="text-2xl text-white font-black tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-white/30"> / {String(PASOS.length).padStart(2, '0')}</span>
                      </div>
                    </div>

                    <p
                      className={`text-sm md:text-base font-semibold uppercase tracking-wider
                                  bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-2`}
                    >
                      {p.sub}
                    </p>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                      {p.titulo}
                    </h3>
                    <p className="text-white/65 text-base md:text-lg mt-5 max-w-md leading-relaxed">
                      {p.desc}
                    </p>

                    {/* Stat destacada */}
                    <div className="mt-8 flex items-end gap-4">
                      <div
                        className={`text-5xl md:text-6xl font-black bg-gradient-to-br ${p.color}
                                    bg-clip-text text-transparent tabular-nums`}
                      >
                        {p.stat}
                      </div>
                      <div className="text-xs text-white/50 pb-2 max-w-[120px] leading-tight">
                        {p.statLabel}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Indicadores de progreso por paso — SIEMPRE visibles */}
              <div className="absolute bottom-0 left-0 right-0 flex gap-2">
                {PASOS.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${PASOS[i].color}
                                  transition-all duration-300`}
                      style={{
                        width:
                          i < stepIdx ? '100%' :
                          i === stepIdx ? `${stepProg * 100}%` :
                          '0%',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ─── DERECHA: producto flotante ─── */}
            <div
              className="relative h-[420px] lg:h-[480px] flex items-center justify-center"
              style={{ perspective: '1200px' }}
            >
              {/* Anillos orbitales */}
              <div
                className="absolute h-[440px] w-[440px] rounded-full border border-white/10 hidden md:block"
                style={{ transform: `rotate(${progress * 360}deg)` }}
              />
              <div
                className="absolute h-[340px] w-[340px] rounded-full border border-white/15 hidden md:block"
                style={{ transform: `rotate(${progress * -540}deg)` }}
              />
              <div
                className="absolute h-[240px] w-[240px] rounded-full border border-cyan-400/25"
                style={{ transform: `rotate(${progress * 720}deg)` }}
              />

              {/* Puntos orbitales */}
              <div
                className="absolute h-[440px] w-[440px] hidden md:block"
                style={{ transform: `rotate(${progress * 720}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full
                                bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.9)]" />
              </div>
              <div
                className="absolute h-[340px] w-[340px] hidden md:block"
                style={{ transform: `rotate(${progress * -540 + 120}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full
                                bg-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.9)]" />
              </div>

              {/* Tag flotante animada */}
              <div
                className="absolute z-20 px-4 py-2 rounded-full glass-dark text-xs font-bold
                           flex items-center gap-2 transition-all duration-500"
                style={{
                  transform: `translate(${100 + moveX}px, ${-130 + moveY}px)`,
                }}
              >
                <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${paso.color}`} />
                {paso.tag}
              </div>

              {/* ═══ Imagen del producto con transforms 3D ═══ */}
              <div
                className="relative h-64 w-64 md:h-72 md:w-72 rounded-[2rem] overflow-hidden glow-primary"
                style={{
                  transform:
                    `translate3d(${moveX}px, ${moveY}px, 0) ` +
                    `rotateY(${rotY}deg) rotateZ(${rotZ}deg) ` +
                    `scale(${scale})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {IMAGENES.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                    style={{ opacity: i === stepIdx ? 1 : 0 }}
                  />
                ))}

                {/* Scan line */}
                <div
                  className="absolute left-0 right-0 h-20 bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent pointer-events-none"
                  style={{ top: `${((progress * 300) % 130)}%` }}
                />

                {/* Corner brackets */}
                <div className="absolute top-3 left-3 h-6 w-6 border-l-2 border-t-2 border-cyan-400" />
                <div className="absolute top-3 right-3 h-6 w-6 border-r-2 border-t-2 border-cyan-400" />
                <div className="absolute bottom-3 left-3 h-6 w-6 border-l-2 border-b-2 border-cyan-400" />
                <div className="absolute bottom-3 right-3 h-6 w-6 border-r-2 border-b-2 border-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* HUD corners */}
        <div className="absolute top-6 right-6 text-[10px] font-mono text-cyan-400/70 space-y-1 text-right hidden lg:block">
          <div>SYSTEM: OPTILAND_v2.6</div>
          <div>FRAME: {Math.round(progress * 720).toString().padStart(3, '0')}°</div>
          <div>STATE: {paso.tag.toUpperCase()}</div>
        </div>
        <div className="absolute bottom-6 right-6 text-[10px] font-mono text-fuchsia-400/70 space-y-1 text-right hidden lg:block">
          <div>SCAN: {(progress * 100).toFixed(1)}%</div>
          <div>STEP: {stepIdx + 1}/{PASOS.length}</div>
          <div>QUALITY: PREMIUM</div>
        </div>

        {/* Hint scroll */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                     text-white/40 text-[10px] uppercase tracking-widest transition-opacity duration-300"
          style={{ opacity: progress < 0.05 ? 1 : 0 }}
        >
          <span>Desliza hacia abajo</span>
          <div className="h-8 w-[1px] bg-white/30" />
        </div>
      </div>
    </section>
  );
}
