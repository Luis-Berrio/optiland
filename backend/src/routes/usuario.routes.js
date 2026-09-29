const { Router } = require('express');
const usuarioController = require('../controllers/usuario.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { soloAdmin } = require('../middlewares/rol.middleware');

const router = Router();

router.use(autenticar);

// Usuario autenticado
router.put('/perfil',           usuarioController.actualizarPerfil);
router.put('/cambiar-password', usuarioController.cambiarPassword);

// Admin
router.get('/',               soloAdmin, usuarioController.listar);
router.get('/:id',            soloAdmin, usuarioController.obtenerPorId);
router.patch('/:id/toggle',   soloAdmin, usuarioController.toggleActivo);
router.patch('/:id/rol',      soloAdmin, usuarioController.cambiarRol);

module.exports = router;
