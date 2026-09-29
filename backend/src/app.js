const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middlewares/error.middleware');

const authRouter     = require('./routes/auth.routes');
const productoRouter = require('./routes/producto.routes');
const carritoRouter  = require('./routes/carrito.routes');
const pedidoRouter   = require('./routes/pedido.routes');
const usuarioRouter  = require('./routes/usuario.routes');
const categoriaRouter = require('./routes/categoria.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas API
app.use('/api/v1/auth',       authRouter);
app.use('/api/v1/productos',  productoRouter);
app.use('/api/v1/carrito',    carritoRouter);
app.use('/api/v1/pedidos',    pedidoRouter);
app.use('/api/v1/usuarios',   usuarioRouter);
app.use('/api/v1/categorias', categoriaRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Ruta ${req.originalUrl} no encontrada` });
});

// Error handler global
app.use(errorHandler);

module.exports = app;
