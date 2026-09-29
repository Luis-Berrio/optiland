const { Router } = require('express');
const carritoController = require('../controllers/carrito.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { validar } = require('../middlewares/validate.middleware');
const { agregarItemSchema, actualizarCantidadSchema } = require('../schemas/carrito.schema');

const router = Router();

router.use(autenticar);

router.get('/',                         carritoController.obtener);
router.post('/items',                   validar(agregarItemSchema), carritoController.agregar);
router.put('/items/:productoId',        validar(actualizarCantidadSchema), carritoController.actualizar);
router.delete('/items/:productoId',     carritoController.eliminarItem);
router.delete('/',                      carritoController.vaciar);

module.exports = router;
