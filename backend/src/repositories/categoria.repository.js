const prisma = require('../config/database');

const categoriaRepository = {
  findAll: () =>
    prisma.categoria.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } }),

  findById: (id) =>
    prisma.categoria.findUnique({ where: { id } }),

  create: (datos) =>
    prisma.categoria.create({ data: datos }),

  update: (id, datos) =>
    prisma.categoria.update({ where: { id }, data: datos }),

  delete: (id) =>
    prisma.categoria.delete({ where: { id } }),
};

module.exports = categoriaRepository;
