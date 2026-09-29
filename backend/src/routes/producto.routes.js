const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const productoController = require('../controllers/producto.controller');
const { autenticar } = require('../middlewares/auth.middleware');
const { soloAdmin } = require('../middlewares/rol.middleware');
const { validar } = require('../middlewares/validate.middleware');
const { productoSchema, productoUpdateSchema } = require('../schemas/producto.schema');

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return cb(null, true);
    cb(new Error('Solo se permiten imágenes JPG, PNG o WebP'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Públicas
router.get('/',           productoController.listar);
router.get('/stats',      autenticar, soloAdmin, productoController.estadisticas);
router.get('/:id',        productoController.obtenerPorId);

// Protegidas (admin)
router.post('/',          autenticar, soloAdmin, upload.single('imagen'), productoController.crear);
router.put('/:id',        autenticar, soloAdmin, upload.single('imagen'), productoController.actualizar);
router.delete('/:id',     autenticar, soloAdmin, productoController.eliminar);

module.exports = router;
