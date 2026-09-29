const app = require('./src/app');
const { PORT } = require('./src/config/env');

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV}`);
});
