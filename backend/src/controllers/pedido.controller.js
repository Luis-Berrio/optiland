const pedidoService = require('../services/pedido.service');

const pedidoController = {
  listar: async (req, res, next) => {
    try {
      const resultado = await pedidoService.listar(req.query);
      res.json({ success: true, ...resultado });
    } catch (error) { next(error); }
  },

  misPedidos: async (req, res, next) => {
    try {
      const pedidos = await pedidoService.misPedidos(req.usuario.id);
      res.json({ success: true, data: pedidos });
    } catch (error) { next(error); }
  },

  obtenerPorId: async (req, res, next) => {
    try {
      const pedido = await pedidoService.obtenerPorId(
        Number(req.params.id),
        req.usuario.id,
        req.usuario.rol
      );
      res.json({ success: true, data: pedido });
    } catch (error) { next(error); }
  },

  crear: async (req, res, next) => {
    try {
      const pedido = await pedidoService.crear(req.usuario.id, req.body);
      res.status(201).json({ success: true, data: pedido, message: 'Pedido creado exitosamente' });
    } catch (error) { next(error); }
  },

  actualizarEstado: async (req, res, next) => {
    try {
      const pedido = await pedidoService.actualizarEstado(Number(req.params.id), req.body.estado);
      res.json({ success: true, data: pedido, message: 'Estado actualizado' });
    } catch (error) { next(error); }
  },
};

module.exports = pedidoController;
