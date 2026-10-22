const jwt = require("jsonwebtoken");
const { CustomResponse } = require("../utils/customResponse");

function authMiddleware(req, res, next) {
  // Ambil token dari header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(new CustomResponse("Token tidak ditemukan!"));
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token menggunakan JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan informasi pengguna untuk digunakan controller berikutnya
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(
          new CustomResponse("Token sudah kedaluwarsa. Silakan login kembali!"),
        );
    }

    return res.status(401).json(new CustomResponse("Token tidak valid."));
  }
}

module.exports = authMiddleware;
