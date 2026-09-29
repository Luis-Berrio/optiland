const { AppError } = require('../utils/AppError');

const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'ADMIN') {
    return next(new AppError('Acceso denegado: se requiere rol ADMIN', 403));
  }
  next();
};

const soloAdminOPropietario = (campoId = 'id') => (req, res, next) => {
  const esAdmin = req.usuario?.rol === 'ADMIN';
  const esPropietario = req.usuario?.id === Number(req.params[campoId]);
  if (!esAdmin && !esPropietario) {
    return next(new AppError('No tienes permisos para esta acción', 403));
  }
  next();
};

module.exports = { soloAdmin, soloAdminOPropietario };
