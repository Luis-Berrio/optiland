const prisma = require('../config/database');

const INCLUDE_CATEGORIA = { categoria: { select: { id: true, nombre: true, slug: true } } };

const productoRepository = {
  findAll: ({ categoriaId, estado, destacado, search, page = 1, limit = 12 } = {}) => {
    const where = {};
    if (categoriaId) where.categoriaId = Number(categoriaId);
    if (estado)      where.estado = estado;
    if (destacado !== undefined) where.destacado = destacado === 'true' || destacado === true;
    if (search)      where.OR = [
      { nombre:      { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
      { marca:       { contains: search, mode: 'insensitive' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);

    return Promise.all([
      prisma.producto.findMany({ where, include: INCLUDE_CATEGORIA, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
      prisma.producto.count({ where }),
    ]);
  },

  findById: (id) =>
    prisma.producto.findUnique({ where: { id }, include: INCLUDE_CATEGORIA }),

  create: (datos) =>
    prisma.producto.create({ data: datos, include: INCLUDE_CATEGORIA }),

  update: (id, datos) =>
    prisma.producto.update({ where: { id }, data: datos, include: INCLUDE_CATEGORIA }),

  delete: (id) =>
    prisma.producto.delete({ where: { id } }),

  count: () =>
    prisma.producto.count(),

  countByEstado: (estado) =>
    prisma.producto.count({ where: { estado } }),
};

module.exports = productoRepository;
