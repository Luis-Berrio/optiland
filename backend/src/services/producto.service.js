const productoRepository = require('../repositories/producto.repository');
const { AppError } = require('../utils/AppError');

const productoService = {
  listar: async (filtros) => {
    const [productos, total] = await productoRepository.findAll(filtros);
    const page  = Number(filtros?.page || 1);
    const limit = Number(filtros?.limit || 12);
    return {
      data: productos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  obtenerPorId: async (id) => {
    const producto = await productoRepository.findById(id);
    if (!producto) throw new AppError(`Producto con id ${id} no encontrado`, 404);
    return producto;
  },

  crear: async (datos) => {
    return productoRepository.create(datos);
  },

  actualizar: async (id, datos) => {
    await productoService.obtenerPorId(id);
    return productoRepository.update(id, datos);
  },

  eliminar: async (id) => {
    await productoService.obtenerPorId(id);
    return productoRepository.delete(id);
  },

  estadisticas: async () => {
    const [total, activos, agotados] = await Promise.all([
      productoRepository.count(),
      productoRepository.countByEstado('ACTIVO'),
      productoRepository.countByEstado('AGOTADO'),
    ]);
    return { total, activos, agotados };
  },
};

module.exports = productoService;
