const multer = require('multer');

const errorHandler = (err, req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'El archivo excede el tamaño máximo permitido (5MB)' });
    }
    return res.status(400).json({ error: `Error de archivo: ${err.message}` });
  }

  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json({ error: err.message });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(`[${req.method} ${req.path}]`, err);
  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = errorHandler;
