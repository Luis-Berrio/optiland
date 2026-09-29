const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioRepository = require('../repositories/usuario.repository');
const carritoRepository = require('../repositories/carrito.repository');
const { AppError } = require('../utils/AppError');
const { JWT_SECRET, JWT_EXPIRES } = require('../config/env');

const authService = {
  registrar: async ({ nombre, apellido, email, password, telefono }) => {
    const existe = await usuarioRepository.findByEmail(email);
    if (existe) throw new AppError('El email ya está registrado', 409);

    const hash = await bcrypt.hash(password, 12);
    const usuario = await usuarioRepository.create({ nombre, apellido, email, password: hash, telefono });

    // Crear carrito vacío para el nuevo usuario
    await carritoRepository.crearCarrito(usuario.id);

    const token = generarToken(usuario);
    return { token, usuario };
  },

  login: async ({ email, password }) => {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) throw new AppError('Credenciales inválidas', 401);
    if (!usuario.activo) throw new AppError('Cuenta desactivada, contacte al administrador', 403);

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) throw new AppError('Credenciales inválidas', 401);

    // Asegurar que tiene carrito
    await carritoRepository.findOrCreate(usuario.id);

    const token = generarToken(usuario);
    const { password: _, ...usuarioPublico } = usuario;
    return { token, usuario: usuarioPublico };
  },

  perfil: async (id) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new AppError('Usuario no encontrado', 404);
    return usuario;
  },
};

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

module.exports = authService;
