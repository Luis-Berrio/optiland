const prisma = require('../config/database');
const pedidoRepository   = require('../repositories/pedido.repository');
const carritoRepository  = require('../repositories/carrito.repository');
const productoRepository = require('../repositories/producto.repository');
const { AppError } = require('../utils/AppError');

const pedidoService = {
  listar: async (filtros) => {
    const [pedidos, total] = await pedidoRepository.findAll(filtros);
    const page  = Number(filtros?.page || 1);
    const limit = Number(filtros?.limit || 10);
    return { data: pedidos, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  },

  misPedidos: (usuarioId) =>
    pedidoRepository.findByUsuario(usuarioId),

  obtenerPorId: async (id, usuarioId, rol) => {
    const pedido = await pedidoRepository.findById(id);
    if (!pedido) throw new AppError('Pedido no encontrado', 404);
    if (rol !== 'ADMIN' && pedido.usuarioId !== usuarioId) {
      throw new AppError('No tienes acceso a este pedido', 403);
    }
    return pedido;
  },

  crear: async (usuarioId, { direccion, ciudad, telefono, notas }) => {
    const carrito = await carritoRepository.findByUsuario(usuarioId);
    if (!carrito || carrito.items.length === 0) {
      throw new AppError('El carrito está vacío', 400);
    }

    // Verificar stock de cada ítem
    for (const item of carrito.items) {
      if (item.producto.estado !== 'ACTIVO') {
        throw new AppError(`El producto "${item.producto.nombre}" no está disponible`, 400);
      }
      if (item.producto.stock < item.cantidad) {
        throw new AppError(`Stock insuficiente para "${item.producto.nombre}". Disponible: ${item.producto.stock}`, 400);
      }
    }

    // Calcular total
    const items = carrito.items.map((item) => {
      const precioUnit = Number(item.producto.precioOferta || item.producto.precio);
      return {
        productoId: item.productoId,
        cantidad:   item.cantidad,
        precioUnit,
        subtotal:   precioUnit * item.cantidad,
      };
    });

    const total = items.reduce((acc, i) => acc + i.subtotal, 0);

    // Crear pedido y descontar stock en transacción
    const pedido = await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          usuarioId,
          total,
          direccion,
          ciudad,
          telefono,
          notas,
          items: { create: items },
        },
        include: {
          items: { include: { producto: { select: { id: true, nombre: true, imagen: true } } } },
          usuario: { select: { id: true, nombre: true, apellido: true, email: true } },
        },
      });

      // Descontar stock
      for (const item of carrito.items) {
        await tx.producto.update({
          where: { id: item.productoId },
          data:  { stock: { decrement: item.cantidad } },
        });
      }

      // Vaciar carrito
      await tx.carritoItem.deleteMany({ where: { carritoId: carrito.id } });

      return nuevoPedido;
    });

    return pedido;
  },

  actualizarEstado: async (id, estado) => {
    const pedido = await pedidoRepository.findById(id);
    if (!pedido) throw new AppError('Pedido no encontrado', 404);
    return pedidoRepository.updateEstado(id, estado);
  },
};

module.exports = pedidoService;
