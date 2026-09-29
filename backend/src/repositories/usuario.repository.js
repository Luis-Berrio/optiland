const prisma = require('../config/database');

const CAMPOS_PUBLICOS = { id: true, nombre: true, apellido: true, email: true, telefono: true, rol: true, activo: true, createdAt: true };

const usuarioRepository = {
  findAll: () =>
    prisma.usuario.findMany({ select: CAMPOS_PUBLICOS, orderBy: { createdAt: 'desc' } }),

  findById: (id) =>
    prisma.usuario.findUnique({ where: { id }, select: { ...CAMPOS_PUBLICOS, password: false } }),

  findByEmail: (email) =>
    prisma.usuario.findUnique({ where: { email } }),

  create: (datos) =>
    prisma.usuario.create({ data: datos, select: CAMPOS_PUBLICOS }),

  update: (id, datos) =>
    prisma.usuario.update({ where: { id }, data: datos, select: CAMPOS_PUBLICOS }),

  delete: (id) =>
    prisma.usuario.delete({ where: { id } }),

  count: () =>
    prisma.usuario.count(),
};

module.exports = usuarioRepository;
