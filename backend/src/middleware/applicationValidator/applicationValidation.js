const { body, param } = require("express-validator");

// Validasi ID lowongan pada URL
const applicationJobIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID lowongan harus berupa bilangan bulat positif!"),
];

// Validasi ID lamaran pada URL
const applicationIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID lamaran harus berupa bilangan bulat positif!"),
];

// Validasi saat job seeker membuat lamaran
const createApplicationValidation = [
  body("cover_letter")
    .optional({ values: "null" })
    .isString()
    .withMessage("Cover letter harus berupa teks!")
    .bail()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Cover letter maksimal 5000 karakter!"),
];

// Validasi perubahan status lamaran oleh recruiter
const updateApplicationStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status lamaran wajib diisi!")
    .bail()
    .isIn(["pending", "reviewed", "rejected"])
    .withMessage("Status lamaran harus pending, reviewed, atau rejected!"),
];

module.exports = {
  applicationJobIdValidation,
  applicationIdValidation,
  createApplicationValidation,
  updateApplicationStatusValidation,
};
