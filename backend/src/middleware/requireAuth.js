const { AppError } = require('../utils/appError');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return next(new AppError(401, 'No autenticado'));
  }

  return next();
}

module.exports = requireAuth;
