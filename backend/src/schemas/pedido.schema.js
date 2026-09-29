const { z } = require('zod');

const crearPedidoSchema = z.object({
  direccion: z.string().min(5, 'Dirección requerida'),
  ciudad:    z.string().min(2, 'Ciudad requerida'),
  telefono:  z.string().optional(),
  notas:     z.string().optional(),
});

const actualizarEstadoSchema = z.object({
  estado: z.enum(['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'ENVIADO', 'ENTREGADO', 'CANCELADO']),
});

module.exports = { crearPedidoSchema, actualizarEstadoSchema };
