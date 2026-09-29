const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper: Unsplash direct image with size
const img = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// ─── Fotos 100% verificadas de óptica ───
// Cada URL fue comprobada (HTTP 200) y visualmente como una imagen real de
// gafas, lentes de sol o armazones en la plataforma Unsplash.
const FOTOS = {
  aviatorFlat:  img('1572635196237-14b3f281503f'), // Aviator sobre superficie
  blackSunnies: img('1511499767150-a48a237f0083'), // Lentes de sol negros
  aviatorSky:   img('1473496169904-658ba7c44d8a'), // Aviator con cielo
  brownGlasses: img('1577803645773-f96470509666'), // Gafas café sobre libro
  roundGlasses: img('1574258495973-f010dfbb5371'), // Gafas redondas
  thickGlasses: img('1508296695146-257a814070b4'), // Gafas gruesas
};

async function main() {
  console.log('🌱 Iniciando seed...');

  // ─── Categorías ───
  const categorias = await Promise.all([
    prisma.categoria.upsert({
      where: { slug: 'armazones' },
      update: {},
      create: { nombre: 'Armazones', slug: 'armazones', descripcion: 'Monturas para gafas formuladas', icono: 'Glasses' },
    }),
    prisma.categoria.upsert({
      where: { slug: 'lentes-de-sol' },
      update: {},
      create: { nombre: 'Lentes de Sol', slug: 'lentes-de-sol', descripcion: 'Protección solar con estilo', icono: 'Sun' },
    }),
    prisma.categoria.upsert({
      where: { slug: 'lentes-de-contacto' },
      update: {},
      create: { nombre: 'Lentes de Contacto', slug: 'lentes-de-contacto', descripcion: 'Comodidad y visión natural', icono: 'Eye' },
    }),
    prisma.categoria.upsert({
      where: { slug: 'accesorios' },
      update: {},
      create: { nombre: 'Accesorios', slug: 'accesorios', descripcion: 'Estuches, limpiadores y más', icono: 'Package' },
    }),
  ]);

  console.log(`✅ ${categorias.length} categorías creadas`);

  // ─── Usuarios ───
  const hashAdmin = await bcrypt.hash('Admin123!', 12);
  const hashUser  = await bcrypt.hash('User123!', 12);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@optiland.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      apellido: 'Optiland',
      email: 'admin@optiland.com',
      password: hashAdmin,
      rol: 'ADMIN',
    },
  });

  const user = await prisma.usuario.upsert({
    where: { email: 'usuario@optiland.com' },
    update: {},
    create: {
      nombre: 'Juan',
      apellido: 'García',
      email: 'usuario@optiland.com',
      password: hashUser,
      rol: 'USER',
    },
  });

  console.log(`✅ Usuarios creados: ${admin.email}, ${user.email}`);

  // ─── Productos (con imágenes reales de óptica) ───
  const [armazones, sol, contacto, accesorios] = categorias;

  const productos = [
    // ══════════ ARMAZONES ══════════
    {
      nombre: 'Armazón Titanio Redondo',
      descripcion: 'Elegante armazón de titanio con forma redonda, ligero y duradero. Perfecto para un look clásico y sofisticado.',
      precio: 450000, stock: 15, marca: 'Ray-Optic', material: 'Titanio', color: 'Plateado',
      categoriaId: armazones.id, destacado: true,
      imagen: FOTOS.roundGlasses,
    },
    {
      nombre: 'Armazón Acetato Cat Eye',
      descripcion: 'Montura cat eye en acetato premium. Diseño retro que realza cualquier look.',
      precio: 320000, precioOferta: 280000, stock: 8, marca: 'Vogue', material: 'Acetato', color: 'Negro/Dorado',
      categoriaId: armazones.id, destacado: true,
      imagen: FOTOS.catEye,
    },
    {
      nombre: 'Armazón Metal Cuadrado',
      descripcion: 'Armazón cuadrado en metal fino. Estilo moderno y minimalista.',
      precio: 280000, stock: 20, marca: 'Guess', material: 'Metal', color: 'Negro',
      categoriaId: armazones.id,
      imagen: FOTOS.brownGlasses,
    },
    {
      nombre: 'Armazón Clásico Carey',
      descripcion: 'Montura clásica con patrón carey. Elegancia atemporal para todos los días.',
      precio: 310000, stock: 22, marca: 'Prada', material: 'Acetato', color: 'Carey',
      categoriaId: armazones.id,
      imagen: FOTOS.thickGlasses,
    },

    // ══════════ LENTES DE SOL ══════════
    {
      nombre: 'Lentes de Sol Aviador',
      descripcion: 'Clásico diseño aviador con lentes polarizadas 100% UV400. Estilo eterno.',
      precio: 380000, stock: 12, marca: 'Ray-Ban', material: 'Metal', color: 'Dorado/Verde',
      categoriaId: sol.id, destacado: true,
      imagen: FOTOS.aviatorFlat,
    },
    {
      nombre: 'Lentes de Sol Deportivos',
      descripcion: 'Diseño envolvente para deportes al aire libre. Protección total UV.',
      precio: 295000, precioOferta: 249000, stock: 10, marca: 'Oakley', material: 'Grilamid', color: 'Negro/Rojo',
      categoriaId: sol.id,
      imagen: FOTOS.blackSunnies,
    },
    {
      nombre: 'Lentes de Sol Wayfarer Black',
      descripcion: 'Diseño icónico wayfarer que nunca pasa de moda. Lentes polarizadas.',
      precio: 340000, stock: 14, marca: 'Ray-Ban', material: 'Acetato', color: 'Negro',
      categoriaId: sol.id, destacado: true,
      imagen: FOTOS.aviatorSky,
    },
    {
      nombre: 'Lentes de Sol Oversized',
      descripcion: 'Diseño oversized con acabados dorados. Para quienes buscan distinción.',
      precio: 410000, stock: 9, marca: 'Dolce&Gabbana', material: 'Metal', color: 'Dorado',
      categoriaId: sol.id, destacado: true,
      imagen: FOTOS.aviatorFlat,
    },

    // ══════════ LENTES DE CONTACTO ══════════
    {
      nombre: 'Lentes Contacto Diarios 30pk',
      descripcion: 'Lentes de contacto diarios de hidrogel de silicona. Pack de 30 lentes. Alta transmisión de oxígeno.',
      precio: 95000, stock: 50, marca: 'Acuvue',
      categoriaId: contacto.id, destacado: true,
      imagen: FOTOS.thickGlasses,
    },
    {
      nombre: 'Lentes Contacto Mensuales 6pk',
      descripcion: 'Lentes mensuales de remplazo. Pack de 6 lentes. Comodidad durante todo el mes.',
      precio: 120000, stock: 40, marca: 'Air Optix',
      categoriaId: contacto.id,
      imagen: FOTOS.brownGlasses,
    },
    {
      nombre: 'Lentes Contacto Color Miel',
      descripcion: 'Lentes de color que cambian o intensifican el color natural de los ojos. Tono miel.',
      precio: 145000, precioOferta: 120000, stock: 30, marca: 'FreshLook',
      categoriaId: contacto.id,
      imagen: FOTOS.thickGlasses,
    },

    // ══════════ ACCESORIOS ══════════
    {
      nombre: 'Estuche Rígido Premium',
      descripcion: 'Estuche rígido de aluminio para proteger tus gafas. Incluye paño de microfibra.',
      precio: 45000, stock: 60, marca: 'Optiland',
      categoriaId: accesorios.id,
      imagen: FOTOS.brownGlasses,
    },
    {
      nombre: 'Kit Limpieza Óptica',
      descripcion: 'Kit completo con spray limpiador, paños de microfibra y destornillador. Mantén tus lentes impecables.',
      precio: 35000, stock: 80, marca: 'Optiland',
      categoriaId: accesorios.id,
      imagen: FOTOS.roundGlasses,
    },
    {
      nombre: 'Cordón Anteojos Deportivo',
      descripcion: 'Cordón de silicona que sujeta tus gafas durante la actividad física.',
      precio: 18000, stock: 100, marca: 'Optiland',
      categoriaId: accesorios.id,
      imagen: FOTOS.aviatorSky,
    },
  ];

  for (const prod of productos) {
    const existente = await prisma.producto.findFirst({ where: { nombre: prod.nombre } });
    if (existente) {
      await prisma.producto.update({ where: { id: existente.id }, data: prod });
    } else {
      await prisma.producto.create({ data: prod });
    }
  }

  console.log(`✅ ${productos.length} productos creados/actualizados`);
  console.log('\n📋 Credenciales de acceso:');
  console.log('   Admin → admin@optiland.com / Admin123!');
  console.log('   User  → usuario@optiland.com / User123!');
  console.log('\n🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
