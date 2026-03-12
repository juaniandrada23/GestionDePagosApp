const jwt = require('jsonwebtoken');
const config = require('../config');
const authRepo = require('../repositories/auth.repository');
const { UnauthorizedError, ForbiddenError } = require('../errors/AppError');

const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token no proporcionado'));
  }

  try {
    const payload = jwt.verify(header.split(' ')[1], config.jwtSecret, { algorithms: ['HS256'] });
    if (payload.jti && (await authRepo.estaEnListaNegra(payload.jti))) {
      return next(new UnauthorizedError('Token revocado'));
    }
    if (!payload.empresaId) {
      return next(new UnauthorizedError('Token sin empresa asociada'));
    }
    req.user = payload;
    next();
  } catch (err) {
    next(
      err instanceof UnauthorizedError ? err : new UnauthorizedError('Token inválido o expirado'),
    );
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.userRole !== 'Administrador') {
    throw new ForbiddenError('Acceso denegado: se requiere rol de administrador');
  }
  next();
};

module.exports = { auth, requireAdmin };
