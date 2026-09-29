const { AppError } = require('../utils/AppError');

const errorHandler = (error, req, res, next) => {
  // Error operacional controlado
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Prisma: registro no encontrado
  if (error.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Recurso no encontrado' });
  }

  // Prisma: restricción única violada
  if (error.code === 'P2002') {
    const campo = error.meta?.target?.[0] || 'campo';
    return res.status(409).json({ success: false, message: `Ya existe un registro con ese ${campo}` });
  }

  // Prisma: relación no encontrada
  if (error.code === 'P2003') {
    return res.status(400).json({ success: false, message: 'Referencia a registro inexistente' });
  }

  // JWT inválido
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expirado' });
  }

  // Error inesperado
  console.error('💥 Error inesperado:', error);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : error.message,
  });
};

module.exports = { errorHandler };
