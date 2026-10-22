const { CustomResponse } = require("../utils/customResponse");

const databaseErrors = {
  ER_DUP_ENTRY: {
    statusCode: 409,
    message: "Data sudah terdaftar atau duplikat.",
  },
  ER_NO_REFERENCED_ROW_2: {
    statusCode: 409,
    message: "Data relasi yang dirujuk tidak ditemukan.",
  },
  ER_ROW_IS_REFERENCED_2: {
    statusCode: 409,
    message: "Data masih digunakan oleh data lain.",
  },
};

const errorHandler = (err, req, res, next) => {
  const databaseError = databaseErrors[err.code];
  const statusCode = err.statusCode || databaseError?.statusCode || 500;

  if (statusCode >= 500) {
    console.error("Server error:", err);
  }

  const message =
    statusCode >= 500
      ? "Terjadi kesalahan pada server!"
      : databaseError?.message || err.message || "Terjadi kesalahan!";

  return res.status(statusCode).json(new CustomResponse(message));
};

module.exports = errorHandler;
