const carritoService = require('../services/carrito.service');

const carritoController = {
  obtener: async (req, res, next) => {
    try {
      const carrito = await carritoService.obtener(req.usuario.id);
      res.json({ success: true, data: carrito });
    } catch (error) { next(error); }
  },

  agregar: async (req, res, next) => {
    try {
      const { productoId, cantidad } = req.body;
      const carrito = await carritoService.agregar(req.usuario.id, Number(productoId), Number(cantidad));
      res.json({ success: true, data: carrito, message: 'Producto agregado al carrito' });
    } catch (error) { next(error); }
  },

  actualizar: async (req, res, next) => {
    try {
      const carrito = await carritoService.actualizar(
        req.usuario.id,
        Number(req.params.productoId),
        Number(req.body.cantidad)
      );
      res.json({ success: true, data: carrito });
    } catch (error) { next(error); }
  },

  eliminarItem: async (req, res, next) => {
    try {
      const carrito = await carritoService.eliminarItem(req.usuario.id, Number(req.params.productoId));
      res.json({ success: true, data: carrito, message: 'Producto eliminado del carrito' });
    } catch (error) { next(error); }
  },

  vaciar: async (req, res, next) => {
    try {
      const carrito = await carritoService.vaciar(req.usuario.id);
      res.json({ success: true, data: carrito, message: 'Carrito vaciado' });
    } catch (error) { next(error); }
  },
};

module.exports = carritoController;
