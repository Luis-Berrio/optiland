const usuarioService = require('../services/usuario.service');

const usuarioController = {
  listar: async (req, res, next) => {
    try {
      const usuarios = await usuarioService.listar();
      res.json({ success: true, data: usuarios });
    } catch (error) { next(error); }
  },

  obtenerPorId: async (req, res, next) => {
    try {
      const usuario = await usuarioService.obtenerPorId(Number(req.params.id));
      res.json({ success: true, data: usuario });
    } catch (error) { next(error); }
  },

  actualizarPerfil: async (req, res, next) => {
    try {
      const id = req.usuario.rol === 'ADMIN' ? Number(req.params.id) : req.usuario.id;
      const usuario = await usuarioService.actualizarPerfil(id, req.body);
      res.json({ success: true, data: usuario, message: 'Perfil actualizado' });
    } catch (error) { next(error); }
  },

  cambiarPassword: async (req, res, next) => {
    try {
      await usuarioService.cambiarPassword(req.usuario.id, req.body);
      res.json({ success: true, message: 'Contraseña actualizada' });
    } catch (error) { next(error); }
  },

  toggleActivo: async (req, res, next) => {
    try {
      const usuario = await usuarioService.toggleActivo(Number(req.params.id));
      res.json({ success: true, data: usuario });
    } catch (error) { next(error); }
  },

  cambiarRol: async (req, res, next) => {
    try {
      const usuario = await usuarioService.cambiarRol(Number(req.params.id), req.body.rol);
      res.json({ success: true, data: usuario });
    } catch (error) { next(error); }
  },
};

module.exports = usuarioController;
