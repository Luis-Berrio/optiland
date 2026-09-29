const prisma = require('../config/database');

const INCLUDE_DETALLE = {
  usuario: { select: { id: true, nombre: true, apellido: true, email: true } },
  items: {
    include: {
      producto: { select: { id: true, nombre: true, imagen: true } },
    },
  },
};

const pedidoRepository = {
  findAll: ({ page = 1, limit = 10, estado } = {}) => {
    const where = estado ? { estado } : {};
    const skip  = (Number(page) - 1) * Number(limit);
    return Promise.all([
      prisma.pedido.findMany({ where, include: INCLUDE_DETALLE, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
      prisma.pedido.count({ where }),
    ]);
  },

  findByUsuario: (usuarioId) =>
    prisma.pedido.findMany({
      where: { usuarioId },
      include: INCLUDE_DETALLE,
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id) =>
    prisma.pedido.findUnique({ where: { id }, include: INCLUDE_DETALLE }),

  create: (datos) =>
    prisma.pedido.create({ data: datos, include: INCLUDE_DETALLE }),

  updateEstado: (id, estado) =>
    prisma.pedido.update({ where: { id }, data: { estado }, include: INCLUDE_DETALLE }),

  count: () =>
    prisma.pedido.count(),
};

module.exports = pedidoRepository;
