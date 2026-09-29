require('dotenv').config();

const requeridas = ['DATABASE_URL', 'JWT_SECRET'];
requeridas.forEach((key) => {
  if (!process.env[key]) throw new Error(`❌ Variable de entorno faltante: ${key}`);
});

module.exports = {
  PORT:         process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET:   process.env.JWT_SECRET,
  JWT_EXPIRES:  process.env.JWT_EXPIRES || '7d',
  NODE_ENV:     process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
