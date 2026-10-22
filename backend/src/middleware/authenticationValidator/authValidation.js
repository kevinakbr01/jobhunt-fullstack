const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nama wajib diisi!")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter!"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Format email tidak valid!")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Email maksimal 150 karakter!")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter!"),

  body("role")
    .isIn(["job_seeker", "recruiter"])
    .withMessage("Role harus job_seeker atau recruiter!"),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Format email tidak valid!")
    .bail()
    .isLength({ max: 150 })
    .withMessage("Email maksimal 150 karakter!")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password wajib diisi!"),
];

module.exports = { registerValidation, loginValidation };
