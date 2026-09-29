const bcrypt = require('bcryptjs');
const usuarioRepository = require('../repositories/usuario.repository');
const { AppError } = require('../utils/AppError');

const usuarioService = {
  listar: () => usuarioRepository.findAll(),

  obtenerPorId: async (id) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new AppError('Usuario no encontrado', 404);
    return usuario;
  },

  actualizarPerfil: async (id, datos) => {
    const { password, rol, ...datosPermitidos } = datos;
    return usuarioRepository.update(id, datosPermitidos);
  },

  cambiarPassword: async (id, { passwordActual, passwordNueva }) => {
    const usuario = await usuarioRepository.findByEmail(
      (await usuarioRepository.findById(id)).email
    );
    const valido = await bcrypt.compare(passwordActual, usuario.password);
    if (!valido) throw new AppError('Contraseña actual incorrecta', 400);

    const hash = await bcrypt.hash(passwordNueva, 12);
    await usuarioRepository.update(id, { password: hash });
  },

  toggleActivo: async (id) => {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) throw new AppError('Usuario no encontrado', 404);
    return usuarioRepository.update(id, { activo: !usuario.activo });
  },

  cambiarRol: async (id, rol) => {
    await usuarioService.obtenerPorId(id);
    return usuarioRepository.update(id, { rol });
  },
};

module.exports = usuarioService;
