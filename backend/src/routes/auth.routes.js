const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { validar } = require('../middlewares/validate.middleware');
const { registroSchema, loginSchema } = require('../schemas/auth.schema');

const router = Router();

router.post('/registro', validar(registroSchema), authController.registrar);
router.post('/login',    validar(loginSchema),    authController.login);
router.get('/perfil',    autenticar,               authController.perfil);

module.exports = router;
