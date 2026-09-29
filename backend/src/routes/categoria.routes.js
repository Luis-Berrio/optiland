const { Router } = require('express');
const categoriaRepository = require('../repositories/categoria.repository');
const { autenticar } = require('../middlewares/auth.middleware');
const { soloAdmin } = require('../middlewares/rol.middleware');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categorias = await categoriaRepository.findAll();
    res.json({ success: true, data: categorias });
  } catch (error) { next(error); }
});

router.post('/', autenticar, soloAdmin, async (req, res, next) => {
  try {
    const categoria = await categoriaRepository.create(req.body);
    res.status(201).json({ success: true, data: categoria });
  } catch (error) { next(error); }
});

router.put('/:id', autenticar, soloAdmin, async (req, res, next) => {
  try {
    const categoria = await categoriaRepository.update(Number(req.params.id), req.body);
    res.json({ success: true, data: categoria });
  } catch (error) { next(error); }
});

router.delete('/:id', autenticar, soloAdmin, async (req, res, next) => {
  try {
    await categoriaRepository.delete(Number(req.params.id));
    res.json({ success: true, message: 'Categoría eliminada' });
  } catch (error) { next(error); }
});

module.exports = router;
