const authorizationMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Cek apakah user sudah terautentikasi
      if (!req.user) {
        const error = new Error("Autentikasi diperlukan!");
        error.statusCode = 401;
        throw error;
      }

      // Cek apakah role user diizinkan
      if (!allowedRoles.includes(req.user.role)) {
        const error = new Error("Anda tidak memiliki akses!");
        error.statusCode = 403;
        throw error;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorizationMiddleware;
