const prisma = require('../config/database');

const INCLUDE_ITEMS = {
  items: {
    include: {
      producto: {
        select: { id: true, nombre: true, precio: true, precioOferta: true, imagen: true, stock: true, estado: true },
      },
    },
  },
};

const carritoRepository = {
  findByUsuario: (usuarioId) =>
    prisma.carrito.findUnique({ where: { usuarioId }, include: INCLUDE_ITEMS }),

  crearCarrito: (usuarioId) =>
    prisma.carrito.create({ data: { usuarioId }, include: INCLUDE_ITEMS }),

  findOrCreate: async (usuarioId) => {
    let carrito = await prisma.carrito.findUnique({ where: { usuarioId }, include: INCLUDE_ITEMS });
    if (!carrito) {
      carrito = await prisma.carrito.create({ data: { usuarioId }, include: INCLUDE_ITEMS });
    }
    return carrito;
  },

  findItem: (carritoId, productoId) =>
    prisma.carritoItem.findUnique({ where: { carritoId_productoId: { carritoId, productoId } } }),

  addItem: (carritoId, productoId, cantidad) =>
    prisma.carritoItem.upsert({
      where:  { carritoId_productoId: { carritoId, productoId } },
      update: { cantidad: { increment: cantidad } },
      create: { carritoId, productoId, cantidad },
    }),

  updateItem: (carritoId, productoId, cantidad) =>
    prisma.carritoItem.update({
      where: { carritoId_productoId: { carritoId, productoId } },
      data:  { cantidad },
    }),

  removeItem: (carritoId, productoId) =>
    prisma.carritoItem.delete({
      where: { carritoId_productoId: { carritoId, productoId } },
    }),

  clearCarrito: (carritoId) =>
    prisma.carritoItem.deleteMany({ where: { carritoId } }),
};

module.exports = carritoRepository;
