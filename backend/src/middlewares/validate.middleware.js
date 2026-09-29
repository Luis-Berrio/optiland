const { ZodError } = require('zod');

const validar = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errores = error.errors.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errores,
      });
    }
    next(error);
  }
};

module.exports = { validar };
