const { z } = require('zod');

const agregarItemSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad:   z.coerce.number().int().min(1).max(99),
});

const actualizarCantidadSchema = z.object({
  cantidad: z.coerce.number().int().min(1).max(99),
});

module.exports = { agregarItemSchema, actualizarCantidadSchema };
