const { validationResult } = require("express-validator");
const { CustomResponse } = require("../../utils/customResponse");

function validationResultHandler(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new CustomResponse("Validasi Gagal!", null, errors.array()));
  }

  next();
}

module.exports = validationResultHandler;
