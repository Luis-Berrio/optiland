const { Router } = require('express');
const pedidoController = require('../controllers/pedido.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { soloAdmin } = require('../middlewares/rol.middleware');
const { validar } = require('../middlewares/validate.middleware');
const { crearPedidoSchema, actualizarEstadoSchema } = require('../schemas/pedido.schema');

const router = Router();

router.use(autenticar);

router.get('/mis-pedidos',  pedidoController.misPedidos);
router.post('/',            validar(crearPedidoSchema), pedidoController.crear);
router.get('/:id',          pedidoController.obtenerPorId);

// Admin
router.get('/',             soloAdmin, pedidoController.listar);
router.patch('/:id/estado', soloAdmin, validar(actualizarEstadoSchema), pedidoController.actualizarEstado);

module.exports = router;
