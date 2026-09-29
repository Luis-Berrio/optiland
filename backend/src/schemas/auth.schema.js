const { z } = require('zod');

const registroSchema = z.object({
  nombre:   z.string().min(2, 'Mínimo 2 caracteres').max(60),
  apellido: z.string().min(2, 'Mínimo 2 caracteres').max(60),
  email:    z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  telefono: z.string().optional(),
});

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

module.exports = { registroSchema, loginSchema };
