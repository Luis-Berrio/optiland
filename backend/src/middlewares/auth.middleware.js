const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { AppError } = require('../utils/AppError');

const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('Token no proporcionado', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { autenticar };
