const { z } = require('zod');

const productoSchema = z.object({
  nombre:       z.string().min(2).max(150),
  descripcion:  z.string().optional(),
  precio:       z.coerce.number().positive('El precio debe ser mayor a 0'),
  precioOferta: z.coerce.number().positive().optional().nullable(),
  stock:        z.coerce.number().int().min(0),
  marca:        z.string().optional(),
  modelo:       z.string().optional(),
  material:     z.string().optional(),
  color:        z.string().optional(),
  categoriaId:  z.coerce.number().int().positive(),
  estado:       z.enum(['ACTIVO', 'INACTIVO', 'AGOTADO']).optional(),
  destacado:    z.coerce.boolean().optional(),
  imagen:       z.string().optional().nullable(),
});

const productoUpdateSchema = productoSchema.partial();

module.exports = { productoSchema, productoUpdateSchema };
