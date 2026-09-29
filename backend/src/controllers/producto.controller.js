const productoService = require('../services/producto.service');

const productoController = {
  listar: async (req, res, next) => {
    try {
      const resultado = await productoService.listar(req.query);
      res.json({ success: true, ...resultado });
    } catch (error) { next(error); }
  },

  obtenerPorId: async (req, res, next) => {
    try {
      const producto = await productoService.obtenerPorId(Number(req.params.id));
      res.json({ success: true, data: producto });
    } catch (error) { next(error); }
  },

  crear: async (req, res, next) => {
    try {
      const datos = { ...req.body };
      // Archivo subido con multer → prioridad sobre cualquier URL en body
      if (req.file) {
        datos.imagen = `/uploads/${req.file.filename}`;
      }
      // Quitar campos que no vamos a enviar como string vacío
      if (datos.imagen === '') delete datos.imagen;

      const producto = await productoService.crear(datos);
      res.status(201).json({ success: true, data: producto, message: 'Producto creado' });
    } catch (error) { next(error); }
  },

  actualizar: async (req, res, next) => {
    try {
      const datos = { ...req.body };

      // 1. Archivo subido → usa la nueva ruta /uploads
      if (req.file) {
        datos.imagen = `/uploads/${req.file.filename}`;
      }
      // 2. El admin limpió la imagen → guardar null explícito
      else if (datos.imagen === '__remove__') {
        datos.imagen = null;
      }
      // 3. No vino nada nuevo → no tocar el campo
      else if (datos.imagen === undefined || datos.imagen === '') {
        delete datos.imagen;
      }
      // 4. Si vino un string URL → se queda tal cual en datos.imagen

      const producto = await productoService.actualizar(Number(req.params.id), datos);
      res.json({ success: true, data: producto, message: 'Producto actualizado' });
    } catch (error) { next(error); }
  },

  eliminar: async (req, res, next) => {
    try {
      await productoService.eliminar(Number(req.params.id));
      res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) { next(error); }
  },

  estadisticas: async (req, res, next) => {
    try {
      const stats = await productoService.estadisticas();
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  },
};

module.exports = productoController;
