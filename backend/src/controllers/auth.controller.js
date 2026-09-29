const authService = require('../services/auth.service');

const authController = {
  registrar: async (req, res, next) => {
    try {
      const resultado = await authService.registrar(req.body);
      res.status(201).json({ success: true, data: resultado, message: 'Usuario registrado exitosamente' });
    } catch (error) { next(error); }
  },

  login: async (req, res, next) => {
    try {
      const resultado = await authService.login(req.body);
      res.json({ success: true, data: resultado });
    } catch (error) { next(error); }
  },

  perfil: async (req, res, next) => {
    try {
      const usuario = await authService.perfil(req.usuario.id);
      res.json({ success: true, data: usuario });
    } catch (error) { next(error); }
  },
};

module.exports = authController;
