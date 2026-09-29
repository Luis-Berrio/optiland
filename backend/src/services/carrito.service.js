const carritoRepository = require('../repositories/carrito.repository');
const productoRepository = require('../repositories/producto.repository');
const { AppError } = require('../utils/AppError');

const carritoService = {
  obtener: async (usuarioId) => {
    return carritoRepository.findOrCreate(usuarioId);
  },

  agregar: async (usuarioId, productoId, cantidad) => {
    const producto = await productoRepository.findById(productoId);
    if (!producto) throw new AppError('Producto no encontrado', 404);
    if (producto.estado !== 'ACTIVO') throw new AppError('Producto no disponible', 400);
    if (producto.stock < cantidad) throw new AppError(`Stock insuficiente. Disponible: ${producto.stock}`, 400);

    const carrito = await carritoRepository.findOrCreate(usuarioId);
    await carritoRepository.addItem(carrito.id, productoId, cantidad);
    return carritoRepository.findOrCreate(usuarioId);
  },

  actualizar: async (usuarioId, productoId, cantidad) => {
    const producto = await productoRepository.findById(productoId);
    if (!producto) throw new AppError('Producto no encontrado', 404);
    if (producto.stock < cantidad) throw new AppError(`Stock insuficiente. Disponible: ${producto.stock}`, 400);

    const carrito = await carritoRepository.findByUsuario(usuarioId);
    if (!carrito) throw new AppError('Carrito no encontrado', 404);

    await carritoRepository.updateItem(carrito.id, productoId, cantidad);
    return carritoRepository.findOrCreate(usuarioId);
  },

  eliminarItem: async (usuarioId, productoId) => {
    const carrito = await carritoRepository.findByUsuario(usuarioId);
    if (!carrito) throw new AppError('Carrito no encontrado', 404);

    await carritoRepository.removeItem(carrito.id, productoId);
    return carritoRepository.findOrCreate(usuarioId);
  },

  vaciar: async (usuarioId) => {
    const carrito = await carritoRepository.findByUsuario(usuarioId);
    if (!carrito) throw new AppError('Carrito no encontrado', 404);
    await carritoRepository.clearCarrito(carrito.id);
    return carritoRepository.findOrCreate(usuarioId);
  },
};

module.exports = carritoService;
